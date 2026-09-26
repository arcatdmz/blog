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
import { useI18n } from "./i18n";
import website from "../../website.json";

const Preview = lazy(() => import("./Preview"));
const FigureDialog = lazy(() => import("./FigureDialog"));
const MediaLibrary = lazy(() => import("./MediaLibrary"));
const MEDIA = "@media";
const emptyIndex: Index = { head: "", posts: [], media: [] };
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
type Notice = string | readonly [en: string, ja: string];
const errorMessages: Record<string, string> = {
  "The post needs YAML frontmatter between --- lines.":
    "記事には --- で囲んだ YAML フロントマターが必要です。",
  "Posts must be smaller than 512 KiB.":
    "記事のサイズは 512 KiB 未満にしてください。",
  "A title is required.": "タイトルを入力してください。",
  "Date must be a valid YYYY-MM-DD date.":
    "日付は YYYY-MM-DD 形式の有効な日付にしてください。",
  "Last updated must be empty or a valid YYYY-MM-DD date.":
    "最終更新日は空欄にするか、YYYY-MM-DD 形式の有効な日付にしてください。",
  "Tags must be a list of strings.": "タグは文字列のリストにしてください。",
  "Draft must be true or false.": "draft は true または false にしてください。",
  "Local storage failed.": "この端末への保存に失敗しました。",
  "Request failed": "リクエストに失敗しました。",
  "Connection or sign-in failed. Your work is kept locally. Open Sign in again in a new tab, then retry.":
    "接続またはログインに失敗しました。作業内容は端末に保持されています。別のタブで再度ログインし、もう一度お試しください。",
  "Sign in again through Cloudflare Access, then retry. Your local work is safe.":
    "Cloudflare Access から再度ログインし、もう一度お試しください。端末内の作業内容は保持されています。",
  "Sign in through Cloudflare Access, then retry. Local edits have been kept.":
    "Cloudflare Access からログインし、もう一度お試しください。端末内の編集内容は保持されています。",
  "This post changed on GitHub. Your local version has been kept. Load the remote version to compare before saving.":
    "GitHub 側でこの記事が変更されました。手元の内容は保持されています。保存前に GitHub の内容を読み込み、比較してください。",
  "GitHub changed during this operation. Your local work is safe; reload the remote version to compare.":
    "処理中に GitHub 側の内容が変更されました。端末内の作業内容は保持されています。GitHub の内容を再読み込みして比較してください。",
  "The requested file or repository was not found.":
    "指定されたファイルまたはリポジトリが見つかりませんでした。",
  "GitHub access was refused or rate limited. Check the repository token or try again later.":
    "GitHub へのアクセスが拒否されたか、利用上限に達しました。リポジトリのトークンを確認するか、しばらくしてからお試しください。",
  "GitHub could not complete the request. Your local work is safe.":
    "GitHub で処理を完了できませんでした。端末内の作業内容は保持されています。",
  "An upload expired or is invalid. Save again to re-upload the original local file.":
    "アップロードの有効期限が切れたか、無効になっています。もう一度保存すると、端末内の元のファイルを再アップロードします。",
  "New filenames must use YYYY-MM-DD-ascii-slug.md and match the post date.":
    "新しいファイル名は YYYY-MM-DD-ascii-slug.md の形式で、記事の日付と一致させてください。",
  "Some images are still referenced by posts. Remove those references before deleting them.":
    "記事で使用されている画像があります。画像を削除する前に、記事内の参照を削除してください。",
  "Local demo is read-only. Your work remains on this device; configure Cloudflare Access and GitHub to save online.":
    "ローカルデモではオンライン保存できません。作業内容はこの端末に保持されます。オンライン保存には Cloudflare Access と GitHub の設定が必要です。"
};
const message = (error: unknown): Notice => {
  if (!(error instanceof Error))
    return ["Something went wrong.", "エラーが発生しました。"];
  const original = error.message;
  if (errorMessages[original]) return [original, errorMessages[original]];
  if (original.startsWith("Invalid frontmatter: "))
    return [
      original,
      `フロントマターが正しくありません: ${original.slice("Invalid frontmatter: ".length)}`
    ];
  const field =
    /^(summary|summary_generated|coverImage|altUrl) must be text\.$/.exec(
      original
    )?.[1];
  if (field) return [original, `${field} は文字列にしてください。`];
  return original;
};

