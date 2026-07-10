import type { Card, StatKey } from "../types/cards";
import { kindLabel, statIcon, statLabel } from "../utils/cards";
import { BoostArtView, MonsterArt } from "./MonsterArt";

type CardFaceProps = {
  card: Card;
  selected?: boolean;
  onSelect?: (card: Card) => void;
};

const stats: StatKey[] = ["life", "attack", "defense"];

export function CardFace({ card, selected = false, onSelect }: CardFaceProps) {
  const isInteractive = onSelect !== undefined;

  return (
    <article className={`game-card ${card.kind} ${selected ? "is-selected" : ""}`}>
      <button className="card-button" type="button" disabled={!isInteractive} onClick={() => onSelect?.(card)} aria-label={`Ver ${card.name}`}>
        <header className="card-header">
          <span className="card-kind">{kindLabel(card.kind)}</span>
          <strong>{card.name}</strong>
        </header>

        <div className="art-frame">{card.kind === "monster" ? <MonsterArt art={card.art} /> : <BoostArtView card={card} />}</div>

        {card.kind === "monster" ? (
          <dl className="stats-row">
            {stats.map((stat) => (
              <div className={`stat stat-${stat}`} key={stat}>
                <dt>{statIcon(stat)}</dt>
                <dd aria-label={statLabel(stat)}>{card[stat]}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="boost-rule">
            <span>{card.attackBonus > 0 ? `✦ +${card.attackBonus} Ataque` : null}</span>
            <span>{card.defenseBonus > 0 ? `⬟ +${card.defenseBonus} Defensa` : null}</span>
            <span>{card.lifeBonus > 0 ? `♥ +${card.lifeBonus} Vida` : null}</span>
          </div>
        )}

      </button>
    </article>
  );
}
