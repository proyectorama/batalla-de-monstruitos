import type { Card } from "../types/cards";
import { chunkCards } from "../utils/cards";
import { CardFace } from "./CardFace";

type PrintAreaProps = {
  cards: Card[];
};

export function PrintArea({ cards }: PrintAreaProps) {
  const pages = chunkCards(cards, 15);

  return (
    <section className="print-area" aria-label="Hojas listas para imprimir">
      {pages.map((pageCards, pageIndex) => (
        <div className="print-page" key={`page-${pageIndex + 1}`}>
          {pageCards.map((card) => (
            <CardFace card={card} key={card.id} />
          ))}
        </div>
      ))}
    </section>
  );
}
