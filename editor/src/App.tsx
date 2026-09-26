import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  newDocument,
  splitDocument,
  updateMetadata,
  validateDocument
} from "../shared/document";
import {
  imageUrl,
  mediaPath,
  MAX_CHANGES,
  REPOSITORY,
  WORKFLOW_URL,
  type Index,
  type Post,
  type Recovery,
  type PendingImage,
  type SaveResult,
  type PostChange
} from "../shared/model";
import {
  ApiError,
  checkReferences,
  checkSave,
  commitChanges,
  getIndex,
  getPost,
  remoteImage,
  uploadImage
} from "./api";
import {
  cachePost,
  deleteRecovery,
  getCachedPost,
  listRecovery,
  putRecovery
} from "./storage";
import WritingArea, { type WritingHandle } from "./WritingArea";
import Modal from "./Modal";
import FeatureBoundary from "./FeatureBoundary";
import type { Figure, FigureRange } from "./figures";

const Preview = lazy(() => import("./Preview"));
const FigureDialog = lazy(() => import("./FigureDialog"));
const MediaLibrary = lazy(() => import("./MediaLibrary"));
const MEDIA = "@media";
const emptyIndex: Index = { head: "", posts: [], media: [] };
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

export default function App() {
  const [index, setIndex] = useState<Index>(emptyIndex);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("ja");
  const [active, setActive] = useState("");
  const [initialBody, setInitialBody] = useState("");
  const [editorVersion, setEditorVersion] = useState(0);
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [images, setImages] = useState<PendingImage[]>([]);
  const [deletions, setDeletions] = useState<Recovery["deletions"]>([]);
  const [recoveries, setRecoveries] = useState<Recovery[]>([]);
  const [modified, setModified] = useState(false);
  const [localStatus, setLocalStatus] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewBody, setPreviewBody] = useState("");
  const [newPost, setNewPost] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [figure, setFigure] = useState<{
    initial: Figure;
    range: FigureRange | null;
    cursor: number;
  } | null>(null);
  const [remote, setRemote] = useState<Post | null>(null);
  const [rawFrontmatter, setRawFrontmatter] = useState<string | null>(null);
  const [lastSave, setLastSave] = useState<SaveResult | null>(null);
  const work = useRef<Recovery | null>(null);
  const writing = useRef<WritingHandle>(null);
  const composing = useRef(false);
  const recoveryTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const pickImage = useRef<((url: string) => void) | null>(null);
  const generation = useRef(0);
  const selection = useRef({ start: 0, end: 0, text: "" });
  const saveAction = useRef<() => void>(() => {});

  const refreshRecovery = useCallback(
    async () =>
      setRecoveries(
        (await listRecovery()).sort((a, b) => b.updatedAt - a.updatedAt)
      ),
    []
  );
  const persist = useCallback(async () => {
    clearTimeout(recoveryTimer.current);
    const current = work.current;
    if (!current) return;
    if (
      current.post.content === current.original &&
      !current.images.length &&
      !current.deletions.length &&
      (current.post.sha !== null || current.post.path === MEDIA)
    ) {
      await deleteRecovery(current.post.path);
      await refreshRecovery();
      return;
    }
    await putRecovery({ ...current, updatedAt: Date.now() });
    setLocalStatus("Recovery saved on this device");
    await refreshRecovery();
  }, [refreshRecovery]);
  const queueRecovery = useCallback(() => {
    clearTimeout(recoveryTimer.current);
    recoveryTimer.current = setTimeout(() => {
      if (composing.current) {
        queueRecovery();
        return;
      }
      void persist().catch(error => {
        setLocalStatus("Local recovery failed — export your work");
        setError(message(error));
      });
    }, 800);
  }, [persist]);

  const changed = useCallback(
    (patch: Partial<Recovery>) => {
      if (!work.current) return;
      work.current = {
        ...work.current,
        ...patch,
        saveId: undefined,
        updatedAt: Date.now()
      };
      setModified(true);
      setLocalStatus("Waiting to save recovery…");
      setLastSave(null);
      queueRecovery();
    },
    [queueRecovery]
  );
  // Cache the header: parsing frontmatter belongs to opening/metadata changes,
  // never to the per-keystroke input handler.
  const header = useRef("");
  const newline = useRef("\n");
  const fastBodyInput = useCallback(
    (body: string) => {
      if (!work.current) return;
      changed({
        post: {
          ...work.current.post,
          content:
            header.current +
            (newline.current === "\r\n" ? body.replace(/\r?\n/g, "\r\n") : body)
        }
      });
    },
    [changed]
  );

  const activate = useCallback((value: Recovery) => {
    clearTimeout(recoveryTimer.current);
    work.current = value;
    const parsed =
      value.post.path === MEDIA ? null : splitDocument(value.post.content);
    header.current = parsed?.header || "";
    newline.current = parsed?.newline || "\n";
    setActive(value.post.path);
    setInitialBody(parsed?.body || "");
    setMetadata(parsed?.data || {});
    setImages(value.images);
    setDeletions(value.deletions);
    setEditorVersion(n => n + 1);
    setModified(
      value.post.content !== value.original ||
        !!value.images.length ||
        !!value.deletions.length ||
        (value.post.path !== MEDIA && value.post.sha === null)
    );
    setTab("write");
    setError("");
    setStatus("");
    setRemote(null);
    setLastSave(null);
    setLocalStatus("");
  }, []);
  const hydrate = useCallback(async (next: Index, run: number) => {
    const entries = [...next.posts];
    await Promise.all(
      Array.from({ length: 4 }, async () => {
        while (entries.length && run === generation.current) {
          const entry = entries.shift()!;
          try {
            let post = await getCachedPost(entry.sha).catch(() => undefined);
            if (!post) {
              post = await getPost(entry.path, next.head);
              void cachePost(post).catch(() => {});
            }
            const title = String(
              splitDocument(post.content).data.title || entry.path
            );
            if (run === generation.current)
              setTitles(t => ({ ...t, [entry.path]: title }));
          } catch {
            /* A post still remains visible/searchable by its filename. */
          }
        }
      })
    );
  }, []);
  const refresh = useCallback(async () => {
    const next = await getIndex();
    setIndex(next);
    void hydrate(next, ++generation.current);
    return next;
  }, [hydrate]);
  useEffect(() => {
    setLoading(true);
    void refresh()
      .catch(error => setError(message(error)))
      .finally(() => setLoading(false));
    void refreshRecovery().catch(() =>
      setError(
        "Local recovery storage is unavailable. Enable browser storage before editing."
      )
    );
    return () => {
      generation.current++;
    };
  }, [refresh, refreshRecovery]);
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void persist().catch(() => {});
    };
    const onUnload = (event: BeforeUnloadEvent) => {
      const current = work.current;
      if (
        current &&
        (current.post.content !== current.original ||
          current.images.length ||
          current.deletions.length)
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!document.querySelector("dialog[open]")) saveAction.current();
      }
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("keydown", onKey);
    };
  }, [persist]);

  const openPost = async (path: string) => {
    setLoading(true);
    setError("");
    try {
      await persist();
      const recovery = (await listRecovery()).find(r => r.post.path === path);
      if (recovery) {
        activate(recovery);
        setLocalStatus("Restored work from this device");
        return;
      }
      const next = await refresh();
      const post = await getPost(path, next.head);
      activate({
        version: 1,
        post,
        original: post.content,
        baseHead: next.head,
        images: [],
        deletions: [],
        updatedAt: Date.now()
      });
    } catch (error) {
      setError(message(error));
    } finally {
      setLoading(false);
    }
  };
  const metadataChange = (patch: Record<string, unknown>) => {
    if (!work.current) return;
    try {
      const content = updateMetadata(work.current.post.content, patch);
      const parsed = splitDocument(content);
      header.current = parsed.header;
      setMetadata(parsed.data);
      newline.current = parsed.newline;
      changed({ post: { ...work.current.post, content } });
    } catch (error) {
      setError(message(error));
    }
  };
  const objectUrls = useMemo(
    () =>
      new Map(
        images.map(image => [image.path, URL.createObjectURL(image.blob)])
      ),
    [images]
  );
  useEffect(
    () => () => objectUrls.forEach(url => URL.revokeObjectURL(url)),
    [objectUrls]
  );
  const resolveImage = useCallback(
    (path: string) => objectUrls.get(path) || remoteImage(path, index.head),
    [objectUrls, index.head]
  );
  const resolveFigureImage = useCallback(
    (src: string) => {
      const path = mediaPath(src);
      return path ? resolveImage(path) : src;
    },
    [resolveImage]
  );

  const insert = (
    text: string,
    start = selection.current.start,
    end = selection.current.end
  ) => {
    setTab("write");
    // Write and Preview are hidden rather than replacing the textarea, preserving
    // the native undo history and selection across tabs.
    requestAnimationFrame(() => writing.current?.replace(start, end, text));
  };
  const rememberSelection = () => {
    if (writing.current) selection.current = writing.current.selection();
  };
  const wrap = (before: string, after = "") => {
    rememberSelection();
    insert(`${before}${selection.current.text}${after}`);
  };
  const editFigure = useCallback(async (range: FigureRange) => {
    const { parseFigure } = await import("./figures");
    const initial = parseFigure(range.source);
    if (!initial) {
      setTab("write");
      setStatus(
        "This figure uses custom HTML. Its original source is selected for editing."
      );
      requestAnimationFrame(() =>
        writing.current?.focus(range.start, range.end)
      );
      return;
    }
    setFigure({ initial, range, cursor: range.start });
  }, []);
  const openFigure = async () => {
    rememberSelection();
    const { findFigures, emptyFigure } = await import("./figures");
    const body = splitDocument(work.current!.post.content).body.replace(
      /\r\n/g,
      "\n"
    );
    const range = findFigures(body).find(
      r => selection.current.start >= r.start && selection.current.start < r.end
    );
    if (range) editFigure(range);
    else
      setFigure({
        initial: emptyFigure(),
        range: null,
        cursor: selection.current.start
      });
  };
  const openMedia = async () => {
    rememberSelection();
    if (!work.current) {
      const recovered = (await listRecovery()).find(r => r.post.path === MEDIA);
      activate(
        recovered || {
          version: 1,
          post: { path: MEDIA, sha: null, content: "" },
          original: "",
          baseHead: index.head,
          images: [],
          deletions: [],
          updatedAt: Date.now()
        }
      );
    }
    pickImage.current = null;
    setMediaOpen(true);
  };
  const stageImage = async (image: PendingImage) => {
    if (!work.current) return;
    if (
      index.media.some(e => e.path === image.path) ||
      work.current.images.some(e => e.path === image.path)
    )
      throw new Error(
        "That filename already exists. Choose a new name; images are never overwritten."
      );
    if (
      work.current.images.length + work.current.deletions.length >=
      MAX_CHANGES
    )
      throw new Error(
        `Save the current ${MAX_CHANGES} image changes before adding more.`
      );
    const next = [...work.current.images, image];
    setImages(next);
    changed({ images: next });
    await persist();
  };
  const postChange = (): PostChange | undefined =>
    work.current && work.current.post.path !== MEDIA
      ? {
          path: work.current.post.path,
          expectedSha: work.current.post.sha,
          content: work.current.post.content
        }
      : undefined;
  const deleteImage = async (path: string) => {
    const { referencedMedia } = await import("../shared/references");
    const current = work.current!;
    const localReferences = (await listRecovery())
      .filter(r => r.post.path !== current.post.path && r.post.path !== MEDIA)
      .filter(r => referencedMedia(r.post.content).has(path))
      .map(r => r.post.path);
    const refs = current.images.some(i => i.path === path)
      ? {
          [path]:
            current.post.path !== MEDIA &&
            referencedMedia(current.post.content).has(path)
              ? [current.post.path]
              : []
        }
      : await checkReferences([path], postChange());
    const blockers = [...new Set([...(refs[path] || []), ...localReferences])];
    if (blockers.length)
      throw new Error(
        `Still used by: ${blockers.join(", ")}. Remove those references first.`
      );
    if (
      !window.confirm(
        `Stage deletion of ${path.split("/").pop()}? This takes effect only when you Save changes.`
      )
    )
      return;
    if (current.images.some(i => i.path === path)) {
      const next = current.images.filter(i => i.path !== path);
      setImages(next);
      changed({ images: next });
    } else {
      const entry = index.media.find(e => e.path === path)!;
      if (current.images.length + current.deletions.length >= MAX_CHANGES)
        throw new Error(`Save the current ${MAX_CHANGES} changes first.`);
      const next = [...current.deletions, { path, expectedSha: entry.sha }];
      setDeletions(next);
      changed({ deletions: next });
    }
    await persist();
  };
  const exportPost = () => {
    if (!work.current) return;
    const url = URL.createObjectURL(
      new Blob([work.current.post.content], {
        type: "text/markdown;charset=utf-8"
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = work.current.post.path.split("/").pop() || "post.md";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const save = async () => {
    if (!work.current || saving || composing.current) return;
    setSaving(true);
    setError("");
    setStatus("Preparing save…");
    try {
      const current = work.current;
      if (current.post.path !== MEDIA) validateDocument(current.post.content);
      const previousId = current.saveId;
      const id = previousId || crypto.randomUUID();
      work.current = { ...current, saveId: id };
      await persist();
      let result = previousId ? await checkSave(previousId) : null;
      if (!result) {
        const uploads = [];
        for (const [i, image] of current.images.entries()) {
          setStatus(`Uploading image ${i + 1} of ${current.images.length}…`);
          uploads.push(await uploadImage(image.path, image.blob));
        }
        setStatus("Committing to GitHub…");
        result = await commitChanges({
          id,
          baseHead: current.baseHead,
          post: postChange(),
          uploads,
          deletions: current.deletions
        });
      }
      let post = current.post;
      if (post.path !== MEDIA) post = await getPost(post.path, result.commit);
      await deleteRecovery(current.post.path);
      activate({
        version: 1,
        post,
        original: post.content,
        baseHead: result.commit,
        images: [],
        deletions: [],
        updatedAt: Date.now()
      });
      setModified(false);
      setLastSave(result);
      setLocalStatus("");
      setStatus(
        result.unchanged
          ? "No changes to commit."
          : "Committed to GitHub. Publication is handled by the blog build."
      );
      await refreshRecovery();
      try {
        await refresh();
      } catch {
        setError(
          "The commit succeeded, but refreshing the library failed. Retry Refresh when the connection returns."
        );
      }
    } catch (error) {
      setStatus("");
      const details =
        error instanceof ApiError && error.details
          ? ` ${Object.entries(error.details)
              .map(([path, refs]) => `${path}: ${refs.join(", ")}`)
              .join("; ")}`
          : "";
      setError(message(error) + details);
      await persist().catch(() =>
        setLocalStatus("Local recovery failed — export your work")
      );
    } finally {
      setSaving(false);
    }
  };
  saveAction.current = () => {
    void save();
  };

  const posts = index.posts
    .filter(
      entry =>
        entry.path.startsWith(`src/${language}/`) &&
        `${entry.path} ${titles[entry.path] || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    .sort((a, b) => b.path.localeCompare(a.path));
  const isPost = active && active !== MEDIA;
  return (
    <div className="app-shell">
      <header className="app-header">
        <a href="/" className="brand" onClick={event => event.preventDefault()}>
          <span className="brand-mark">P</span>
          <span>
            People are Programmers<small>Writing room</small>
          </span>
        </a>
        <div className="button-row">
          <button
            disabled={!index.head || saving || loading}
            onClick={() => setNewPost(true)}
          >
            New post
          </button>
          <button
            disabled={!index.head || saving || loading}
            onClick={() =>
              void openMedia().catch(error => setError(message(error)))
            }
          >
            Images
          </button>
          {active && (
            <button
              className="primary"
              disabled={saving || loading || !modified}
              onClick={() => void save()}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          )}
        </div>
      </header>
      {index.demo && (
        <div className="demo-banner">
          Local demo · real posts, sample image previews, no GitHub writes.
        </div>
      )}
      <div className="workspace">
        <aside className="sidebar">
          <details open>
            <summary>
              Posts <span>{index.posts.length}</span>
            </summary>
            <div className="sidebar-content">
              <label className="sr-only" htmlFor="language">
                Post language
              </label>
              <select
                id="language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="ja">Japanese</option>
                <option value="default">English</option>
              </select>
              <input
                type="search"
                aria-label="Search posts"
                placeholder="Search posts…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className="subtle"
                disabled={loading || saving}
                onClick={() => {
                  setLoading(true);
                  void refresh()
                    .catch(error => setError(message(error)))
                    .finally(() => setLoading(false));
                }}
              >
                Refresh from GitHub
              </button>
              {recoveries.length > 0 && (
                <section className="recovery-list">
                  <h3>On this device</h3>
                  {recoveries.map(recovery => (
                    <button
                      key={recovery.post.path}
                      disabled={saving || loading}
                      onClick={async () => {
                        try {
                          await persist();
                          const latest = (await listRecovery()).find(
                            r => r.post.path === recovery.post.path
                          );
                          if (latest) activate(latest);
                          setLocalStatus("Restored work from this device");
                        } catch (error) {
                          setError(message(error));
                        }
                      }}
                    >
                      {recovery.post.path === MEDIA
                        ? "Pending media changes"
                        : recovery.post.path.split("/").pop()}
                      <small>
                        Recovery ·{" "}
                        {new Date(recovery.updatedAt).toLocaleString()}
                      </small>
                    </button>
                  ))}
                </section>
              )}
              <nav aria-label="Posts">
                {posts.map(entry => (
                  <button
                    className={entry.path === active ? "selected" : ""}
                    key={entry.path}
                    disabled={saving || loading}
                    onClick={() => void openPost(entry.path)}
                  >
                    <span>
                      {titles[entry.path] || entry.path.split("/").pop()}
                    </span>
                    <small>{entry.path.split("/").pop()?.slice(0, 10)}</small>
                  </button>
                ))}
              </nav>
              {!posts.length && (
                <p className="hint">
                  {loading ? "Loading posts…" : "No matching posts."}
                </p>
              )}
            </div>
          </details>
        </aside>
        <main>
          {error && (
            <div className="notice error" role="alert">
              <p>{error}</p>
              <div className="button-row">
                <button onClick={() => setError("")}>Dismiss</button>
                <a href="/" target="_blank" rel="noopener">
                  Sign in again
                </a>
                {isPost && (
                  <button
                    disabled={saving}
                    onClick={async () => {
                      try {
                        setRemote(await getPost(active));
                      } catch (error) {
                        setError(message(error));
                      }
                    }}
                  >
                    Compare remote version
                  </button>
                )}
              </div>
            </div>
          )}
          {status && (
            <p className="notice" role="status">
              {status}
            </p>
          )}
          {lastSave && (
            <p className="notice">
              <a
                href={`https://github.com/${REPOSITORY}/commit/${lastSave.commit}`}
                target="_blank"
                rel="noopener"
              >
                Commit {lastSave.commit.slice(0, 7)}
              </a>{" "}
              ·{" "}
              <a href={WORKFLOW_URL} target="_blank" rel="noopener">
                Check publication
              </a>
            </p>
          )}
          {!active && (
            <section className="welcome">
              <p className="eyebrow">A little room to write</p>
              <h1>
                Make space for
                <br />
                your next idea.
              </h1>
              <p>
                Choose a post, or start something new.
                <br />
                Your Markdown stays yours.
              </p>
              <button
                className="primary"
                disabled={!index.head}
                onClick={() => setNewPost(true)}
              >
                Start a post
              </button>
            </section>
          )}
          {active && (
            <>
              <div className="document-heading">
                <div>
                  <p className="eyebrow">
                    {active === MEDIA
                      ? "Image library"
                      : active.startsWith("src/ja/")
                        ? "Japanese post"
                        : "English post"}
                  </p>
                  <h1>
                    {active === MEDIA
                      ? "Pending media changes"
                      : String(metadata.title || "Untitled")}
                  </h1>
                  <p className="filename">
                    {active === MEDIA ? "public/images" : active}
                  </p>
                </div>
                <span className={`save-badge ${modified ? "pending" : ""}`}>
                  {modified ? "Not committed" : "On GitHub"}
                </span>
              </div>
              <div className="recovery-status" aria-live="polite">
                {localStatus ||
                  (modified
                    ? "Changes have not been committed to GitHub."
                    : "No pending changes.")}
                {images.length + deletions.length > 0 &&
                  ` · ${images.length} upload(s), ${deletions.length} deletion(s)`}
              </div>
              {isPost && (
                <>
                  <details className="metadata">
                    <summary>
                      Post details{" "}
                      <span>
                        {metadata.draft === true
                          ? "Draft"
                          : "Published in lists"}
                      </span>
                    </summary>
                    <fieldset disabled={saving}>
                      <label>
                        Title
                        <input
                          value={String(metadata.title || "")}
                          onChange={e =>
                            metadataChange({ title: e.target.value })
                          }
                        />
                      </label>
                      <div className="form-grid">
                        <label>
                          Date
                          <input
                            type="date"
                            value={String(metadata.date || "")}
                            onChange={e =>
                              metadataChange({ date: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          Last updated
                          <input
                            type="date"
                            value={String(metadata.lastmod || "")}
                            onChange={e =>
                              metadataChange({
                                lastmod: e.target.value || undefined
                              })
                            }
                          />
                        </label>
                      </div>
                      <label>
                        Tags (comma-separated)
                        <input
                          key={`${active}-${editorVersion}`}
                          defaultValue={
                            Array.isArray(metadata.tags)
                              ? metadata.tags.join(", ")
                              : ""
                          }
                          onChange={e =>
                            metadataChange({
                              tags: e.target.value
                                .split(",")
                                .map(t => t.trim())
                                .filter(Boolean)
                            })
                          }
                        />
                      </label>
                      <label>
                        Summary
                        <textarea
                          rows={3}
                          value={String(metadata.summary || "")}
                          onChange={e =>
                            metadataChange({ summary: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Cover image
                        <div className="button-row">
                          <input
                            value={String(metadata.coverImage || "")}
                            onChange={e =>
                              metadataChange({
                                coverImage: e.target.value || undefined
                              })
                            }
                          />
                          <button
                            onClick={() => {
                              pickImage.current = url =>
                                metadataChange({ coverImage: url });
                              setMediaOpen(true);
                            }}
                          >
                            Choose
                          </button>
                        </div>
                      </label>
                      <label>
                        Alternate URL
                        <input
                          value={String(metadata.altUrl || "")}
                          onChange={e =>
                            metadataChange({
                              altUrl: e.target.value || undefined
                            })
                          }
                        />
                      </label>
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={metadata.draft === true}
                          onChange={e =>
                            metadataChange({ draft: e.target.checked })
                          }
                        />
                        Draft — hide from article lists
                      </label>
                      <p className="hint">
                        Saved drafts are public in GitHub and their article URLs
                        remain accessible.
                      </p>
                      <button
                        onClick={() => {
                          setError("");
                          setRawFrontmatter(header.current);
                        }}
                      >
                        Edit frontmatter source
                      </button>
                    </fieldset>
                  </details>
                  <div className="editor-tools">
                    <div
                      className="tabs"
                      role="tablist"
                      aria-label="Editor view"
                    >
                      <button
                        role="tab"
                        aria-selected={tab === "write"}
                        onClick={() => setTab("write")}
                      >
                        Write
                      </button>
                      <button
                        role="tab"
                        aria-selected={tab === "preview"}
                        onClick={() => {
                          setPreviewBody(
                            splitDocument(
                              work.current!.post.content
                            ).body.replace(/\r\n/g, "\n")
                          );
                          setTab("preview");
                        }}
                      >
                        Preview
                      </button>
                    </div>
                    <div
                      className="button-row formatting"
                      aria-label="Formatting tools"
                    >
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("**", "**")}
                        aria-label="Bold"
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("*", "*")}
                        aria-label="Italic"
                      >
                        <em>I</em>
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("## ")}
                        aria-label="Heading"
                      >
                        H2
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("[", "](https://)")}
                      >
                        Link
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={openFigure}
                      >
                        Image layout
                      </button>
                      <button
                        disabled={saving}
                        onClick={() => writing.current?.undo()}
                      >
                        Undo
                      </button>
                    </div>
                  </div>
                  <div hidden={tab !== "write"}>
                    <WritingArea
                      key={`${active}-${editorVersion}`}
                      ref={writing}
                      initial={initialBody}
                      disabled={saving}
                      onInput={fastBodyInput}
                      onComposition={value => {
                        composing.current = value;
                        if (!value) queueRecovery();
                      }}
                    />
                  </div>
                  {tab === "preview" && (
                    <FeatureBoundary>
                      <Suspense fallback={<p>Preparing preview…</p>}>
                        <Preview
                          body={previewBody}
                          resolveImage={resolveImage}
                          onFigure={editFigure}
                        />
                      </Suspense>
                    </FeatureBoundary>
                  )}
                  <footer className="document-footer">
                    <span>
                      Markdown ·{" "}
                      {modified ? "Uncommitted changes" : "Saved revision"}
                    </span>
                    <button onClick={exportPost}>Export Markdown</button>
                    <button
                      disabled={saving}
                      onClick={async () => {
                        try {
                          await persist();
                          setRemote(await getPost(active));
                        } catch (error) {
                          setError(message(error));
                        }
                      }}
                    >
                      Compare remote
                    </button>
                  </footer>
                </>
              )}
              {active === MEDIA && (
                <button onClick={() => void openMedia()}>
                  Open image library
                </button>
              )}
            </>
          )}
        </main>
      </div>
      {newPost && (
        <NewPost
          language={language}
          onClose={() => setNewPost(false)}
          onCreate={async (path, content) => {
            if (
              index.posts.some(p => p.path === path) ||
              recoveries.some(r => r.post.path === path)
            )
              throw new Error(
                "That filename already exists. Choose another slug."
              );
            await persist();
            activate({
              version: 1,
              post: { path, sha: null, content },
              original: "",
              baseHead: index.head,
              images: [],
              deletions: [],
              updatedAt: Date.now()
            });
            await persist();
            setNewPost(false);
          }}
        />
      )}
      {figure && (
        <FeatureBoundary>
          <Suspense fallback={<p>Opening image layout…</p>}>
            <FigureDialog
              initial={figure.initial}
              resolveImage={resolveFigureImage}
              onClose={() => setFigure(null)}
              onPick={add => {
                pickImage.current = add;
                setMediaOpen(true);
              }}
              onApply={async value => {
                const { serializeFigure } = await import("./figures");
                const body = splitDocument(
                  work.current!.post.content
                ).body.replace(/\r\n/g, "\n");
                if (
                  figure.range &&
                  body.slice(figure.range.start, figure.range.end) !==
                    figure.range.source
                ) {
                  setError(
                    "The selected figure changed. Open the layout dialog again."
                  );
                  setFigure(null);
                  return;
                }
                if (
                  JSON.stringify(value) !== JSON.stringify(figure.initial) ||
                  !figure.range
                ) {
                  const html = serializeFigure(value);
                  insert(
                    figure.range ? html : `\n${html}\n\n`,
                    figure.range?.start ?? figure.cursor,
                    figure.range?.end ?? figure.cursor
                  );
                }
                setFigure(null);
              }}
            />
          </Suspense>
        </FeatureBoundary>
      )}
      {mediaOpen && (
        <FeatureBoundary>
          <Suspense fallback={<p>Opening image library…</p>}>
            <MediaLibrary
              entries={index.media}
              pending={images}
              deletions={deletions}
              resolveImage={resolveImage}
              onClose={() => {
                setMediaOpen(false);
                pickImage.current = null;
              }}
              onStage={stageImage}
              onDelete={deleteImage}
              onUndoDelete={path => {
                const next = work.current!.deletions.filter(
                  d => d.path !== path
                );
                setDeletions(next);
                changed({ deletions: next });
              }}
              onPick={
                pickImage.current
                  ? url => {
                      pickImage.current!(url);
                      pickImage.current = null;
                      setMediaOpen(false);
                    }
                  : undefined
              }
              onInsert={
                !pickImage.current && isPost
                  ? url => {
                      setMediaOpen(false);
                      insert(`![](${url})`);
                    }
                  : undefined
              }
              onCover={
                !pickImage.current && isPost
                  ? url => {
                      metadataChange({ coverImage: url });
                      setMediaOpen(false);
                    }
                  : undefined
              }
            />
          </Suspense>
        </FeatureBoundary>
      )}
      {remote && (
        <Modal title="Compare with GitHub" onClose={() => setRemote(null)}>
          <p>
            Your local work stays intact. Copy any remote changes you want into
            your version, then acknowledge this revision before saving.
          </p>
          <div className="compare-grid">
            <label>
              Local source
              <textarea rows={18} readOnly value={work.current!.post.content} />
            </label>
            <label>
              GitHub source
              <textarea rows={18} readOnly value={remote.content} />
            </label>
          </div>
          <div className="button-row">
            <button
              onClick={() => {
                changed({
                  post: { ...work.current!.post, sha: remote.sha },
                  original: remote.content
                });
                setRemote(null);
                setStatus(
                  "Remote revision acknowledged. Review your local content before saving."
                );
              }}
            >
              Keep local text; acknowledge remote revision
            </button>
            <button
              onClick={async () => {
                if (
                  !window.confirm(
                    "Replace local Markdown with the GitHub version? Export your local text first if you need it."
                  )
                )
                  return;
                const current = work.current!;
                activate({
                  ...current,
                  post: remote,
                  original: remote.content,
                  saveId: undefined
                });
                await persist();
                setRemote(null);
              }}
            >
              Use GitHub text
            </button>
            <button onClick={exportPost}>Export local text</button>
          </div>
        </Modal>
      )}
      {rawFrontmatter !== null && (
        <Modal
          title="Frontmatter source"
          onClose={() => setRawFrontmatter(null)}
        >
          <p className="hint">
            Unknown fields are preserved. Include both --- delimiter lines.
          </p>
          <textarea
            aria-label="Frontmatter source"
            className="source-input"
            rows={16}
            value={rawFrontmatter}
            onChange={e => setRawFrontmatter(e.target.value)}
          />
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary"
            onClick={() => {
              try {
                if (rawFrontmatter === header.current) {
                  setRawFrontmatter(null);
                  return;
                }
                const current = work.current!;
                const body = splitDocument(current.post.content).body;
                const content =
                  rawFrontmatter
                    .replace(/\r?\n/g, newline.current)
                    .replace(/\s*$/, newline.current) + body;
                const parsed = splitDocument(content);
                if (parsed.body !== body)
                  throw new Error(
                    "Edit only the frontmatter here; use Write for the post body."
                  );
                header.current = parsed.header;
                newline.current = parsed.newline;
                setMetadata(parsed.data);
                changed({ post: { ...current.post, content } });
                setError("");
                setRawFrontmatter(null);
              } catch (error) {
                setError(message(error));
              }
            }}
          >
            Apply frontmatter
          </button>
        </Modal>
      )}
    </div>
  );
}

function NewPost({
  language,
  onClose,
  onCreate
}: {
  language: string;
  onClose: () => void;
  onCreate: (path: string, content: string) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today());
  const [slug, setSlug] = useState("");
  const [lang, setLang] = useState(language);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Modal title="New post" onClose={onClose}>
      <form
        onSubmit={async event => {
          event.preventDefault();
          setBusy(true);
          try {
            const content = newDocument(title, date);
            validateDocument(content);
            await onCreate(`src/${lang}/${date}-${slug}.md`, content);
          } catch (error) {
            setError(message(error));
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy}>
          <label>
            Language
            <select value={lang} onChange={e => setLang(e.target.value)}>
              <option value="ja">Japanese</option>
              <option value="default">English</option>
            </select>
          </label>
          <label>
            Title
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </label>
          <div className="form-grid">
            <label>
              Date
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </label>
            <label>
              ASCII slug
              <input
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="my-new-post"
                value={slug}
                onChange={e => setSlug(e.target.value)}
              />
            </label>
          </div>
          <p className="filename">
            src/{lang}/{date}-{slug || "my-new-post"}.md
          </p>
          <p className="hint">
            Starts as a draft. The filename determines the public URL.
          </p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="primary" type="submit">
            Create local draft
          </button>
        </fieldset>
      </form>
    </Modal>
  );
}
