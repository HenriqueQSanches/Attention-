import { useState } from "react";
import type { Quest } from "./types.ts";

type Props = {
  title: string;
  hint: string;
  quests: Quest[];
  canAdd: boolean;
  addPlaceholder: string;
  fullMessage?: string;
  busy: boolean;
  onAdd: (title: string) => void;
  onComplete: (id: number) => void;
  onRemove: (id: number) => void;
};

export function QuestSection({
  title,
  hint,
  quests,
  canAdd,
  addPlaceholder,
  fullMessage,
  busy,
  onAdd,
  onComplete,
  onRemove,
}: Props) {
  const [draft, setDraft] = useState("");
  const done = quests.filter((q) => q.done).length;

  function submit() {
    const t = draft.trim();
    if (t.length < 3 || busy) return;
    onAdd(t);
    setDraft("");
  }

  return (
    <section className="quests">
      <div className="quests__head">
        <p className="quests__title">{title}</p>
        <span className="quests__count">
          {done}/{quests.length}
        </span>
      </div>
      <p className="quests__hint">{hint}</p>

      <ul className="questlist">
        {quests.map((q) => (
          <li key={q.id} className={`quest${q.done ? " quest--done" : ""}`}>
            <button
              className="quest__check"
              type="button"
              aria-label={q.done ? "Concluída" : "Concluir quest"}
              disabled={q.done || busy}
              onClick={() => onComplete(q.id)}
            >
              {q.done ? "✓" : ""}
            </button>
            <span className="quest__title">{q.title}</span>
            <span className="quest__xp">+{q.xp}</span>
            {!q.done && (
              <button
                className="quest__remove"
                type="button"
                aria-label="Remover quest"
                disabled={busy}
                onClick={() => onRemove(q.id)}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>

      {canAdd ? (
        <div className="addquest">
          <input
            className="addquest__input"
            type="text"
            value={draft}
            maxLength={80}
            placeholder={addPlaceholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button
            className="addquest__btn"
            type="button"
            disabled={draft.trim().length < 3 || busy}
            onClick={submit}
          >
            +
          </button>
        </div>
      ) : (
        fullMessage && <p className="quests__full">{fullMessage}</p>
      )}
    </section>
  );
}
