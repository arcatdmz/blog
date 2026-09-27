import { useEffect, useRef, type ReactNode } from "react";
import { useI18n } from "./i18n";

export default function Modal({
  title,
  onClose,
  children,
  actions
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      aria-label={title}
      className={actions ? "modal-with-actions" : undefined}
    >
      <header className="modal-heading">
        <h2>{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Close dialog", "ダイアログを閉じる")}
        >
          {t("Close", "閉じる")}
        </button>
      </header>
      {actions ? (
        <>
          <div className="modal-body">{children}</div>
          <footer className="modal-actions">{actions}</footer>
        </>
      ) : (
        children
      )}
    </dialog>
  );
}
