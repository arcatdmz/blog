import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useI18n } from "./i18n";
import { defaultSummaryPrompt, type SummaryConfig } from "../shared/aiSummary";
import { generateSummary, getSummaryConfig } from "./api";

const errors: Record<string, string> = {
  "Enter an article and a prompt (up to 10,000 characters).":
    "記事本文とプロンプト（10,000文字以内）を入力してください。",
  "OpenAI API key is not configured on the Worker.":
    "WorkerのOpenAI APIキーが設定されていません。",
  "Summary generation could not connect or timed out. Please retry.":
    "概要の生成で接続に失敗したか、時間切れになりました。もう一度お試しください。",
  "OpenAI usage limit reached. Check the API quota or retry later.":
    "OpenAIの利用上限に達しました。APIの利用枠を確認するか、しばらくしてからお試しください。",
  "OpenAI could not generate a summary. Check the API key and model settings, then retry.":
    "概要を生成できませんでした。APIキーとモデルの設定を確認し、もう一度お試しください。",
  "OpenAI returned an invalid summary. Please retry.":
    "概要の応答を読み取れませんでした。もう一度お試しください。",
  "OpenAI returned an incomplete summary. Please retry.":
    "概要の生成が完了しませんでした。もう一度お試しください。",
  "Connection or sign-in failed. Your work is kept locally. Open Sign in again in a new tab, then retry.":
    "接続またはログインに失敗しました。別のタブで再度ログインし、もう一度お試しください。",
  "Sign in again through Cloudflare Access, then retry. Your local work is safe.":
    "Cloudflare Accessから再度ログインし、もう一度お試しください。"
};

export default function SummaryDialog({
  title,
  body,
  language,
  onApply,
  onClose
}: {
  title: string;
  body: string;
  language: string;
  onApply: (summary: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState(defaultSummaryPrompt(language));
  const [candidate, setCandidate] = useState("");
  const [config, setConfig] = useState<SummaryConfig>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController>();
  useEffect(() => {
    let active = true;
    getSummaryConfig()
      .then(value => {
        if (active) setConfig(value);
      })
      .catch(error => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
      controller.current?.abort();
    };
  }, []);
  async function generate() {
    setError("");
    setBusy(true);
    const current = new AbortController();
    controller.current = current;
    try {
      const result = await generateSummary(
        { title, body, prompt },
        current.signal
      );
      if (!current.signal.aborted) setCandidate(result.summary);
    } catch (error) {
      if (!current.signal.aborted)
        setError(error instanceof Error ? error.message : String(error));
    } finally {
      if (!current.signal.aborted) setBusy(false);
    }
  }
  return (
    <Modal
      title={t("Generate summary", "概要の自動生成")}
      onClose={onClose}
      actions={
        <>
          <button
            className="primary"
            disabled={busy || !candidate.trim()}
            onClick={() => onApply(candidate.trim())}
          >
            {t("Apply to Summary", "概要に反映")}
          </button>
          <button onClick={onClose}>{t("Cancel", "キャンセル")}</button>
        </>
      }
    >
      <p>
        {t(
          "Review the prompt before sending the current article to OpenAI. Review and edit the candidate, then apply it to Summary.",
          "現在の記事をOpenAIに送信する前にプロンプトを確認してください。生成された候補を確認・編集し、「概要に反映」で反映できます。"
        )}
      </p>
      <p className="hint">
        {t("Model", "モデル")}: {config?.model || "…"}
      </p>
      {config && !config.configured && (
        <p role="alert">
          {t(
            "Configure OPENAI_API_KEY on the Worker to generate summaries.",
            "概要の生成にはWorkerのOPENAI_API_KEYを設定してください。"
          )}
        </p>
      )}
      <label>
        {t("Prompt", "プロンプト")}
        <textarea
          aria-label={t("Prompt", "プロンプト")}
          rows={5}
          value={prompt}
          maxLength={10000}
          disabled={busy}
          onChange={event => setPrompt(event.target.value)}
        />
      </label>
      <button
        disabled={busy || !config?.configured || !prompt.trim() || !body.trim()}
        onClick={() => void generate()}
      >
        {busy
          ? t("Generating…", "生成中…")
          : t("Generate candidate", "候補を生成")}
      </button>
      {error && <p role="alert">{t(error, errors[error] || error)}</p>}
      <label>
        {t("Summary candidate", "概要の候補")}
        <textarea
          aria-label={t("Summary candidate", "概要の候補")}
          rows={5}
          value={candidate}
          disabled={busy}
          onChange={event => setCandidate(event.target.value)}
        />
      </label>
      <p className="hint" role="status">
        {busy
          ? t("Generating a candidate…", "候補を生成しています…")
          : t(
              `${[...candidate].length} characters`,
              `${[...candidate].length}文字`
            )}
      </p>
    </Modal>
  );
}
