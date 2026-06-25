import type { Character } from "./types.ts";

type Props = {
  character: Character;
};

export function Loja({ character }: Props) {
  return (
    <main
      className="screen screen--with-nav"
      style={{ ["--accent" as string]: character.accent }}
    >
      <header className="herald">
        <p className="herald__kicker">attention!</p>
        <h1 className="herald__title">Loja</h1>
        <p className="herald__sub">
          Gaste seu ouro com sabedoria.
        </p>
      </header>

      <div className="gold-display">
        <svg viewBox="0 0 16 16" fill="currentColor" width="18" height="18">
          <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" />
        </svg>
        <span>{character.gold ?? 0} ouro</span>
      </div>

      <div className="shop-placeholder">
        <p className="shop-placeholder__title">Chegando em breve</p>
        <p className="shop-placeholder__hint">Casas, móveis e roupas para o seu herói.</p>
      </div>
    </main>
  );
}
