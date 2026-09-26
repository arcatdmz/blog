import { Component, type ReactNode } from "react";
import { useI18n } from "./i18n";

function LoadError() {
  const { t } = useI18n();
  return (
    <p className="error" role="alert">
      {t(
        "This view could not load. Your writing is still open. Return to Write; once recovery is saved, reconnect and reload to try again.",
        "この画面を読み込めませんでした。編集中の内容は保持されています。「本文」に戻り、復元用データの保存後に、接続を確認して再読み込みしてください。"
      )}
    </p>
  );
}

/** A failed optional download must not unmount the active, unsaved editor. */
export default class FeatureBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <LoadError />;
    return this.props.children;
  }
}
