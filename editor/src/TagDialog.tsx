import { useState } from "react";
import Modal from "./Modal";
import { useI18n } from "./i18n";

export default function TagDialog({
  tags,
  selected,
  onApply,
  onClose
}: {
  tags: string[];
  selected: string[];
  onApply: (tags: string[]) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(new Set(selected));
  const all = [...new Set([...tags, ...selected])].sort((a, b) =>
    a.localeCompare(b)
  );
  const filtered = all.filter(tag =>
    tag.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );
  return (
    <Modal title={t("Edit tags", "タグを編集")} onClose={onClose}>
      <input
        type="search"
        aria-label={t("Search tags", "タグを検索")}
        placeholder={t("Search tags…", "タグを検索…")}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <p className="hint" role="status">
        {t(
          `${checked.size} selected · ${filtered.length} matching tags`,
          `${checked.size} 件選択 · ${filtered.length} 件のタグ`
        )}
      </p>
      <div className="tag-list">
        {filtered.map(tag => (
          <label className="check" key={tag}>
            <input
              type="checkbox"
              checked={checked.has(tag)}
              onChange={e => {
                const next = new Set(checked);
                if (e.target.checked) next.add(tag);
                else next.delete(tag);
                setChecked(next);
              }}
            />
            {tag}
          </label>
        ))}
      </div>
      {!filtered.length && (
        <p>
          {t(
            "No matching tags. New tags can be typed in the post details.",
            "一致するタグはありません。新しいタグは記事の詳細欄に入力できます。"
          )}
        </p>
      )}
      <div className="button-row">
        <button className="primary" onClick={() => onApply([...checked])}>
          {t("Apply", "適用")}
        </button>
        <button onClick={onClose}>{t("Cancel", "キャンセル")}</button>
      </div>
    </Modal>
  );
}
