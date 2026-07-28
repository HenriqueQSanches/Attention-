import { useEffect, useState } from "react";
import { BrandHeader } from "./BrandHeader.tsx";
import { addNote, fetchNotes, rememberNote, removeNote } from "./api.ts";
import type { Character, Note } from "./types.ts";

type Props = {
  character: Character;
  onCharacterUpdate: (c: Character) => void;
};

export function Pergaminho({ character, onCharacterUpdate }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1800);
    return () => clearTimeout(t);
  }, [flash]);

  async function anotar() {
    const t = title.trim();
    if (t.length < 3 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const note = await addNote({ title: t, body: body.trim() });
      setNotes((list) => [...list, note]);
      setTitle("");
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao anotar o recado.");
    } finally {
      setBusy(false);
    }
  }

  async function lembrar(id: number) {
    setBusy(true);
    setError(null);
    try {
      const res = await rememberNote(id);
      setNotes((list) => list.map((n) => (n.id === res.note.id ? res.note : n)));
      if (res.character) onCharacterUpdate(res.character);
      if (res.gained > 0) setFlash(`Lembrado. +${res.gained} ouro`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao ticar o recado.");
    } finally {
      setBusy(false);
    }
  }

  async function apagar(id: number) {
    setBusy(true);
    setError(null);
    try {
      await removeNote(id);
      setNotes((list) => list.filter((n) => n.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao apagar o recado.");
    } finally {
      setBusy(false);
    }
  }

  const pendentes = notes.filter((n) => !n.done).length;

  return (
    <main
      className="screen screen--with-nav"
      style={{ ["--accent" as string]: character.accent }}
    >
      <BrandHeader title="Pergaminho" sub="O que te pediram, escrito antes de evaporar." />

      <div className="scroll-status">
        <span className="scroll-status__count">
          {pendentes === 0 ? "Nenhum recado em aberto" : `${pendentes} em aberto`}
        </span>
        <span className="scroll-status__rule">Ticar rende 1 ouro</span>
      </div>

      {error && <p className="error">{error}</p>}
      {flash && <p className="scroll-flash">{flash}</p>}

      <div className="scroll">
        <div className="scroll__roll scroll__roll--top" />

        <section className="paper">
          {loading ? (
            <p className="paper__empty">Desenrolando o pergaminho...</p>
          ) : notes.length === 0 ? (
            <p className="paper__empty">
              Pergaminho em branco. O primeiro recado se escreve no pé da folha.
            </p>
          ) : (
            <ol className="paper__list">
              {notes.map((n, i) => (
                <li key={n.id} className={`note${n.done ? " note--done" : ""}`}>
                  <span className="note__num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="note__text">
                    <p className="note__title">{n.title}</p>
                    {n.body && <p className="note__body">{n.body}</p>}
                  </div>
                  <div className="note__actions">
                    <button
                      className="note__check"
                      type="button"
                      aria-label={n.done ? "Recado lembrado" : "Marcar como lembrado"}
                      disabled={n.done || busy}
                      onClick={() => lembrar(n.id)}
                    >
                      {n.done ? "✓" : ""}
                    </button>
                    <button
                      className="note__erase"
                      type="button"
                      aria-label="Apagar recado"
                      disabled={busy}
                      onClick={() => apagar(n.id)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <div className="paper__write">
            <p className="paper__label">Novo recado</p>
            <input
              className="paper__input"
              type="text"
              value={title}
              maxLength={70}
              placeholder="O que te pediram?"
              disabled={busy}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && anotar()}
            />
            <textarea
              className="paper__textarea"
              value={body}
              rows={2}
              maxLength={280}
              placeholder="Detalhe, se tiver: prazo, quem pediu, onde está"
              disabled={busy}
              onChange={(e) => setBody(e.target.value)}
            />
            <button
              className="paper__btn"
              type="button"
              disabled={title.trim().length < 3 || busy}
              onClick={anotar}
            >
              + Anotar no pergaminho
            </button>
          </div>
        </section>

        <div className="scroll__roll scroll__roll--bottom" />
      </div>
    </main>
  );
}
