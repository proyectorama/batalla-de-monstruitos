import { useState } from "react";
import { CardDetail } from "./components/CardDetail";
import { CardGallery, type Filter } from "./components/CardGallery";
import { GameSimulator } from "./components/GameSimulator";
import { PrintArea } from "./components/PrintArea";
import { RulesPanel } from "./components/RulesPanel";
import { cardCounts, cards, deckOne, deckTwo } from "./data/deck";
import type { Card } from "./types/cards";
import type { PrintMode } from "./types/print";

type AppTab = "cards" | "simulator";

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
  const [activeTab, setActiveTab] = useState<AppTab>("cards");
  const [printPlayer, setPrintPlayer] = useState(1);

  const handlePrint = (mode: PrintMode) => {
    document.body.dataset.printMode = mode;
    window.setTimeout(() => window.print(), 0);
  };

  const handlePrintPlayerChange = (value: string) => {
    const nextPlayer = Number(value);

    setPrintPlayer(Number.isFinite(nextPlayer) && nextPlayer > 0 ? Math.floor(nextPlayer) : 1);
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
              <label className="print-player-field">
                <span>Trama jugador</span>
                <input min="1" step="1" type="number" value={printPlayer} onChange={(event) => handlePrintPlayerChange(event.target.value)} />
              </label>
              <button className="primary-action" type="button" onClick={() => handlePrint("cards")}>Imprimir cartas</button>
              <button type="button" onClick={() => handlePrint("backs")}>Imprimir dorsos</button>
              <button type="button" onClick={() => handlePrint("boards")}>Imprimir tablero</button>
              <button type="button" onClick={() => handlePrint("rules")}>Imprimir reglas</button>
              <button type="button" onClick={() => handlePrint("tokens")}>Imprimir corazones</button>
              <button type="button" onClick={() => handlePrint("shields")}>Imprimir escudos</button>
              <button type="button" onClick={() => handlePrint("swords")}>Imprimir espadas</button>
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

        <nav className="app-tabs" aria-label="Secciones del juego">
          <button className={activeTab === "cards" ? "active" : ""} type="button" onClick={() => setActiveTab("cards")}>Cartas y reglas</button>
          <button className={activeTab === "simulator" ? "active" : ""} type="button" onClick={() => setActiveTab("simulator")}>Simulador</button>
        </nav>

        {activeTab === "cards" ? (
          <>
            <RulesPanel />

            <section className="workspace">
              <CardGallery cards={cards} selectedCardId={selectedCard.id} filter={filter} onFilterChange={setFilter} onSelect={setSelectedCard} />
              <CardDetail card={selectedCard} />
            </section>
          </>
        ) : (
          <GameSimulator />
        )}
      </main>

      <PrintArea cards={cards} player={printPlayer} />
    </>
  );
}
