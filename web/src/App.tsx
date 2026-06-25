import { useEffect, useState } from "react";
import { Casa } from "./Casa.tsx";
import { CreateCharacter } from "./CreateCharacter.tsx";
import { Home } from "./Home.tsx";
import { Loja } from "./Loja.tsx";
import { NavBar } from "./NavBar.tsx";
import { Taverna } from "./Taverna.tsx";
import { fetchCharacter, resetCharacter, saveCharacter } from "./api.ts";
import type { Character, CharacterInput, Screen } from "./types.ts";

export function App() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("home");

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
      setScreen("home");
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

  if (!character) {
    return <CreateCharacter onCreate={handleCreate} busy={busy} error={error} />;
  }

  return (
    <>
      {screen === "home" && (
        <Home
          character={character}
          onReset={handleReset}
          resetting={busy}
          onCharacterUpdate={setCharacter}
        />
      )}
      {screen === "casa" && <Casa character={character} />}
      {screen === "loja" && <Loja character={character} />}
      {screen === "taverna" && <Taverna character={character} />}
      <NavBar active={screen} onNavigate={setScreen} />
    </>
  );
}
