import { useEffect, useState } from "react";
import { CreateCharacter } from "./CreateCharacter.tsx";
import { Home } from "./Home.tsx";
import { fetchCharacter, resetCharacter, saveCharacter } from "./api.ts";
import type { Character, CharacterInput } from "./types.ts";

export function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacter()
      .then(setCharacter)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: CharacterInput) {
    setBusy(true);
    setError(null);
    try {
      setCharacter(await saveCharacter(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar herói.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    setBusy(true);
    setError(null);
    try {
      await resetCharacter();
      setCharacter(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao resetar herói.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="screen screen--center">
        <p className="loading">Invocando seu herói...</p>
      </main>
    );
  }

  return character ? (
    <Home
      character={character}
      onReset={handleReset}
      resetting={busy}
      onCharacterUpdate={setCharacter}
    />
  ) : (
    <CreateCharacter onCreate={handleCreate} busy={busy} error={error} />
  );
}
