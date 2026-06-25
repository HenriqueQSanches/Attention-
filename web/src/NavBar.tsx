import type { Screen } from "./types.ts";

type Props = {
  active: Screen;
  onNavigate: (s: Screen) => void;
};

const ITEMS: { id: Screen; label: string; icon: JSX.Element }[] = [
  {
    id: "home",
    label: "Início",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="7" x2="19" y2="7" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <line x1="5" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    id: "casa",
    label: "Casa",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 4l9 8M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    id: "loja",
    label: "Loja",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: "taverna",
    label: "Taverna",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 010 8h-1" />
        <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    ),
  },
];

export function NavBar({ active, onNavigate }: Props) {
  return (
    <nav className="navbar">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`navbar__item${active === item.id ? " navbar__item--active" : ""}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="navbar__icon">{item.icon}</span>
          <span className="navbar__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
