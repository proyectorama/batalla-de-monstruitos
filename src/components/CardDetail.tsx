import type { Card } from "../types/cards";
import { CardFace } from "./CardFace";

type CardDetailProps = {
  card: Card;
  titleId?: string;
};

export function CardDetail({ card, titleId = "detail-title" }: CardDetailProps) {
  return (
    <aside className="detail-card panel" aria-labelledby={titleId}>
      <p className="eyebrow">Carta seleccionada</p>
      <h2 id={titleId}>{card.name.toUpperCase()}</h2>
      <CardFace card={card} />
      <div className="detail-copy">
        {card.kind === "monster" ? (
          <p>
            Vida {card.life}, ataque {card.attack}, defensa {card.defense}. Cada escudo bloquea 1 punto de ataque, se gasta durante el turno y luego se repone.
          </p>
        ) : (
          <p>{card.rule}</p>
        )}
      </div>
    </aside>
  );
}
