type Props = {
  title?: string;
  sub?: string;
};

export function BrandHeader({ title, sub }: Props) {
  return (
    <header className="herald brand">
      <div className="brand__lockup">
        <img
          className="brand__logo"
          src="/icon.svg"
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <p className="brand__word">Attention!</p>
      </div>
      {title && <h1 className="herald__title">{title}</h1>}
      {sub && <p className="brand__tagline">{sub}</p>}
    </header>
  );
}
