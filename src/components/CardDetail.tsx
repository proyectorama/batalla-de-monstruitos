import type { Card } from "../types/cards";
import { CardFace } from "./CardFace";
import type { CardPrintOptions } from "../types/print";

type CardDetailProps = {
  card: Card;
  titleId?: string;
  cardPrintOptions: CardPrintOptions;
};

export function CardDetail({ card, titleId = "detail-title", cardPrintOptions }: CardDetailProps) {
  return (
    <aside className="detail-card panel" aria-labelledby={titleId}>
      <p className="eyebrow">Carta seleccionada</p>
      <h2 id={titleId}>{cardPrintOptions.hideTitleAndArt && card.kind === "monster" ? "CARTA CREATIVA" : card.name.toUpperCase()}</h2>
      <CardFace card={card} cardPrintOptions={cardPrintOptions} />
      <div className="detail-copy">
        {card.kind === "monster" ? (
          <p>
            {cardPrintOptions.showStatIconsOnly ? "Completá vida, defensa y ataque a mano." : `Escudos ${card.defense}, vida ${card.life}, ataque ${card.attack}. Cada escudo bloquea 1 punto de ataque, se gasta durante el turno y luego se repone.`}
          </p>
        ) : (
          <p>{card.rule}</p>
        )}
      </div>
    </aside>
  );
}
