import { useEffect, useState } from "react";
import { Avatar } from "./Avatar.tsx";
import { QuestSection } from "./QuestSection.tsx";
import { xpToNext } from "./data.ts";
import { addQuest, completeQuest, fetchQuests, removeQuest } from "./api.ts";
import type { Character, Quest, QuestKind } from "./types.ts";

type Props = {
  character: Character;
  onReset: () => void;
  resetting: boolean;
  onCharacterUpdate: (c: Character) => void;
};

export function Home({
  character,
  onReset,
  resetting,
  onCharacterUpdate,
}: Props) {
  const [daily, setDaily] = useState<Quest[]>([]);
  const [avulsas, setAvulsas] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    fetchQuests()
      .then((s) => {
        setDaily(s.daily);
        setAvulsas(s.avulsas);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2600);
    return () => clearTimeout(t);
  }, [flash]);

  async function refresh() {
    const s = await fetchQuests();
    setDaily(s.daily);
    setAvulsas(s.avulsas);
  }

  async function add(kind: QuestKind, title: string) {
    setWorking(true);
    try {
      await addQuest({ title, kind });
      await refresh();
    } finally {
      setWorking(false);
    }
  }

  async function complete(id: number) {
    setWorking(true);
    try {
      const r = await completeQuest(id);
      onCharacterUpdate(r.character);
      await refresh();
      setFlash(
        r.leveledUp
          ? `Subiu para o Nível ${r.character.level}!`
          : `+${r.gained} XP`,
      );
    } finally {
      setWorking(false);
    }
  }

  async function remove(id: number) {
    setWorking(true);
    try {
      await removeQuest(id);
      await refresh();
    } finally {
      setWorking(false);
    }
  }

  const need = xpToNext(character.level);
  const pct = Math.min(100, Math.round((character.xp / need) * 100));

  return (
    <main className="screen" style={{ ["--accent" as string]: character.accent }}>
      <header className="herald">
        <p className="herald__kicker">attention!</p>
      </header>

      <section className="hero">
        <Avatar sigil={character.sigil} accent={character.accent} size={104} />
        <h1 className="hero__name">{character.name}</h1>
        <p className="hero__level">Nível {character.level}</p>

        <div className="xpbar" aria-label="Barra de experiência">
          <div className="xpbar__fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="xpbar__caption">
          {character.xp} / {need} XP
        </p>
        {flash && <p className="flash">{flash}</p>}
      </section>

      {loading ? (
        <p className="loading">Carregando quests...</p>
      ) : (
        <>
          <QuestSection
            title="Quests de hoje"
            hint="Até 3 por dia. Verbo + objeto + um “pronto” claro."
            quests={daily}
            canAdd={daily.length < 3}
            fullMessage="As 3 quests de hoje estão definidas. Foco."
            addPlaceholder="Ex: Enviar relatório do cliente X"
            busy={working}
            onAdd={(t) => add("daily", t)}
            onComplete={complete}
            onRemove={remove}
          />

          <QuestSection
            title="Avulsas"
            hint="Tarefas maiores, sem prazo de dia. Valem mais XP."
            quests={avulsas}
            canAdd={true}
            addPlaceholder="Ex: Estudar SQLite a fundo"
            busy={working}
            onAdd={(t) => add("avulsa", t)}
            onComplete={complete}
            onRemove={remove}
          />
        </>
      )}

      <button
        className="ghost"
        type="button"
        onClick={onReset}
        disabled={resetting || working}
      >
        {resetting ? "..." : "Recomeçar herói"}
      </button>
    </main>
  );
}
