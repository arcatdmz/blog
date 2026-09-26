import { useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_IMAGE_BYTES,
  imageUrl,
  safeImageName,
  imageMime,
  mimeMatchesPath,
  type Entry,
  type PendingImage,
  type Deletion
} from "../shared/model";
import Modal from "./Modal";

const bytesLabel = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KiB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
async function decode(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function optimize(
  blob: Blob,
  maxEdge: number,
  quality: number,
  preserveAlpha: boolean
) {
  const image = await decode(blob);
  const scale = Math.min(
    1,
    maxEdge / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d")!;
  if (!preserveAlpha) {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      result =>
        result
          ? resolve(result)
          : reject(new Error("Image conversion failed.")),
      preserveAlpha ? "image/png" : "image/jpeg",
      quality
    )
  );
}

export default function MediaLibrary({
  entries,
  pending,
  deletions,
  resolveImage,
  onClose,
  onStage,
  onDelete,
  onUndoDelete,
  onInsert,
  onCover,
  onPick
}: {
  entries: Entry[];
  pending: PendingImage[];
  deletions: Deletion[];
  resolveImage: (path: string) => string;
  onClose: () => void;
  onStage: (image: PendingImage) => Promise<void>;
  onDelete: (path: string) => Promise<void>;
  onUndoDelete: (path: string) => void;
  onInsert?: (url: string) => void;
  onCover?: (url: string) => void;
  onPick?: (url: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [candidate, setCandidate] = useState<Blob | null>(null);
  const [name, setName] = useState("");
  const [edge, setEdge] = useState(2400);
  const [quality, setQuality] = useState(85);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(40);
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!candidate) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(candidate);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [candidate]);
  const all = useMemo(
    () =>
      [
        ...pending.map(p => ({
          path: p.path,
          pending: true,
          size: p.blob.size
        })),
        ...entries
          .filter(e => !pending.some(p => p.path === e.path))
          .map(e => ({ ...e, pending: false }))
      ].filter(e => e.path.toLowerCase().includes(search.toLowerCase())),
    [pending, entries, search]
  );
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={onPick ? "Choose an image" : "Image library"}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p className="hint">
        Uploads and deletions stay on this device until Save changes commits
        them to GitHub.
      </p>
      <fieldset disabled={busy}>
        <div className="button-row">
          <input
            aria-label="Search images"
            type="search"
            placeholder="Search filenames…"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setLimit(40);
            }}
          />
          <button onClick={() => fileInput.current?.click()}>
            Upload image
          </button>
        </div>
        <input
          hidden
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={event => {
            const selected = event.target.files?.[0];
            if (selected) {
              setFile(selected);
              setCandidate(selected);
              setName(safeImageName(selected.name));
              setError("");
            }
            event.target.value = "";
          }}
        />
        {file && candidate && (
          <section className="upload-panel">
            <h3>Prepare upload</h3>
            <img
              className="upload-preview"
              src={preview}
              alt="Upload preview"
            />
            <label>
              Filename
              <input value={name} onChange={e => setName(e.target.value)} />
            </label>
            <p>
              {candidate === file ? "Original" : "Converted"}:{" "}
              {bytesLabel(candidate.size)} · Original: {bytesLabel(file.size)} ·
              Limit: 10 MiB
            </p>
            <div className="form-grid">
              <label>
                Maximum edge (pixels)
                <input
                  type="number"
                  min="100"
                  max="12000"
                  value={edge}
                  onChange={e => setEdge(Number(e.target.value))}
                />
              </label>
              <label>
                JPEG quality (%)
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                />
              </label>
            </div>
            <p className="hint">
              Optimization keeps PNG transparency. Other formats become JPEG;
              animated images become a still image. To preserve animation, keep
              the original.
            </p>
            <div className="button-row">
              <button
                onClick={() =>
                  run(async () => {
                    if (
                      edge < 100 ||
                      edge > 12000 ||
                      quality < 10 ||
                      quality > 100
                    )
                      throw new Error(
                        "Choose an edge between 100–12000 and quality between 10–100."
                      );
                    const mime = imageMime(
                      new Uint8Array(await file.slice(0, 16).arrayBuffer())
                    );
                    let result: Blob;
                    try {
                      result = await optimize(
                        file,
                        edge,
                        quality / 100,
                        mime === "image/png"
                      );
                    } catch {
                      throw new Error(
                        "This browser cannot decode this file. Export it as JPEG or PNG, then choose that file."
                      );
                    }
                    setCandidate(result);
                    setName(
                      safeImageName(
                        file.name.replace(/\.[^.]*$/, "") +
                          (result.type === "image/png" ? ".png" : ".jpg")
                      )
                    );
                  })
                }
              >
                Preview optimization / convert
              </button>
              <button
                onClick={() => {
                  setCandidate(file);
                  setName(safeImageName(file.name));
                }}
              >
                Keep original
              </button>
              <button
                className="primary"
                onClick={() =>
                  run(async () => {
                    const path = `public/images/${name}`;
                    if (name !== safeImageName(name))
                      throw new Error(
                        "Use letters, numbers, dashes, or underscores in the filename."
                      );
                    if (candidate.size > MAX_IMAGE_BYTES)
                      throw new Error(
                        "This image exceeds 10 MiB. Optimize it before adding."
                      );
                    const mime = imageMime(
                      new Uint8Array(await candidate.slice(0, 16).arrayBuffer())
                    );
                    if (!mime || !mimeMatchesPath(mime, path))
                      throw new Error(
                        "Choose JPEG, PNG, WebP, or GIF, or use Convert first. The filename extension must match the image."
                      );
                    await onStage({ path, blob: candidate });
                    setFile(null);
                    setCandidate(null);
                  })
                }
              >
                Add to pending uploads
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setCandidate(null);
                }}
              >
                Cancel upload
              </button>
            </div>
          </section>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {busy && <p role="status">Checking…</p>}
        <div className="media-grid">
          {all.slice(0, limit).map(entry => {
            const deleting = deletions.some(d => d.path === entry.path);
            return (
              <article
                key={entry.path}
                className={`media-card ${deleting ? "deleting" : ""}`}
              >
                <img loading="lazy" src={resolveImage(entry.path)} alt="" />
                <p className="filename">
                  {entry.path.slice("public/images/".length)}
                </p>
                <small>
                  {entry.pending ? "Pending upload" : "On GitHub"}
                  {entry.size ? ` · ${bytesLabel(entry.size)}` : ""}
                </small>
                <div className="button-row">
                  {deleting ? (
                    <button onClick={() => onUndoDelete(entry.path)}>
                      Undo deletion
                    </button>
                  ) : (
                    <>
                      {onPick && (
                        <button
                          className="primary"
                          onClick={() => onPick(imageUrl(entry.path))}
                        >
                          Choose
                        </button>
                      )}
                      {onInsert && (
                        <button onClick={() => onInsert(imageUrl(entry.path))}>
                          Insert
                        </button>
                      )}
                      {onCover && (
                        <button onClick={() => onCover(imageUrl(entry.path))}>
                          Use as cover
                        </button>
                      )}
                      <button onClick={() => run(() => onDelete(entry.path))}>
                        {entry.pending ? "Remove upload" : "Delete"}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {all.length > limit && (
          <button onClick={() => setLimit(n => n + 40)}>
            Show more images ({all.length - limit} remaining)
          </button>
        )}
        {!all.length && <p className="empty">No images match this search.</p>}
      </fieldset>
    </Modal>
  );
}
