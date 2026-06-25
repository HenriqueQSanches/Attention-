import { useState } from "react";
import { Avatar } from "./Avatar.tsx";
import { CharacterSprite } from "./CharacterSprite.tsx";
import { ACCENTS, SIGILS, hairsBySex } from "./data.ts";
import type { CharacterInput } from "./types.ts";

type Props = {
  onCreate: (input: CharacterInput) => void;
  busy: boolean;
  error: string | null;
};

export function CreateCharacter({ onCreate, busy, error }: Props) {
  const [name, setName] = useState("");
  const [sigil, setSigil] = useState(SIGILS[0].id);
  const [accent, setAccent] = useState(ACCENTS[0].hex);
  const [sex, setSex] = useState<"M" | "F">("M");
  const [hair, setHair] = useState(hairsBySex("M")[0].id);

  function handleSexChange(s: "M" | "F") {
    setSex(s);
    setHair(hairsBySex(s)[0].id);
  }

  const canStart = name.trim().length >= 2 && !busy;

  return (
    <main className="screen">
      <header className="herald">
        <p className="herald__kicker">attention!</p>
        <h1 className="herald__title">Forje seu herói</h1>
        <p className="herald__sub">
          A vida inteira mandaram você prestar atenção. Aqui, a palavra está do
          seu lado.
        </p>
      </header>

      <section className="preview" style={{ ["--accent" as string]: accent }}>
        <CharacterSprite sigil={sigil} accent={accent} sex={sex} hair={hair} size={86} />
        <p className="preview__name">{name.trim() || "Sem nome"}</p>
        <p className="preview__level">Nível 1</p>
      </section>

      <label className="field">
        <span className="field__label">Nome de herói</span>
        <input
          className="field__input"
          type="text"
          value={name}
          maxLength={24}
          placeholder="Como você quer ser chamado?"
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </label>

      <div className="field">
        <span className="field__label">Sexo</span>
        <div className="picker">
          {(["M", "F"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`chip chip--text${sex === s ? " chip--on" : ""}`}
              onClick={() => handleSexChange(s)}
              aria-pressed={sex === s}
            >
              {s === "M" ? "Masculino" : "Feminino"}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Cabelo</span>
        <div className="picker">
          {hairsBySex(sex).map((h) => (
            <button
              key={h.id}
              type="button"
              className={`chip chip--text${hair === h.id ? " chip--on" : ""}`}
              onClick={() => setHair(h.id)}
              aria-pressed={hair === h.id}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Sigilo</span>
        <div className="picker">
          {SIGILS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`chip${sigil === s.id ? " chip--on" : ""}`}
              onClick={() => setSigil(s.id)}
              aria-pressed={sigil === s.id}
              title={s.label}
            >
              <Avatar sigil={s.id} accent={accent} size={44} />
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Cor de destaque</span>
        <div className="picker">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`swatch${accent === a.hex ? " swatch--on" : ""}`}
              style={{ backgroundColor: a.hex }}
              onClick={() => setAccent(a.hex)}
              aria-pressed={accent === a.hex}
              title={a.label}
            />
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button
        className="cta"
        type="button"
        disabled={!canStart}
        style={{ ["--accent" as string]: accent }}
        onClick={() => onCreate({ name: name.trim(), sigil, accent, sex, hair })}
      >
        {busy ? "Forjando..." : "Iniciar jornada"}
      </button>
    </main>
  );
}
