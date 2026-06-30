import { useState } from "react";
import { buyItem, equipItem, unequipSlot } from "./api.ts";
import { CharacterCanvas } from "./CharacterCanvas.tsx";
import { SHOP_ITEMS, TIER_LABEL, buildLayers } from "./data.ts";
import type { Character, ShopSlot } from "./types.ts";

// re-export para types.ts não precisar importar data diretamente
type Props = {
  character: Character;
  onCharacterUpdate: (c: Character) => void;
};

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
  const [activeSlot, setActiveSlot] = useState<ShopSlot>("torso");

  const items = SHOP_ITEMS.filter(
    (i) => i.slot === activeSlot && i.sexes.includes(character.sex),
  );

  async function handleBuy(itemId: string, price: number, itemPath: string) {
    setBusy(true);
    setMsg(null);
    try {
      const c = await buyItem(itemId, price, itemPath);
      onCharacterUpdate(c);
      setMsg("Item comprado! Equipe-o abaixo.");
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Erro ao comprar.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEquip(itemPath: string, slot: ShopSlot) {
    setBusy(true);
    try {
      const c = await equipItem(itemPath, slot);
      onCharacterUpdate(c);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Erro ao equipar.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUnequip(slot: ShopSlot) {
    setBusy(true);
    try {
      const c = await unequipSlot(slot);
      onCharacterUpdate(c);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Erro ao desequipar.");
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

  return (
    <main className="screen screen--with-nav" style={{ ["--accent" as string]: character.accent }}>
      <header className="herald">
        <p className="herald__kicker">attention!</p>
        <h1 className="herald__title">Loja</h1>
      </header>

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
                  onClick={() => handleUnequip(slot)}
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
          const owned = character.ownedItems.includes(item.id);
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
                  onClick={() => handleEquip(item.path, item.slot)}
                  disabled={busy}
                >
                  Equipar
                </button>
              ) : (
                <button
                  className="shop-card__btn"
                  type="button"
                  onClick={() => handleBuy(item.id, item.price, item.path)}
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
    </main>
  );
}
