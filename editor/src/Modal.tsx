import { useEffect, useRef, type ReactNode } from "react";

export default function Modal({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
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
    >
      <header className="modal-heading">
        <h2>{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close dialog">
          Close
        </button>
      </header>
      {children}
    </dialog>
  );
}
