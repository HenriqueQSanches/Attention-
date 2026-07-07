import { BrandHeader } from "./BrandHeader.tsx";
import type { Character } from "./types.ts";

type Props = {
  character: Character;
};

export function Taverna({ character }: Props) {
  return (
    <main
      className="screen screen--with-nav"
      style={{ ["--accent" as string]: character.accent }}
    >
      <BrandHeader title="Taverna" sub="Descanse, recarregue e escolha seus buffs." />

      <section className="buff-card buff-card--locked">
        <div className="buff-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
            <path d="M17 8h1a4 4 0 010 8h-1" />
            <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
          </svg>
        </div>
        <div className="buff-card__info">
          <p className="buff-card__name">Cerveja do Herói</p>
          <p className="buff-card__desc">+10% de XP por 30 minutos após tomar.</p>
          <p className="buff-card__cost">— ouro</p>
        </div>
        <span className="buff-card__badge">Em breve</span>
      </section>
    </main>
  );
}
