import type { StatKey } from "../types/cards";

type StatIconProps = {
  stat: StatKey;
  className?: string;
  title?: string;
};

export function StatIcon({ stat, className = "", title }: StatIconProps) {
  const label = title ?? (stat === "life" ? "Vida" : stat === "attack" ? "Ataque" : "Defensa");

  if (stat === "life") {
    return (
      <svg className={`stat-icon stat-icon-life ${className}`} viewBox="0 0 64 64" role="img" aria-label={label}>
        <path className="stat-icon-shadow" d="M32 56 C15 43 8 33 10 22 C12 12 25 10 32 20 C39 10 52 12 54 22 C56 33 49 43 32 56 Z" />
        <path d="M32 56 C15 43 8 33 10 22 C12 12 25 10 32 20 C39 10 52 12 54 22 C56 33 49 43 32 56 Z" fill="#ff8fab" stroke="#2f2522" strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 23 C22 17 28 17 31 23" fill="none" stroke="#fffdf6" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (stat === "attack") {
    return (
      <svg className={`stat-icon stat-icon-attack ${className}`} viewBox="0 0 64 64" role="img" aria-label={label}>
        <path className="stat-icon-shadow" d="M17 55 L9 47 L28 29 L22 23 L26 19 L32 25 L48 9 L55 16 L39 32 L45 38 L41 42 L35 36 Z" />
        <path d="M34 29 L50 9 L55 14 L35 34 Z" fill="#ffe17a" stroke="#2f2522" strokeWidth="3" strokeLinejoin="round" />
        <path d="M27 25 L32 20 L45 33 L40 38 Z" fill="#ff8fab" stroke="#2f2522" strokeWidth="3" strokeLinejoin="round" />
        <path d="M23 28 L36 41 L17 57 L7 47 Z" fill="#7bdff2" stroke="#2f2522" strokeWidth="3" strokeLinejoin="round" />
        <path d="M13 47 L18 52" fill="none" stroke="#fffdf6" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={`stat-icon stat-icon-defense ${className}`} viewBox="0 0 64 64" role="img" aria-label={label}>
      <path className="stat-icon-shadow" d="M32 5 L54 14 L51 35 C48 49 39 57 32 61 C25 57 16 49 13 35 L10 14 Z" />
      <path d="M32 5 L54 14 L51 35 C48 49 39 57 32 61 C25 57 16 49 13 35 L10 14 Z" fill="#b9fbc0" stroke="#2f2522" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 11 L47 17 L45 34 C43 43 38 50 32 54 C26 50 21 43 19 34 L17 17 Z" fill="#fffdf6" stroke="#2f2522" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 15 L42 20 L40 33 C39 39 36 44 32 48 Z" fill="#7bdff2" opacity="0.9" />
      <path d="M24 30 L29 36 L41 24" fill="none" stroke="#2f2522" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
