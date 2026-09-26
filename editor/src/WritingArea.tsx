import { forwardRef, useImperativeHandle, useRef } from "react";
import { useI18n } from "./i18n";

export interface WritingHandle {
  selection(): { start: number; end: number; text: string };
  replace(start: number, end: number, text: string): void;
  focus(start?: number, end?: number): void;
  undo(): void;
}

/** The DOM owns the text and native editing history. React never echoes input. */
const WritingArea = forwardRef<
  WritingHandle,
  {
    initial: string;
    disabled: boolean;
    onInput: (value: string) => void;
    onComposition: (active: boolean) => void;
  }
>(function WritingArea(
  { initial, disabled, onInput, onComposition },
  forwardedRef
) {
  const { t } = useI18n();
  const ref = useRef<HTMLTextAreaElement>(null);
  const fallbackUndo = useRef<
    { before: string; after: string; start: number }[]
  >([]);
  const undoFallback = () => {
    const textarea = ref.current!;
    const item = fallbackUndo.current.at(-1);
    if (!item || item.after !== textarea.value) return false;
    textarea.value = item.before;
    textarea.setSelectionRange(item.start, item.start);
    fallbackUndo.current.pop();
    onInput(textarea.value);
    return true;
  };
  useImperativeHandle(forwardedRef, () => ({
    selection() {
      const element = ref.current!;
      return {
        start: element.selectionStart,
        end: element.selectionEnd,
        text: element.value.slice(element.selectionStart, element.selectionEnd)
      };
    },
    replace(start, end, text) {
      const element = ref.current!;
      const before = element.value;
      element.focus({ preventScroll: true });
      element.setSelectionRange(start, end);
      // insertText is retained here specifically for Safari's native undo stack.
      // setRangeText alone does not consistently create an undo transaction.
      let inserted = false;
      try {
        inserted = document.execCommand("insertText", false, text);
      } catch {
        /* fallback below */
      }
      if (!inserted) {
        element.setRangeText(text, start, end, "end");
        fallbackUndo.current.push({ before, after: element.value, start });
      }
      onInput(element.value);
    },
    focus(start, end) {
      const element = ref.current!;
      element.focus();
      if (start !== undefined) element.setSelectionRange(start, end ?? start);
    },
    undo() {
      ref.current!.focus();
      if (!undoFallback()) document.execCommand("undo");
    }
  }));
  return (
    <textarea
      ref={ref}
      className="writing-area"
      aria-label={t("Markdown body", "Markdown 本文")}
      defaultValue={initial}
      disabled={disabled}
      autoCapitalize="sentences"
      spellCheck
      onInput={event => onInput(event.currentTarget.value)}
      onCompositionStart={() => onComposition(true)}
      onCompositionEnd={() => onComposition(false)}
      onKeyDown={event => {
        if (
          (event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === "z" &&
          !event.shiftKey &&
          undoFallback()
        )
          event.preventDefault();
      }}
    />
  );
});
export default WritingArea;
