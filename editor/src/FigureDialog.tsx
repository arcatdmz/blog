import { useState } from "react";
import type { Figure } from "./figures";
import { serializeFigure } from "./figures";
import Modal from "./Modal";

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
    <Modal title="Image layout" onClose={onClose}>
      <p className="hint">
        Arrange images here. The post keeps its ordinary Markdown and figure
        HTML.
      </p>
      <div className="form-grid">
        <label>
          Placement
          <select
            value={figure.placement}
            onChange={e =>
              update({ placement: e.target.value as Figure["placement"] })
            }
          >
            <option value="">Full width</option>
            <option value="center">Centered</option>
            <option value="left">Float left</option>
            <option value="right">Float right</option>
          </select>
        </label>
        <label>
          Columns
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
          Small
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={figure.fixed}
            onChange={e => update({ fixed: e.target.checked })}
          />
          Fixed size
        </label>
      </div>
      <label>
        Shared link (optional)
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
                Image URL
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
                Alt text
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
                  Image link (optional)
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
                  Move up
                </button>
                <button
                  disabled={index === figure.images.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Move down
                </button>
                <button
                  onClick={() =>
                    update({
                      images: figure.images.filter((_, i) => i !== index)
                    })
                  }
                >
                  Remove
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
          Add from library
        </button>
        <button
          onClick={() =>
            update({
              images: [...figure.images, { src: "", alt: "", link: "" }]
            })
          }
        >
          Add image URL
        </button>
      </div>
      <label>
        Caption{" "}
        <span className="hint">Supports Markdown links and emphasis</span>
        <textarea
          rows={3}
          value={figure.caption}
          onChange={e => update({ caption: e.target.value })}
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
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
          Apply layout
        </button>
        <button onClick={onClose}>Cancel</button>
      </footer>
    </Modal>
  );
}
