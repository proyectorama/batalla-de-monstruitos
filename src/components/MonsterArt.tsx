import type { BoostCard, MonsterArt as MonsterArtType } from "../types/cards";

type MonsterArtProps = {
  art: MonsterArtType;
};

type BoostArtProps = {
  card: BoostCard;
};

const bonusValue = (card: BoostCard): number => Math.max(card.attackBonus, card.defenseBonus, card.lifeBonus);

const bonusColor = (bonus: number): string => {
  switch (bonus) {
    case 1:
      return "#7bdff2";
    case 2:
      return "#ffd166";
    case 3:
      return "#ff8fab";
    default:
      return "#bdb2ff";
  }
};

const bodyPath = (body: MonsterArtType["body"]): string => {
  switch (body) {
    case "blob":
      return "M72 34 C98 18 132 31 139 61 C148 101 121 133 80 130 C38 127 17 99 27 62 C32 45 49 38 72 34 Z";
    case "round":
      return "M80 28 C112 28 138 53 138 84 C138 116 113 137 80 137 C46 137 22 114 22 84 C22 51 47 28 80 28 Z";
    case "drop":
      return "M80 18 C104 45 130 64 130 96 C130 124 108 142 80 142 C51 142 30 124 30 96 C30 64 56 45 80 18 Z";
    case "cloud":
      return "M44 111 C24 109 15 94 25 78 C16 56 39 40 59 51 C68 30 101 30 110 52 C132 47 147 62 142 82 C157 94 148 114 128 115 Z";
    case "star":
      return "M80 20 L96 58 L138 57 L106 83 L118 124 L80 101 L43 124 L55 83 L22 57 L64 58 Z";
    case "jelly":
      return "M31 68 C34 38 57 25 82 27 C114 29 133 50 132 82 L132 122 C123 114 116 114 107 123 C97 132 88 132 80 122 C70 132 60 132 51 123 C43 114 39 114 30 122 Z";
    case "shell":
      return "M25 92 C29 53 53 32 82 32 C111 32 133 54 137 92 C123 121 106 134 80 134 C54 134 37 121 25 92 Z";
    case "sprout":
      return "M79 38 C104 38 126 58 126 88 C126 119 106 138 80 138 C53 138 33 119 33 88 C33 59 54 38 79 38 Z";
  }
};

export function MonsterArt({ art }: MonsterArtProps) {
  const eyes = Array.from({ length: art.eyeCount }, (_, index) => index);
  const eyeStart = 80 - (art.eyeCount - 1) * 16;

  return (
    <svg className="card-art" viewBox="0 0 160 160" role="img" aria-label="Dibujo de monstruo amistoso">
      {art.features.includes("wings") ? (
        <g fill={art.accent} opacity="0.75">
          <path d="M34 80 C8 67 8 109 39 101 C32 94 31 87 34 80 Z" />
          <path d="M126 80 C152 67 152 109 121 101 C128 94 129 87 126 80 Z" />
        </g>
      ) : null}
      {art.features.includes("antenna") ? (
        <g stroke="#3a2d2a" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M68 36 C62 18 48 18 45 10" />
          <path d="M92 36 C98 18 112 18 115 10" />
        </g>
      ) : null}
      {art.features.includes("horns") ? (
        <g fill={art.accent} stroke="#3a2d2a" strokeWidth="3">
          <path d="M54 43 L45 15 L70 36 Z" />
          <path d="M106 43 L115 15 L90 36 Z" />
        </g>
      ) : null}
      <path d={bodyPath(art.body)} fill={art.color} stroke="#3a2d2a" strokeWidth="5" strokeLinejoin="round" />
      {art.body === "shell" ? <path d="M42 85 C58 52 101 52 119 85" fill="none" stroke={art.accent} strokeWidth="9" strokeLinecap="round" /> : null}
      {art.body === "sprout" ? (
        <path d="M80 44 C76 22 53 18 47 35 C59 38 70 39 80 44 C88 24 111 22 117 39 C104 40 92 42 80 44 Z" fill={art.accent} stroke="#3a2d2a" strokeWidth="3" />
      ) : null}
      {art.features.includes("spots") ? (
        <g fill={art.accent} opacity="0.75">
          <circle cx="52" cy="75" r="8" />
          <circle cx="112" cy="92" r="10" />
          <circle cx="70" cy="115" r="6" />
        </g>
      ) : null}
      {art.features.includes("tuft") ? <path d="M69 38 C72 22 83 22 80 39 C90 25 101 33 88 43" fill="none" stroke="#3a2d2a" strokeWidth="5" strokeLinecap="round" /> : null}
      {art.features.includes("tail") ? <path d="M128 96 C151 94 147 119 130 112" fill="none" stroke="#3a2d2a" strokeWidth="6" strokeLinecap="round" /> : null}
      <g>
        {eyes.map((eye) => (
          <g key={eye}>
            <circle cx={eyeStart + eye * 16} cy="78" r="11" fill="#fffaf0" stroke="#3a2d2a" strokeWidth="3" />
            <circle cx={eyeStart + eye * 16 + 3} cy="81" r="4" fill="#3a2d2a" />
          </g>
        ))}
      </g>
      {art.features.includes("cheeks") ? (
        <g fill="#ff7aa8" opacity="0.7">
          <circle cx="48" cy="98" r="7" />
          <circle cx="112" cy="98" r="7" />
        </g>
      ) : null}
      <path d="M64 101 C72 112 88 112 96 101" fill="none" stroke="#3a2d2a" strokeWidth="5" strokeLinecap="round" />
      {art.features.includes("feet") ? (
        <g fill={art.accent} stroke="#3a2d2a" strokeWidth="4">
          <ellipse cx="58" cy="132" rx="13" ry="8" />
          <ellipse cx="102" cy="132" rx="13" ry="8" />
        </g>
      ) : null}
    </svg>
  );
}

export function BoostArtView({ card }: BoostArtProps) {
  const bonus = bonusValue(card);
  const mainColor = bonusColor(bonus);

  return (
    <svg className="card-art boost-art" viewBox="0 0 160 160" role="img" aria-label="Icono de mejora">
      <circle cx="80" cy="80" r="60" fill={mainColor} stroke="#3a2d2a" strokeWidth="5" />
      <circle cx="80" cy="80" r="48" fill="#fffaf0" stroke="#3a2d2a" strokeWidth="4" opacity="0.94" />
      {card.kind === "boost_life" ? <path d="M80 118 C51 96 40 80 47 62 C53 47 72 50 80 63 C88 50 107 47 113 62 C120 80 109 96 80 118 Z" fill={mainColor} stroke="#3a2d2a" strokeWidth="5" /> : null}
      {card.kind === "boost_attack" ? <path d="M84 36 L68 74 L102 72 L63 126 L76 90 L48 91 Z" fill={mainColor} stroke="#3a2d2a" strokeWidth="5" strokeLinejoin="round" /> : null}
      {card.kind === "boost_defense" ? <path d="M80 37 L116 52 L111 90 C108 111 94 125 80 132 C66 125 52 111 49 90 L44 52 Z" fill={mainColor} stroke="#3a2d2a" strokeWidth="5" strokeLinejoin="round" /> : null}
    </svg>
  );
}
