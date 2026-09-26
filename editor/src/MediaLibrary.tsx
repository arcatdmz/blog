import { useEditorRoute } from "./routing";
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
import { useI18n } from "./i18n";

const mediaErrors: Record<string, string> = {
  "Image conversion failed.": "画像を変換できませんでした。",
  "Choose an edge between 100–12000 and quality between 10–100.":
    "最大辺は100〜12000ピクセル、画質は10〜100で指定してください。",
  "This browser cannot decode this file. Export it as JPEG or PNG, then choose that file.":
    "このブラウザーでは画像を読み込めません。JPEG または PNG で書き出してから、もう一度選択してください。",
  "Use letters, numbers, dashes, or underscores in the filename.":
    "ファイル名には半角英数字、ハイフン、アンダースコアを使用してください。",
  "This image exceeds 10 MiB. Optimize it before adding.":
    "画像が10 MiBを超えています。最適化してから追加してください。",
  "Choose JPEG, PNG, WebP, or GIF, or use Convert first. The filename extension must match the image.":
    "JPEG、PNG、WebP、GIF の画像を選ぶか、先に変換してください。拡張子は画像形式と一致させてください。"
};

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
  const { t } = useI18n();
  const [route, navigate] = useEditorRoute();
  const search = route.mediaSearch;
  const setSearch = (mediaSearch: string) => navigate({ mediaSearch }, true);
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
      title={
        onPick
          ? t("Choose an image", "画像を選択")
          : t("Image library", "画像ライブラリ")
      }
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p className="hint">
        {t(
          "Uploads and deletions stay on this device until Save changes commits them to GitHub.",
          "画像の追加や削除はこの端末に保存されます。「変更を保存」で GitHub に反映されます。"
        )}
      </p>
      <fieldset disabled={busy}>
        <div className="button-row media-toolbar">
          <input
            aria-label={t("Search images", "画像を検索")}
            type="search"
            placeholder={t("Search filenames…", "ファイル名で検索…")}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setLimit(40);
            }}
          />
          <button onClick={() => fileInput.current?.click()}>
            {t("Upload image", "画像をアップロード")}
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
            <h3>{t("Prepare upload", "アップロードの準備")}</h3>
            <img
              className="upload-preview"
              src={preview}
              alt={t("Upload preview", "アップロードする画像のプレビュー")}
            />
            <label>
              {t("Filename", "ファイル名")}
              <input value={name} onChange={e => setName(e.target.value)} />
            </label>
            <p>
              {candidate === file
                ? t("Original", "元の画像")
                : t("Converted", "変換後")}
              : {bytesLabel(candidate.size)} · {t("Original", "元の画像")}:{" "}
              {bytesLabel(file.size)} · {t("Limit", "上限")}: 10 MiB
            </p>
            <div className="form-grid">
              <label>
                {t("Maximum edge (pixels)", "最大辺（ピクセル）")}
                <input
                  type="number"
                  min="100"
                  max="12000"
                  value={edge}
                  onChange={e => setEdge(Number(e.target.value))}
                />
              </label>
              <label>
                {t("JPEG quality (%)", "JPEG の画質（%）")}
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
              {t(
                "Optimization keeps PNG transparency. Other formats become JPEG; animated images become a still image. To preserve animation, keep the original.",
                "PNG の透明部分は維持されます。他の形式は JPEG に、アニメーションは静止画に変換されます。動きを残す場合は元の画像を使用してください。"
              )}
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
                {t(
                  "Preview optimization / convert",
                  "最適化・変換をプレビュー"
                )}
              </button>
              <button
                onClick={() => {
                  setCandidate(file);
                  setName(safeImageName(file.name));
                }}
              >
                {t("Keep original", "元の画像を使用")}
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
                {t("Add to pending uploads", "アップロード待ちに追加")}
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setCandidate(null);
                }}
              >
                {t("Cancel upload", "アップロードを取り消す")}
              </button>
            </div>
          </section>
        )}
        {error && (
          <p className="error" role="alert">
            {t(error, mediaErrors[error] ?? error)}
          </p>
        )}
        {busy && <p role="status">{t("Checking…", "確認中…")}</p>}
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
                  {entry.pending
                    ? t("Pending upload", "アップロード待ち")
                    : t("On GitHub", "GitHub に保存済み")}
                  {entry.size ? ` · ${bytesLabel(entry.size)}` : ""}
                </small>
                <div className="button-row">
                  {deleting ? (
                    <button onClick={() => onUndoDelete(entry.path)}>
                      {t("Undo deletion", "削除を取り消す")}
                    </button>
                  ) : (
                    <>
                      {onPick && (
                        <button
                          className="primary"
                          onClick={() => onPick(imageUrl(entry.path))}
                        >
                          {t("Choose", "選択")}
                        </button>
                      )}
                      {onInsert && (
                        <button onClick={() => onInsert(imageUrl(entry.path))}>
                          {t("Insert", "挿入")}
                        </button>
                      )}
                      {onCover && (
                        <button onClick={() => onCover(imageUrl(entry.path))}>
                          {t("Use as cover", "カバーに設定")}
                        </button>
                      )}
                      <button onClick={() => run(() => onDelete(entry.path))}>
                        {entry.pending
                          ? t("Remove upload", "アップロードを削除")
                          : t("Delete", "削除")}
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
            {t(
              `Show more images (${all.length - limit} remaining)`,
              `さらに表示（残り${all.length - limit}枚）`
            )}
          </button>
        )}
        {!all.length && (
          <p className="empty">
            {t(
              "No images match this search.",
              "条件に一致する画像はありません。"
            )}
          </p>
        )}
      </fieldset>
    </Modal>
  );
}
