import { useState } from "react";
import type { Figure } from "./figures";
import { serializeFigure } from "./figures";
import Modal from "./Modal";
import { useI18n } from "./i18n";

const figureErrors: Record<string, string> = {
  "Add at least one image.": "画像を1枚以上追加してください。",
  "Use an https://, http://, /path, or #anchor link.":
    "https://、http://、/path、#anchor のいずれかで始まるリンクを入力してください。",
  "Each image needs a valid URL.": "各画像に有効な URL を入力してください。",
  "Invalid shared link.": "共通のリンクが正しくありません。"
};

export default function FigureDialog({
  initial,
  onClose,
  onApply,
  onPick,
  resolveImage
}: {
  initial: Figure;
  onClose: () => void;
  onApply: (figure: Figure) => void;
  onPick: (add: (src: string) => void) => void;
  resolveImage: (src: string) => string;
}) {
  const { t } = useI18n();
  const [figure, setFigure] = useState(initial);
  const [error, setError] = useState("");
  const update = (patch: Partial<Figure>) =>
    setFigure(value => ({ ...value, ...patch }));
  const move = (index: number, direction: number) => {
    const images = [...figure.images];
    [images[index], images[index + direction]] = [
      images[index + direction],
      images[index]
    ];
    update({ images });
  };
  return (
    <Modal title={t("Image layout", "画像のレイアウト")} onClose={onClose}>
      <p className="hint">
        {t(
          "Arrange images here. The post keeps its ordinary Markdown and figure HTML.",
          "画像の配置を調整できます。記事は通常の Markdown と figure タグで保存されます。"
        )}
      </p>
      <div className="form-grid">
        <label>
          {t("Placement", "配置")}
          <select
            value={figure.placement}
            onChange={e =>
              update({ placement: e.target.value as Figure["placement"] })
            }
          >
            <option value="">{t("Full width", "全幅")}</option>
            <option value="center">{t("Centered", "中央")}</option>
            <option value="left">{t("Float left", "左に寄せる")}</option>
            <option value="right">{t("Float right", "右に寄せる")}</option>
          </select>
        </label>
        <label>
          {t("Columns", "列数")}
          <select
            value={figure.columns}
            onChange={e =>
              update({ columns: Number(e.target.value) as Figure["columns"] })
            }
          >
            {[1, 2, 3, 4].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={figure.small}
            onChange={e => update({ small: e.target.checked })}
          />
          {t("Small", "小さく表示")}
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={figure.fixed}
            onChange={e => update({ fixed: e.target.checked })}
          />
          {t("Fixed size", "サイズを固定")}
        </label>
      </div>
      <label>
        {t("Shared link (optional)", "共通のリンク（任意）")}
        <input
          value={figure.sharedLink}
          placeholder="https://…"
          onChange={e => update({ sharedLink: e.target.value })}
        />
      </label>
      <div className="figure-images">
        {figure.images.map((image, index) => (
          <section className="figure-image" key={index}>
            <img src={resolveImage(image.src)} alt="" />
            <div>
              <label>
                {t("Image URL", "画像 URL")}
                <input
                  value={image.src}
                  onChange={e =>
                    update({
                      images: figure.images.map((v, i) =>
                        i === index ? { ...v, src: e.target.value } : v
                      )
                    })
                  }
                />
              </label>
              <label>
                {t("Alt text", "代替テキスト")}
                <input
                  value={image.alt}
                  onChange={e =>
                    update({
                      images: figure.images.map((v, i) =>
                        i === index ? { ...v, alt: e.target.value } : v
                      )
                    })
                  }
                />
              </label>
              {!figure.sharedLink && (
                <label>
                  {t("Image link (optional)", "画像のリンク（任意）")}
                  <input
                    value={image.link}
                    onChange={e =>
                      update({
                        images: figure.images.map((v, i) =>
                          i === index ? { ...v, link: e.target.value } : v
                        )
                      })
                    }
                  />
                </label>
              )}
              <div className="button-row">
                <button disabled={index === 0} onClick={() => move(index, -1)}>
                  {t("Move up", "上へ")}
                </button>
                <button
                  disabled={index === figure.images.length - 1}
                  onClick={() => move(index, 1)}
                >
                  {t("Move down", "下へ")}
                </button>
                <button
                  onClick={() =>
                    update({
                      images: figure.images.filter((_, i) => i !== index)
                    })
                  }
                >
                  {t("Remove", "削除")}
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="button-row">
        <button
          onClick={() =>
            onPick(src =>
              setFigure(value => ({
                ...value,
                images: [...value.images, { src, alt: "", link: "" }]
              }))
            )
          }
        >
          {t("Add from library", "ライブラリから追加")}
        </button>
        <button
          onClick={() =>
            update({
              images: [...figure.images, { src: "", alt: "", link: "" }]
            })
          }
        >
          {t("Add image URL", "画像 URL を追加")}
        </button>
      </div>
      <label>
        {t("Caption", "キャプション")}{" "}
        <span className="hint">
          {t(
            "Supports Markdown links and emphasis",
            "Markdown のリンクや強調が使えます"
          )}
        </span>
        <textarea
          rows={3}
          value={figure.caption}
          onChange={e => update({ caption: e.target.value })}
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {t(error, figureErrors[error] ?? error)}
        </p>
      )}
      <footer className="button-row">
        <button
          className="primary"
          onClick={() => {
            try {
              serializeFigure(figure);
              onApply(figure);
            } catch (error) {
              setError((error as Error).message);
            }
          }}
        >
          {t("Apply layout", "レイアウトを適用")}
        </button>
        <button onClick={onClose}>{t("Cancel", "キャンセル")}</button>
      </footer>
    </Modal>
  );
}
