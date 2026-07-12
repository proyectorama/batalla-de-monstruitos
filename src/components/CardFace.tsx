import type { Card, StatKey } from "../types/cards";
import type { CardPrintOptions } from "../types/print";
import { statLabel } from "../utils/cards";
import { BoostArtView, MonsterArt } from "./MonsterArt";
import { StatIcon } from "./StatIcon";

type CardFaceProps = {
  card: Card;
  cardPrintOptions?: CardPrintOptions;
  selected?: boolean;
  onSelect?: (card: Card) => void;
};

const stats: StatKey[] = ["life", "attack", "defense"];

const boostBadge = (card: Card): string => {
  if (card.kind === "boost_attack") return `+${card.attackBonus} ${card.name.toUpperCase()}`;
  if (card.kind === "boost_defense") return `+${card.defenseBonus} ${card.name.toUpperCase()}`;
  if (card.kind === "boost_life") return `+${card.lifeBonus} ${card.name.toUpperCase()}`;
  return "";
};

const boostStat = (card: Card): StatKey | null => {
  if (card.kind === "boost_attack") return "attack";
  if (card.kind === "boost_defense") return "defense";
  if (card.kind === "boost_life") return "life";
  return null;
};

const defaultCardPrintOptions: CardPrintOptions = {
  hideTitleAndArt: false,
  showStatIconsOnly: false,
};

export function CardFace({ card, cardPrintOptions = defaultCardPrintOptions, selected = false, onSelect }: CardFaceProps) {
  const isInteractive = onSelect !== undefined;
  const cardBoostStat = boostStat(card);
  const showCustomArtSpace = card.kind === "monster" && cardPrintOptions.hideTitleAndArt;
  const hideStatValues = card.kind === "monster" && cardPrintOptions.showStatIconsOnly;

  return (
    <article className={`game-card ${card.kind} ${selected ? "is-selected" : ""}`}>
      <button className="card-button" type="button" disabled={!isInteractive} onClick={() => onSelect?.(card)} aria-label={`Ver ${card.name}`}>
        {card.kind !== "monster" ? <div className="boost-band">{cardBoostStat ? <StatIcon stat={cardBoostStat} /> : null}<span className="boost-band-label">{boostBadge(card)}</span></div> : null}
        <header className="card-header">
          <strong>{showCustomArtSpace ? "" : card.name.toUpperCase()}</strong>
        </header>

        <div className="art-frame">
          <span className="card-print-id">{card.id}</span>
          {showCustomArtSpace ? <div className="custom-art-space" aria-label="Espacio para dibujo propio" /> : null}
          {!showCustomArtSpace && card.kind === "monster" ? <MonsterArt art={card.art} /> : null}
          {card.kind !== "monster" ? <BoostArtView card={card} /> : null}
        </div>

        {card.kind === "monster" ? (
          <dl className={`stats-row ${hideStatValues ? "stats-row-write-in" : ""}`}>
            {stats.map((stat) => (
              <div className={`stat stat-${stat}`} key={stat}>
                <dt><StatIcon stat={stat} /></dt>
                <dd aria-label={statLabel(stat)}>{hideStatValues ? null : card[stat]}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="boost-rule">
            <span>{card.attackBonus > 0 ? <><StatIcon stat="attack" /> +{card.attackBonus}</> : null}</span>
            <span>{card.defenseBonus > 0 ? <><StatIcon stat="defense" /> +{card.defenseBonus}</> : null}</span>
            <span>{card.lifeBonus > 0 ? <><StatIcon stat="life" /> +{card.lifeBonus}</> : null}</span>
          </div>
        )}

      </button>
    </article>
  );
}
