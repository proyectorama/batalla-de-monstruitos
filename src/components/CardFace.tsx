import type { Card, StatKey } from "../types/cards";
import packageJson from "../../package.json";
import { defaultCardSizeHeight, defaultCardSizeWidth, type CardPrintOptions } from "../types/print";
import { statLabel } from "../utils/cards";
import { BoostArtView, MonsterArt, SpecialArtView } from "./MonsterArt";
import { StatIcon } from "./StatIcon";

type CardFaceProps = {
  card: Card;
  cardPrintOptions?: CardPrintOptions;
  selected?: boolean;
  onSelect?: (card: Card) => void;
};

const stats: StatKey[] = ["defense", "life", "attack"];

const boostBadge = (card: Card, hideValue: boolean): string => {
  if (card.kind === "boost_attack") return `+${hideValue ? "" : card.attackBonus} ${card.name.toUpperCase()}`;
  if (card.kind === "boost_defense") return `+${hideValue ? "" : card.defenseBonus} ${card.name.toUpperCase()}`;
  if (card.kind === "boost_life") return `+${hideValue ? "" : card.lifeBonus} ${card.name.toUpperCase()}`;
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
  hideBoostValues: false,
  width: defaultCardSizeWidth,
  height: defaultCardSizeHeight,
};

export function CardFace({ card, cardPrintOptions = defaultCardPrintOptions, selected = false, onSelect }: CardFaceProps) {
  const isInteractive = onSelect !== undefined;
  const cardBoostStat = boostStat(card);
  const isBoost = card.kind === "boost_attack" || card.kind === "boost_defense" || card.kind === "boost_life";
  const showCustomArtSpace = card.kind === "monster" && cardPrintOptions.hideTitleAndArt;
  const hideStatValues = card.kind === "monster" && cardPrintOptions.showStatIconsOnly;

  return (
    <article className={`game-card ${card.kind} ${selected ? "is-selected" : ""}`}>
      <button className="card-button" type="button" disabled={!isInteractive} onClick={() => onSelect?.(card)} aria-label={`Ver ${card.name}`}>
        {isBoost ? <div className="boost-band">{cardBoostStat ? <StatIcon stat={cardBoostStat} /> : null}<span className="boost-band-label">{boostBadge(card, cardPrintOptions.hideBoostValues)}</span></div> : null}
        {card.kind === "special" ? <div className="special-band">Poderes especiales</div> : null}
        <header className="card-header">
          <strong>{showCustomArtSpace ? "" : card.name.toUpperCase()}</strong>
        </header>

        <div className="art-frame">
          <span className="card-print-id">{card.id}</span>
          {showCustomArtSpace ? <div className="custom-art-space" aria-label="Espacio para dibujo propio" /> : null}
          {!showCustomArtSpace && card.kind === "monster" ? <MonsterArt art={card.art} /> : null}
          {isBoost ? <BoostArtView card={card} /> : null}
          {card.kind === "special" ? <SpecialArtView card={card} /> : null}
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
        ) : isBoost ? (
          <div className="boost-rule">
            <span className={card.defenseBonus > 0 && cardPrintOptions.hideBoostValues ? "boost-write-in" : ""}>{card.defenseBonus > 0 ? <><StatIcon stat="defense" /> +{cardPrintOptions.hideBoostValues ? <i aria-label="Espacio para valor de defensa" /> : card.defenseBonus}</> : null}</span>
            <span className={card.lifeBonus > 0 && cardPrintOptions.hideBoostValues ? "boost-write-in" : ""}>{card.lifeBonus > 0 ? <><StatIcon stat="life" /> +{cardPrintOptions.hideBoostValues ? <i aria-label="Espacio para valor de vida" /> : card.lifeBonus}</> : null}</span>
            <span className={card.attackBonus > 0 && cardPrintOptions.hideBoostValues ? "boost-write-in" : ""}>{card.attackBonus > 0 ? <><StatIcon stat="attack" /> +{cardPrintOptions.hideBoostValues ? <i aria-label="Espacio para valor de ataque" /> : card.attackBonus}</> : null}</span>
          </div>
        ) : (
          <div className="special-rule">{card.rule}</div>
        )}

        <span className="card-version">v{packageJson.version}</span>
      </button>
    </article>
  );
}