export default function App() {
  const { locale, setLocale, t } = useI18n();
  const displayNotice = (notice: Notice) =>
    typeof notice === "string" ? notice : t(...notice);
  const site = website.languages[locale === "ja" ? "ja" : "default"];
  const [index, setIndex] = useState<Index>(emptyIndex);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("ja");
  const [active, setActive] = useState("");
  const [postsOpen, setPostsOpen] = useState(true);
  const [mobilePosts, setMobilePosts] = useState(
    () => window.matchMedia("(max-width: 700px)").matches
  );
  const [initialBody, setInitialBody] = useState("");
  const [editorVersion, setEditorVersion] = useState(0);
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [images, setImages] = useState<PendingImage[]>([]);
  const [deletions, setDeletions] = useState<Recovery["deletions"]>([]);
  const [recoveries, setRecoveries] = useState<Recovery[]>([]);
  const [modified, setModified] = useState(false);
  const [localStatus, setLocalStatus] = useState<Notice>("");
  const [status, setStatus] = useState<Notice>("");
  const [error, setError] = useState<Notice>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [zenMode, setZenMode] = useState(false);
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
  const zenToggle = useRef<HTMLButtonElement>(null);
  const normalScroll = useRef(0);

  const toggleZen = () => {
    if (!zenMode) normalScroll.current = window.scrollY;
    setZenMode(value => !value);
  };

  useEffect(() => {
    window.scrollTo({ top: zenMode ? 0 : normalScroll.current });
    if (!zenMode) return;
    const onEscape = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.isComposing ||
        composing.current ||
        document.querySelector("dialog[open]")
      )
        return;
      event.preventDefault();
      setZenMode(false);
      zenToggle.current?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [zenMode]);

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
    setLocalStatus([
      "Recovery saved on this device",
      "この端末に作業内容を保存しました"
    ]);
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
        setLocalStatus([
          "Local recovery failed — export your work",
          "端末への保存に失敗しました。作業内容をエクスポートしてください"
        ]);
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
      setLocalStatus([
        "Waiting to save recovery…",
        "この端末に保存しています…"
      ]);
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
    const mobile = window.matchMedia("(max-width: 700px)");
    const updatePostsMenu = () => {
      setMobilePosts(mobile.matches);
      setPostsOpen(!mobile.matches || !active);
    };
    updatePostsMenu();
    mobile.addEventListener("change", updatePostsMenu);
    return () => mobile.removeEventListener("change", updatePostsMenu);
    // Reopening the same post also makes room for its editor on a phone.
  }, [active, editorVersion]);
  useEffect(() => {
    setLoading(true);
    void refresh()
      .catch(error => setError(message(error)))
      .finally(() => setLoading(false));
    void refreshRecovery().catch(() =>
      setError([
        "Local recovery storage is unavailable. Enable browser storage before editing.",
        "作業内容を端末に保存できません。編集する前にブラウザーのストレージを有効にしてください。"
      ])
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
        setLocalStatus([
          "Restored work from this device",
          "この端末の作業内容を復元しました"
        ]);
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
      setStatus([
        "This figure uses custom HTML. Its original source is selected for editing.",
        "この画像レイアウトは独自の HTML を使用しています。編集できるよう元のソースを選択しました。"
      ]);
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
        t(
          "That filename already exists. Choose a new name; images are never overwritten.",
          "同じファイル名がすでに存在します。画像は上書きできないため、別の名前を指定してください。"
        )
      );
    if (
      work.current.images.length + work.current.deletions.length >=
      MAX_CHANGES
    )
      throw new Error(
        t(
          `Save the current ${MAX_CHANGES} image changes before adding more.`,
          `画像を追加する前に、現在の ${MAX_CHANGES} 件の変更を保存してください。`
        )
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
        t(
          `Still used by: ${blockers.join(", ")}. Remove those references first.`,
          `次の記事で使用されています: ${blockers.join(", ")}。先に記事内の参照を削除してください。`
        )
      );
    if (
      !window.confirm(
        t(
          `Stage deletion of ${path.split("/").pop()}? This takes effect only when you Save changes.`,
          `${path.split("/").pop()} を削除予定にしますか？「変更を保存」を押すと削除されます。`
        )
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
        throw new Error(
          t(
            `Save the current ${MAX_CHANGES} changes first.`,
            `先に現在の ${MAX_CHANGES} 件の変更を保存してください。`
          )
        );
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
    setStatus(["Preparing save…", "保存を準備しています…"]);
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
          setStatus([
            `Uploading image ${i + 1} of ${current.images.length}…`,
            `画像をアップロードしています（${i + 1} / ${current.images.length}）…`
          ]);
          uploads.push(await uploadImage(image.path, image.blob));
        }
        setStatus(["Committing to GitHub…", "GitHub に保存しています…"]);
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
          ? ["No changes to commit.", "保存する変更はありません。"]
          : [
              "Committed to GitHub. Publication is handled by the blog build.",
              "GitHub に保存しました。ブログのビルドが完了すると公開されます。"
            ]
      );
      await refreshRecovery();
      try {
        await refresh();
      } catch {
        setError([
          "The commit succeeded, but refreshing the library failed. Retry Refresh when the connection returns.",
          "保存は完了しましたが、一覧の更新に失敗しました。接続が回復したら再度更新してください。"
        ]);
      }
    } catch (error) {
      setStatus("");
      const details =
        error instanceof ApiError && error.details
          ? ` ${Object.entries(error.details)
              .map(([path, refs]) => `${path}: ${refs.join(", ")}`)
              .join("; ")}`
          : "";
      const errorMessage = message(error);
      setError(
        typeof errorMessage === "string"
          ? errorMessage + details
          : [errorMessage[0] + details, errorMessage[1] + details]
      );
      await persist().catch(() =>
        setLocalStatus([
          "Local recovery failed — export your work",
          "端末への保存に失敗しました。作業内容をエクスポートしてください"
        ])
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
    <div className={`app-shell${zenMode && isPost ? " zen-mode" : ""}`}>
      <header className="app-header">
        <a
          href={site.siteUrl}
          className="brand"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            {site.title}
            <small>{t("Writing room", "編集室")}</small>
          </span>
        </a>
        <div className="button-row">
          <div
            className="language-switch"
            role="group"
            aria-label={t("Interface language", "表示言語")}
          >
            <button
              lang="en"
              aria-pressed={locale === "en"}
              onClick={() => setLocale("en")}
            >
              English
            </button>
            <button
              lang="ja"
              aria-pressed={locale === "ja"}
              onClick={() => setLocale("ja")}
            >
              日本語
            </button>
          </div>
          <button
            disabled={!index.head || saving || loading}
            onClick={() => setNewPost(true)}
          >
            {t("New post", "新規記事")}
          </button>
          <button
            disabled={!index.head || saving || loading}
            onClick={() =>
              void openMedia().catch(error => setError(message(error)))
            }
          >
            {t("Images", "画像")}
          </button>
          {active && (
            <button
              className="primary"
              disabled={saving || loading || !modified}
              onClick={() => void save()}
            >
              {saving
                ? t("Saving…", "保存中…")
                : t("Save changes", "変更を保存")}
            </button>
          )}
        </div>
      </header>
      {index.demo && (
        <div className="demo-banner">
          {t(
            "Local demo · real posts, sample image previews, no GitHub writes.",
            "ローカルデモ · 実際の記事とサンプル画像を表示しています。GitHub への保存は行いません。"
          )}
        </div>
      )}
      <div className="workspace">
        <aside className="sidebar">
          <section className="posts-panel">
            <h2 className="posts-heading">
              {mobilePosts ? (
                <button
                  aria-expanded={postsOpen}
                  aria-controls="posts-list-panel"
                  onClick={() => setPostsOpen(open => !open)}
                >
                  <span className="posts-disclosure" aria-hidden="true" />
                  {t("Posts", "記事")}
                  <span className="posts-count">{index.posts.length}</span>
                </button>
              ) : (
                <>
                  {t("Posts", "記事")}
                  <span className="posts-count">{index.posts.length}</span>
                </>
              )}
            </h2>
            <div
              id="posts-list-panel"
              className="sidebar-content"
              hidden={mobilePosts && !postsOpen}
            >
              <label className="sr-only" htmlFor="language">
                {t("Post language", "記事の言語")}
              </label>
              <select
                id="language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="ja">{t("Japanese", "日本語")}</option>
                <option value="default">{t("English", "英語")}</option>
              </select>
              <input
                type="search"
                aria-label={t("Search posts", "記事を検索")}
                placeholder={t("Search posts…", "記事を検索…")}
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
                {t("Refresh from GitHub", "GitHub から更新")}
              </button>
              {recoveries.length > 0 && (
                <section className="recovery-list">
                  <h3>{t("On this device", "この端末の作業内容")}</h3>
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
                          setLocalStatus([
                            "Restored work from this device",
                            "この端末の作業内容を復元しました"
                          ]);
                        } catch (error) {
                          setError(message(error));
                        }
                      }}
                    >
                      {recovery.post.path === MEDIA
                        ? t("Pending media changes", "未保存の画像の変更")
                        : recovery.post.path.split("/").pop()}
                      <small>
                        {t("Recovery", "復元用データ")} ·{" "}
                        {new Date(recovery.updatedAt).toLocaleString(
                          locale === "ja" ? "ja-JP" : "en-US"
                        )}
                      </small>
                    </button>
                  ))}
                </section>
              )}
              <nav aria-label={t("Posts", "記事")}>
                {posts.map(entry => (
                  <button
                    className={entry.path === active ? "selected" : ""}
                    aria-current={entry.path === active ? "page" : undefined}
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
                  {loading
                    ? t("Loading posts…", "記事を読み込んでいます…")
                    : t("No matching posts.", "該当する記事はありません。")}
                </p>
              )}
            </div>
          </section>
        </aside>
        <main>
          {error && (
            <div className="notice error" role="alert">
              <p>{displayNotice(error)}</p>
              <div className="button-row">
                <button onClick={() => setError("")}>
                  {t("Dismiss", "閉じる")}
                </button>
                <a href="/" target="_blank" rel="noopener">
                  {t("Sign in again", "再度ログイン")}
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
                    {t("Compare remote version", "GitHub の内容と比較")}
                  </button>
                )}
              </div>
            </div>
          )}
          {status && (
            <p className="notice" role="status">
              {displayNotice(status)}
            </p>
          )}
          {lastSave && (
            <p className="notice">
              <a
                href={`https://github.com/${REPOSITORY}/commit/${lastSave.commit}`}
                target="_blank"
                rel="noopener"
              >
                {t("Commit", "コミット")} {lastSave.commit.slice(0, 7)}
              </a>{" "}
              ·{" "}
              <a href={WORKFLOW_URL} target="_blank" rel="noopener">
                {t("Check publication", "公開状況を確認")}
              </a>
            </p>
          )}
          {!active && (
            <section className="welcome">
              <h1>{t("Writing room", "編集室")}</h1>
              <button
                className="primary"
                disabled={!index.head}
                onClick={() => setNewPost(true)}
              >
                {t("Create a post", "記事を作成")}
              </button>
            </section>
          )}
          {active && (
            <>
              <div className="document-heading">
                <div>
                  <p className="eyebrow">
                    {active === MEDIA
                      ? t("Image library", "画像ライブラリ")
                      : active.startsWith("src/ja/")
                        ? t("Japanese post", "日本語の記事")
                        : t("English post", "英語の記事")}
                  </p>
                  <h1>
                    {active === MEDIA
                      ? t("Pending media changes", "未保存の画像の変更")
                      : String(metadata.title || t("Untitled", "無題"))}
                  </h1>
                  <p className="filename">
                    {active === MEDIA ? "public/images" : active}
                  </p>
                </div>
                <div className="document-actions">
                  <span className={`save-badge ${modified ? "pending" : ""}`}>
                    {modified
                      ? t("Not committed", "未保存")
                      : t("On GitHub", "GitHub に保存済み")}
                  </span>
                  {isPost && (
                    <button
                      ref={zenToggle}
                      className="zen-toggle"
                      aria-pressed={zenMode}
                      title={
                        zenMode
                          ? t("Exit Zen mode (Esc)", "Zenモードを終了（Esc）")
                          : undefined
                      }
                      onClick={toggleZen}
                    >
                      {zenMode
                        ? t("Exit Zen mode", "Zenモードを終了")
                        : t("Zen mode", "Zenモード")}
                    </button>
                  )}
                  {zenMode && isPost && (
                    <button
                      className="primary"
                      disabled={saving || loading || !modified}
                      onClick={() => void save()}
                    >
                      {saving
                        ? t("Saving…", "保存中…")
                        : t("Save changes", "変更を保存")}
                    </button>
                  )}
                </div>
              </div>
              <div className="recovery-status" aria-live="polite">
                {displayNotice(localStatus) ||
                  (modified
                    ? t(
                        "Changes have not been committed to GitHub.",
                        "変更はまだ GitHub に保存されていません。"
                      )
                    : t("No pending changes.", "未保存の変更はありません。"))}
                {images.length + deletions.length > 0 &&
                  t(
                    ` · ${images.length} upload(s), ${deletions.length} deletion(s)`,
                    ` · アップロード ${images.length} 件、削除 ${deletions.length} 件`
                  )}
              </div>
              {isPost && (
                <>
                  <details className="metadata">
                    <summary>
                      {t("Post details", "記事の詳細")}{" "}
                      <span>
                        {metadata.draft === true
                          ? t("Draft", "下書き")
                          : t("Published in lists", "記事一覧に表示")}
                      </span>
                    </summary>
                    <fieldset disabled={saving}>
                      <label>
                        {t("Title", "タイトル")}
                        <input
                          value={String(metadata.title || "")}
                          onChange={e =>
                            metadataChange({ title: e.target.value })
                          }
                        />
                      </label>
                      <div className="form-grid">
                        <label>
                          {t("Date", "日付")}
                          <input
                            type="date"
                            value={String(metadata.date || "")}
                            onChange={e =>
                              metadataChange({ date: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          {t("Last updated", "最終更新日")}
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
                        {t("Tags (comma-separated)", "タグ（カンマ区切り）")}
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
                        {t("Summary", "概要")}
                        <textarea
                          rows={3}
                          value={String(metadata.summary || "")}
                          onChange={e =>
                            metadataChange({ summary: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        {t("Cover image", "カバー画像")}
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
                            {t("Choose", "選択")}
                          </button>
                        </div>
                      </label>
                      <label>
                        {t("Alternate URL", "別言語版の URL")}
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
                        {t(
                          "Draft — hide from article lists",
                          "下書き — 記事一覧に表示しない"
                        )}
                      </label>
                      <p className="hint">
                        {t(
                          "Saved drafts are public in GitHub and their article URLs remain accessible.",
                          "保存した下書きは GitHub 上に公開され、記事の URL からも閲覧できます。"
                        )}
                      </p>
                      <button
                        onClick={() => {
                          setError("");
                          setRawFrontmatter(header.current);
                        }}
                      >
                        {t("Edit frontmatter source", "フロントマターを編集")}
                      </button>
                    </fieldset>
                  </details>
                  <div className="editor-tools">
                    <div
                      className="tabs"
                      role="tablist"
                      aria-label={t("Editor view", "エディターの表示")}
                    >
                      <button
                        role="tab"
                        aria-selected={tab === "write"}
                        onClick={() => setTab("write")}
                      >
                        {t("Write", "本文")}
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
                        {t("Preview", "プレビュー")}
                      </button>
                    </div>
                    <div
                      className="button-row formatting"
                      aria-label={t("Formatting tools", "書式設定")}
                    >
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("**", "**")}
                        aria-label={t("Bold", "太字")}
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("*", "*")}
                        aria-label={t("Italic", "斜体")}
                      >
                        <em>I</em>
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("## ")}
                        aria-label={t("Heading", "見出し")}
                      >
                        H2
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => wrap("[", "](https://)")}
                      >
                        {t("Link", "リンク")}
                      </button>
                      <button
                        disabled={saving}
                        onPointerDown={event => event.preventDefault()}
                        onClick={openFigure}
                      >
                        {t("Image layout", "画像レイアウト")}
                      </button>
                      <button
                        disabled={saving}
                        onClick={() => writing.current?.undo()}
                      >
                        {t("Undo", "元に戻す")}
                      </button>
                    </div>
                  </div>
                  <div className="writing-panel" hidden={tab !== "write"}>
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
                      <Suspense
                        fallback={
                          <p>
                            {t(
                              "Preparing preview…",
                              "プレビューを準備しています…"
                            )}
                          </p>
                        }
                      >
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
                      {modified
                        ? t("Uncommitted changes", "未保存の変更")
                        : t("Saved revision", "保存済み")}
                    </span>
                    <button onClick={exportPost}>
                      {t("Export Markdown", "Markdown をエクスポート")}
                    </button>
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
                      {t("Compare remote", "GitHub と比較")}
                    </button>
                  </footer>
                </>
              )}
              {active === MEDIA && (
                <button onClick={() => void openMedia()}>
                  {t("Open image library", "画像ライブラリを開く")}
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
                t(
                  "That filename already exists. Choose another slug.",
                  "同じファイル名がすでに存在します。別のスラッグを指定してください。"
                )
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
          <Suspense
            fallback={
              <p>
                {t("Opening image layout…", "画像レイアウトを開いています…")}
              </p>
            }
          >
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
                  setError([
                    "The selected figure changed. Open the layout dialog again.",
                    "選択した画像レイアウトが変更されました。もう一度レイアウトの編集画面を開いてください。"
                  ]);
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
          <Suspense
            fallback={
              <p>
                {t("Opening image library…", "画像ライブラリを開いています…")}
              </p>
            }
          >
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
        <Modal
          title={t("Compare with GitHub", "GitHub の内容と比較")}
          onClose={() => setRemote(null)}
        >
          <p>
            {t(
              "Your local work stays intact. Copy any remote changes you want into your version, then acknowledge this revision before saving.",
              "端末内の作業内容は保持されます。GitHub 側の必要な変更を手元の原稿にコピーし、保存前にこのリビジョンを確認済みにしてください。"
            )}
          </p>
          <div className="compare-grid">
            <label>
              {t("Local source", "端末内のソース")}
              <textarea rows={18} readOnly value={work.current!.post.content} />
            </label>
            <label>
              {t("GitHub source", "GitHub のソース")}
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
                setStatus([
                  "Remote revision acknowledged. Review your local content before saving.",
                  "GitHub のリビジョンを確認済みにしました。保存する前に手元の内容を確認してください。"
                ]);
              }}
            >
              {t(
                "Keep local text; acknowledge remote revision",
                "手元の内容を保持し、GitHub のリビジョンを確認済みにする"
              )}
            </button>
            <button
              onClick={async () => {
                if (
                  !window.confirm(
                    t(
                      "Replace local Markdown with the GitHub version? Export your local text first if you need it.",
                      "手元の Markdown を GitHub の内容に置き換えますか？必要であれば、先に手元の原稿をエクスポートしてください。"
                    )
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
              {t("Use GitHub text", "GitHub の内容を使用")}
            </button>
            <button onClick={exportPost}>
              {t("Export local text", "手元の原稿をエクスポート")}
            </button>
          </div>
        </Modal>
      )}
      {rawFrontmatter !== null && (
        <Modal
          title={t("Frontmatter source", "フロントマターのソース")}
          onClose={() => setRawFrontmatter(null)}
        >
          <p className="hint">
            {t(
              "Unknown fields are preserved. Include both --- delimiter lines.",
              "独自の項目も保持されます。前後の区切り行（---）を含めてください。"
            )}
          </p>
          <textarea
            aria-label={t("Frontmatter source", "フロントマターのソース")}
            className="source-input"
            rows={16}
            value={rawFrontmatter}
            onChange={e => setRawFrontmatter(e.target.value)}
          />
          {error && (
            <p className="error" role="alert">
              {displayNotice(error)}
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
                    t(
                      "Edit only the frontmatter here; use Write for the post body.",
                      "ここではフロントマターだけを編集してください。記事本文は「本文」タブで編集できます。"
                    )
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
            {t("Apply frontmatter", "フロントマターを適用")}
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
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today());
  const [slug, setSlug] = useState("");
  const [lang, setLang] = useState(language);
  const [error, setError] = useState<Notice>("");
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={t("New post", "新規記事")} onClose={onClose}>
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
            {t("Language", "記事の言語")}
            <select value={lang} onChange={e => setLang(e.target.value)}>
              <option value="ja">{t("Japanese", "日本語")}</option>
              <option value="default">{t("English", "英語")}</option>
            </select>
          </label>
          <label>
            {t("Title", "タイトル")}
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
          </label>
          <div className="form-grid">
            <label>
              {t("Date", "日付")}
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </label>
            <label>
              {t("ASCII slug", "スラッグ（半角英数字）")}
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
            {t(
              "Starts as a draft. The filename determines the public URL.",
              "下書きとして作成します。ファイル名が公開時の URL になります。"
            )}
          </p>
          {error && (
            <p className="error" role="alert">
              {typeof error === "string" ? error : t(...error)}
            </p>
          )}
          <button className="primary" type="submit">
            {t("Create local draft", "この端末に下書きを作成")}
          </button>
        </fieldset>
      </form>
    </Modal>
  );
}
