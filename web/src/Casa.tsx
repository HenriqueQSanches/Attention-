import { CharacterSprite } from "./CharacterSprite.tsx";
import type { Character } from "./types.ts";

type Props = {
  character: Character;
};

export function Casa({ character }: Props) {
  return (
    <main
      className="screen screen--with-nav"
      style={{ ["--accent" as string]: character.accent }}
    >
      <header className="herald">
        <p className="herald__kicker">attention!</p>
        <h1 className="herald__title">Casa do Herói</h1>
      </header>

      <section className="casa-empty">
        <CharacterSprite sigil={character.sigil} accent={character.accent} size={90} />
        <p className="casa-empty__title">Sem moradia</p>
        <p className="casa-empty__hint">
          Seu herói ainda não tem um lar. Conclua quests e acumule ouro para conquistar uma morada.
        </p>
      </section>
    </main>
  );
}
