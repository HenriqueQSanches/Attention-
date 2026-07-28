import { BrandHeader } from "./BrandHeader.tsx";
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
      <BrandHeader title="Casa do Herói" />

      <section className="casa-empty">
        <CharacterSprite
          sex={character.sex}
          skin={character.skin}
          hair={character.hair}
          hairColor={character.hairColor}
          torso={character.torso ?? undefined}
          legs={character.legs ?? undefined}
          feet={character.feet ?? undefined}
          head={character.head ?? undefined}
          face={character.face ?? undefined}
          size={90}
        />
        <p className="casa-empty__title">Sem moradia</p>
        <p className="casa-empty__hint">
          Seu herói ainda não tem um lar. Conclua quests e acumule ouro para conquistar uma morada.
        </p>
      </section>
    </main>
  );
}
