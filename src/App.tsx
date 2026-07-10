import { useState } from "react";
import { CardDetail } from "./components/CardDetail";
import { CardGallery, type Filter } from "./components/CardGallery";
import { PrintArea } from "./components/PrintArea";
import { RulesPanel } from "./components/RulesPanel";
import { cardCounts, cards, deckOne, deckTwo } from "./data/deck";
import type { Card } from "./types/cards";
import type { PrintMode } from "./types/print";

const getInitialCard = (): Card => {
  const firstCard = cards[0];

  if (!firstCard) {
    throw new Error("El mazo no tiene cartas cargadas");
  }

  return firstCard;
};

export function App() {
  const [selectedCard, setSelectedCard] = useState<Card>(getInitialCard);
  const [filter, setFilter] = useState<Filter>("all");

  const handlePrint = (mode: PrintMode) => {
    document.body.dataset.printMode = mode;
    window.setTimeout(() => window.print(), 0);
  };
  const cardsDownloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(cards, null, 2))}`;

  return (
    <>
      <main className="app-shell">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Mazo imprimible para 2 jugadores</p>
            <h1>Monstruitos Batalla</h1>
            <p>
              Un juego de cartas tipo Pokemon/Magic, simplificado para chicos: monstruos tiernos, mejoras grandes y reglas con numeros faciles de contar.
            </p>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => handlePrint("cards")}>Imprimir cartas</button>
              <button type="button" onClick={() => handlePrint("boards")}>Imprimir tablero</button>
              <button type="button" onClick={() => handlePrint("rules")}>Imprimir reglas</button>
              <button type="button" onClick={() => handlePrint("tokens")}>Imprimir corazones</button>
              <a href={cardsDownloadHref} download="monstruitos-batalla-cards.json">Descargar JSON</a>
            </div>
          </div>
          <div className="deck-summary" aria-label="Resumen del mazo">
            <div><strong>{cardCounts.total}</strong><span>cartas</span></div>
            <div><strong>{cardCounts.monsters}</strong><span>monstruos</span></div>
            <div><strong>1</strong><span>{deckOne.length} cartas</span></div>
            <div><strong>2</strong><span>{deckTwo.length} cartas</span></div>
          </div>
        </section>

        <RulesPanel />

        <section className="workspace">
          <CardGallery cards={cards} selectedCardId={selectedCard.id} filter={filter} onFilterChange={setFilter} onSelect={setSelectedCard} />
          <CardDetail card={selectedCard} />
        </section>
      </main>

      <PrintArea cards={cards} />
    </>
  );
}
