import type { Card, CardKind } from "../types/cards";
import { kindLabel } from "../utils/cards";
import { CardFace } from "./CardFace";
import type { CardPrintOptions } from "../types/print";

type Filter = CardKind | "all";

type CardGalleryProps = {
  cards: Card[];
  selectedCardId: string;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onSelect: (card: Card) => void;
  cardPrintOptions: CardPrintOptions;
};

const filters: Filter[] = ["all", "monster", "boost_attack", "boost_defense", "boost_life", "special"];

export function CardGallery({ cards, selectedCardId, filter, onFilterChange, onSelect, cardPrintOptions }: CardGalleryProps) {
  const filteredCards = filter === "all" ? cards : cards.filter((card) => card.kind === filter);
  const availableFilters = filters.filter((option) => option === "all" || cards.some((card) => card.kind === option));

  return (
    <section className="panel gallery-panel" aria-labelledby="gallery-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Tocá una carta</p>
          <h2 id="gallery-title">Cartas del juego</h2>
        </div>
        <div className="filters" aria-label="Filtros de cartas">
          {availableFilters.map((option) => (
            <button className={filter === option ? "active" : ""} type="button" key={option} onClick={() => onFilterChange(option)}>
              {option === "all" ? "Todas" : kindLabel(option)}
            </button>
          ))}
        </div>
      </div>
      <div className="card-grid">
        {filteredCards.map((card) => (
          <CardFace card={card} cardPrintOptions={cardPrintOptions} key={card.id} selected={card.id === selectedCardId} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

export type { Filter };
