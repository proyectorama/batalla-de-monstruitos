import type { BoostArt, MonsterArt as MonsterArtType } from "../types/cards";

type MonsterArtProps = {
  art: MonsterArtType;
};

type BoostArtProps = {
  art: BoostArt;
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

export function BoostArtView({ art }: BoostArtProps) {
  return (
    <svg className="card-art boost-art" viewBox="0 0 160 160" role="img" aria-label="Icono de mejora">
      <circle cx="80" cy="80" r="60" fill={art.color} stroke="#3a2d2a" strokeWidth="5" />
      {art.icon === "cookie" ? (
        <g>
          <circle cx="80" cy="82" r="38" fill={art.color} stroke="#3a2d2a" strokeWidth="5" />
          <circle cx="66" cy="72" r="5" fill={art.accent} />
          <circle cx="88" cy="93" r="6" fill={art.accent} />
          <circle cx="99" cy="68" r="4" fill={art.accent} />
        </g>
      ) : null}
      {art.icon === "spark" ? <path d="M85 28 L69 72 L105 69 L66 132 L78 90 L47 91 Z" fill={art.accent} stroke="#3a2d2a" strokeWidth="5" strokeLinejoin="round" /> : null}
      {art.icon === "shield" ? <path d="M80 30 L122 47 L116 92 C112 116 96 130 80 137 C64 130 48 116 44 92 L38 47 Z" fill={art.accent} stroke="#3a2d2a" strokeWidth="5" strokeLinejoin="round" /> : null}
      {art.icon === "leaf" ? <path d="M42 101 C52 48 101 35 123 47 C124 96 82 122 42 101 Z M53 99 C72 87 91 69 111 50" fill={art.accent} stroke="#3a2d2a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {art.icon === "heart" ? <path d="M80 125 C46 99 31 80 40 58 C48 38 72 42 80 58 C88 42 112 38 120 58 C129 80 114 99 80 125 Z" fill={art.accent} stroke="#3a2d2a" strokeWidth="5" /> : null}
      {art.icon === "potion" ? (
        <g>
          <path d="M67 28 H93 V54 L116 99 C127 121 110 139 80 139 C50 139 33 121 44 99 L67 54 Z" fill="#fffaf0" stroke="#3a2d2a" strokeWidth="5" strokeLinejoin="round" />
          <path d="M52 104 C64 93 93 93 108 105 C107 120 95 130 80 130 C64 130 53 120 52 104 Z" fill={art.accent} />
          <path d="M64 28 H96" stroke="#3a2d2a" strokeWidth="9" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
}
