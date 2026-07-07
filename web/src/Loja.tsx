import { useState } from "react";
import { buyItem, buyAssistant, equipItem, equipAssistant, unequipSlot } from "./api.ts";
import { BrandHeader } from "./BrandHeader.tsx";
import { CharacterCanvas } from "./CharacterCanvas.tsx";
import { Assistant } from "./Assistant.tsx";
import { ASSISTANTS, SHOP_ITEMS, TIER_LABEL, buildLayers, assistantById } from "./data.ts";
import type { Character, ShopSlot } from "./types.ts";

type Props = {
  character: Character;
  onCharacterUpdate: (c: Character) => void;
};

type Mode = "roupas" | "assistants";

const SLOT_LABEL: Record<ShopSlot, string> = {
  torso: "Torso",
  legs:  "Pernas",
  feet:  "Pés",
};

const TIER_COLOR: Record<string, string> = {
  common: "var(--muted)",
  rare:   "#a371f7",
  epic:   "#d99a2b",
};

export function Loja({ character, onCharacterUpdate }: Props) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("roupas");
  const [activeSlot, setActiveSlot] = useState<ShopSlot>("torso");

  const items = SHOP_ITEMS.filter(
    (i) => i.slot === activeSlot && i.sexes.includes(character.sex),
  );

  async function run(action: () => Promise<Character>, okMsg?: string) {
    setBusy(true);
    if (okMsg === undefined) setMsg(null);
    try {
      const c = await action();
      onCharacterUpdate(c);
      if (okMsg) setMsg(okMsg);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Algo deu errado.");
    } finally {
      setBusy(false);
    }
  }

  const previewLayers = buildLayers({
    sex:       character.sex,
    skin:      character.skin,
    hair:      character.hair,
    hairColor: character.hairColor,
    torso:     character.torso ?? undefined,
    legs:      character.legs ?? undefined,
    feet:      character.feet ?? undefined,
  });

  const equippedAssistant = assistantById(character.assistant);

  return (
    <main className="screen screen--with-nav" style={{ ["--accent" as string]: character.accent }}>
      <BrandHeader title="Loja" />

      <div className="shop-modes">
        <button
          type="button"
          className={`chip chip--text${mode === "roupas" ? " chip--on" : ""}`}
          onClick={() => { setMode("roupas"); setMsg(null); }}
        >
          Roupas
        </button>
        <button
          type="button"
          className={`chip chip--text${mode === "assistants" ? " chip--on" : ""}`}
          onClick={() => { setMode("assistants"); setMsg(null); }}
        >
          Arautos
        </button>
      </div>

      {mode === "roupas" ? (
        <>
          <div className="shop-hero">
            <CharacterCanvas layers={previewLayers} size={128} />
            <div className="shop-gold">
              <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" />
              </svg>
              {character.gold} ouro
            </div>
          </div>

          <div className="shop-slots">
            {(["torso", "legs", "feet"] as ShopSlot[]).map((slot) => {
              const equipped = character[slot];
              return (
                <div key={slot} className="shop-slot">
                  <span className="shop-slot__label">{SLOT_LABEL[slot]}</span>
                  {equipped ? (
                    <button
                      className="chip chip--text chip--on"
                      type="button"
                      onClick={() => run(() => unequipSlot(slot))}
                      disabled={busy}
                    >
                      Remover
                    </button>
                  ) : (
                    <span className="shop-slot__empty">vazio</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="shop-tabs">
            {(["torso", "legs", "feet"] as ShopSlot[]).map((slot) => (
              <button
                key={slot}
                type="button"
                className={`chip chip--text${activeSlot === slot ? " chip--on" : ""}`}
                onClick={() => setActiveSlot(slot)}
              >
                {SLOT_LABEL[slot]}
              </button>
            ))}
          </div>

          {msg && <p className="shop-msg">{msg}</p>}

          <div className="shop-grid">
            {items.map((item) => {
              const owned = character.ownedItems.includes(item.path);
              const equipped = character[item.slot] === item.path;
              return (
                <div key={item.id} className={`shop-card${equipped ? " shop-card--equipped" : ""}`}>
                  <div className="shop-card__sprite">
                    <CharacterCanvas
                      layers={buildLayers({
                        sex:       character.sex,
                        skin:      character.skin,
                        hair:      character.hair,
                        hairColor: character.hairColor,
                        [item.slot]: item.path,
                      })}
                      size={80}
                    />
                  </div>
                  <p className="shop-card__name">{item.label}</p>
                  <p className="shop-card__tier" style={{ color: TIER_COLOR[item.tier] }}>
                    {TIER_LABEL[item.tier]}
                  </p>
                  {equipped ? (
                    <span className="shop-card__badge">Equipado</span>
                  ) : owned ? (
                    <button
                      className="shop-card__btn"
                      type="button"
                      onClick={() => run(() => equipItem(item.path, item.slot))}
                      disabled={busy}
                    >
                      Equipar
                    </button>
                  ) : (
                    <button
                      className="shop-card__btn"
                      type="button"
                      onClick={() => run(() => buyItem(item.id, item.price, item.path), "Item comprado! Equipe-o abaixo.")}
                      disabled={busy || character.gold < item.price}
                      title={character.gold < item.price ? "Ouro insuficiente" : undefined}
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
                        <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" />
                      </svg>
                      {item.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="shop-hero">
            <Assistant seed={equippedAssistant.seed} size={128} options={equippedAssistant.opts} />
            <p className="shop-hero__caption">{equippedAssistant.name} é o teu arauto</p>
            <div className="shop-gold">
              <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" />
              </svg>
              {character.gold} ouro
            </div>
          </div>

          {msg && <p className="shop-msg">{msg}</p>}

          <div className="shop-grid">
            {ASSISTANTS.map((a) => {
              const owned = character.ownedAssistants.includes(a.id);
              const equipped = character.assistant === a.id;
              return (
                <div key={a.id} className={`shop-card${equipped ? " shop-card--equipped" : ""}`}>
                  <div className="shop-card__sprite">
                    <Assistant seed={a.seed} size={80} options={a.opts} />
                  </div>
                  <p className="shop-card__name">{a.name}</p>
                  <p className="shop-card__tier" style={{ color: TIER_COLOR[a.tier] }}>
                    {TIER_LABEL[a.tier]}
                  </p>
                  {equipped ? (
                    <span className="shop-card__badge">Ativo</span>
                  ) : owned ? (
                    <button
                      className="shop-card__btn"
                      type="button"
                      onClick={() => run(() => equipAssistant(a.id))}
                      disabled={busy}
                    >
                      Ativar
                    </button>
                  ) : (
                    <button
                      className="shop-card__btn"
                      type="button"
                      onClick={() => run(() => buyAssistant(a.id, a.price), `${a.name} recrutado! Ative abaixo.`)}
                      disabled={busy || character.gold < a.price}
                      title={character.gold < a.price ? "Ouro insuficiente" : undefined}
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
                        <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" />
                      </svg>
                      {a.price}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
