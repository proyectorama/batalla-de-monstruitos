import type { Card, StatKey } from "../types/cards";
import { statIcon, statLabel } from "../utils/cards";
import { BoostArtView, MonsterArt } from "./MonsterArt";

type CardFaceProps = {
  card: Card;
  selected?: boolean;
  onSelect?: (card: Card) => void;
};

const stats: StatKey[] = ["life", "attack", "defense"];

const boostBadge = (card: Card): string => {
  if (card.kind === "boost_attack") return `✦ +${card.attackBonus} ${card.name.toUpperCase()}`;
  if (card.kind === "boost_defense") return `⬟ +${card.defenseBonus} ${card.name.toUpperCase()}`;
  if (card.kind === "boost_life") return `♥ +${card.lifeBonus} ${card.name.toUpperCase()}`;
  return "";
};

export function CardFace({ card, selected = false, onSelect }: CardFaceProps) {
  const isInteractive = onSelect !== undefined;

  return (
    <article className={`game-card ${card.kind} ${selected ? "is-selected" : ""}`}>
      <button className="card-button" type="button" disabled={!isInteractive} onClick={() => onSelect?.(card)} aria-label={`Ver ${card.name}`}>
        {card.kind !== "monster" ? <div className="boost-band">{boostBadge(card)}</div> : null}
        <header className="card-header">
          <strong>{card.name.toUpperCase()}</strong>
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
            <span>{card.attackBonus > 0 ? `✦ +${card.attackBonus}` : null}</span>
            <span>{card.defenseBonus > 0 ? `⬟ +${card.defenseBonus}` : null}</span>
            <span>{card.lifeBonus > 0 ? `♥ +${card.lifeBonus}` : null}</span>
          </div>
        )}

      </button>
    </article>
  );
}
