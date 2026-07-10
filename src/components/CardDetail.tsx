import type { Card } from "../types/cards";
import { kindLabel } from "../utils/cards";
import { CardFace } from "./CardFace";

type CardDetailProps = {
  card: Card;
};

export function CardDetail({ card }: CardDetailProps) {
  return (
    <aside className="detail-card panel" aria-labelledby="detail-title">
      <p className="eyebrow">Carta seleccionada</p>
      <h2 id="detail-title">{card.name}</h2>
      <CardFace card={card} />
      <div className="detail-copy">
        <strong>{kindLabel(card.kind)}</strong>
        {card.kind === "monster" ? (
          <p>
            Vida {card.life}, ataque {card.attack}, defensa {card.defense}. Cuando ataca, hace ataque menos defensa rival, con minimo 1 de dano.
          </p>
        ) : (
          <p>{card.rule}</p>
        )}
      </div>
    </aside>
  );
}
