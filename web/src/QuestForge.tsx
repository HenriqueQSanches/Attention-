import { useState } from "react";
import { suggestQuests } from "./api.ts";
import { Pet } from "./Pet.tsx";
import { petById } from "./data.ts";
import type { QuestKind } from "./types.ts";

type Props = {
  pet: string;
  dailyFull: boolean;
  busy: boolean;
  onAdd: (kind: QuestKind, title: string) => void;
};

export function QuestForge({ pet, dailyFull, busy, onAdd }: Props) {
  const mascot = petById(pet);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<string[]>([]);

  async function forge() {
    const t = text.trim();
    if (t.length < 4 || loading) return;
    setLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const list = await suggestQuests(t);
      if (!list.length) {
        setError("Não consegui destrinchar isso. Tenta reescrever com mais contexto.");
      }
      setIdeas(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao destrinchar.");
    } finally {
      setLoading(false);
    }
  }

  function take(kind: QuestKind, idea: string) {
    onAdd(kind, idea);
    setIdeas((prev) => prev.filter((i) => i !== idea));
  }

  return (
    <section className="quests forge">
      <div className="forge__mascot">
        <Pet seed={mascot.seed} size={64} options={mascot.opts} />
        <div className="forge__bubble">
          <p className="forge__bubble-name">{mascot.name}</p>
          <p className="forge__bubble-line">
            {loading ? "Deixa comigo, cortando em pedaços..." : mascot.line}
          </p>
        </div>
      </div>

      <textarea
        className="forge__input"
        value={text}
        maxLength={400}
        rows={3}
        placeholder="Ex: Organizar a documentação do projeto e deixar pronta pra entrega"
        disabled={loading}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="forge__btn"
        type="button"
        disabled={text.trim().length < 4 || loading || busy}
        onClick={forge}
      >
        {loading ? (
          <>
            <span className="forge__spinner" />
            {mascot.name} está pensando...
          </>
        ) : (
          "Destrinchar em quests"
        )}
      </button>

      {loading && (
        <div className="forge__loading">
          <span className="forge__spinner forge__spinner--muted" />
          <span>Quebrando a tarefa em passos pequenos...</span>
        </div>
      )}

      {error && <p className="forge__error">{error}</p>}

      {ideas.length > 0 && (
        <>
          <p className="forge__result-label">
            {mascot.name} quebrou em {ideas.length}{" "}
            {ideas.length === 1 ? "quest" : "quests"}. Escolha quais entram:
          </p>
          <ul className="forge__ideas">
            {ideas.map((idea, i) => (
              <li key={i} className="forge__idea">
                <span className="forge__idea-text">{idea}</span>
                <div className="forge__idea-actions">
                  <span className="tip">
                    <button
                      type="button"
                      className="forge__take"
                      disabled={dailyFull || busy}
                      onClick={() => take("daily", idea)}
                    >
                      Hoje
                    </button>
                    <span className="tip__pop">
                      {dailyFull
                        ? "As 3 quests de hoje já estão definidas. Foco nelas."
                        : "Quest do dia. Até 3 por dia, valem 25 XP e zeram amanhã."}
                    </span>
                  </span>
                  <span className="tip">
                    <button
                      type="button"
                      className="forge__take forge__take--avulsa"
                      disabled={busy}
                      onClick={() => take("avulsa", idea)}
                    >
                      Avulsa
                    </button>
                    <span className="tip__pop tip__pop--right">
                      Tarefa maior, sem prazo de dia. Vale 60 XP.
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
