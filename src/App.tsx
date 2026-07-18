import { useEffect, useState } from "react";
import packageJson from "../package.json";
import { CardDetail } from "./components/CardDetail";
import { CardGallery, type Filter } from "./components/CardGallery";
import { GameSimulator } from "./components/GameSimulator";
import { ExpansionSelector } from "./components/ExpansionSelector";
import { PrintArea } from "./components/PrintArea";
import { RulesPanel } from "./components/RulesPanel";
import { cards, countsForCards } from "./data/deck";
import type { Card } from "./types/cards";
import {
  defaultCardSizeHeight,
  defaultCardSizeWidth,
  spanishSizeHeight,
  spanishSizeWidth,
  type BoardPrintOptions,
  type CardPrintOptions,
  type CardSizeMode,
  type PrintMode,
} from "./types/print";

type AppTab = "cards" | "simulator";
type AdventureMode = "classic" | "creative";

const getInitialCard = (): Card => {
  const firstCard = cards[0];

  if (!firstCard) {
    throw new Error("El mazo no tiene cartas cargadas");
  }

  return firstCard;
};

export function App() {
  const [selectedCard, setSelectedCard] = useState<Card>(getInitialCard);
  const [modalCard, setModalCard] = useState<Card | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeTab, setActiveTab] = useState<AppTab>("cards");
  const [adventureMode, setAdventureMode] = useState<AdventureMode>("classic");
  const [printCards, setPrintCards] = useState<Card[]>(cards);
  const [hideCardTitleAndArt, setHideCardTitleAndArt] = useState(false);
  const [showStatIconsOnly, setShowStatIconsOnly] = useState(false);
  const [hideBoostValues, setHideBoostValues] = useState(false);
  const [cardSizeMode, setCardSizeMode] = useState<CardSizeMode>("spanish");
  const [printBoardA3, setPrintBoardA3] = useState(false);

  const cardPrintOptions: CardPrintOptions = {
    hideTitleAndArt: hideCardTitleAndArt,
    showStatIconsOnly,
    hideBoostValues,
    width: cardSizeMode === "spanish" ? spanishSizeWidth : defaultCardSizeWidth,
    height: cardSizeMode === "spanish" ? spanishSizeHeight : defaultCardSizeHeight,
  };

  const boardPrintOptions: BoardPrintOptions = {
    size: printBoardA3 ? "A3" : "A4",
  };

  const cardCounts = countsForCards(cards);

  useEffect(() => {
    setModalCard(null);
  }, [adventureMode]);

  const handleAdventureModeChange = (mode: AdventureMode) => {
    setAdventureMode(mode);
    setHideCardTitleAndArt(mode === "creative");
    setShowStatIconsOnly(mode === "creative");
    setHideBoostValues(mode === "creative");
    setCardSizeMode("spanish");
  };

  const handlePrint = (mode: PrintMode) => {
    document.body.dataset.printMode = mode;
    document.body.dataset.boardPrintSize = boardPrintOptions.size;
    window.setTimeout(() => window.print(), 0);
  };

  const handlePrintCards = (cardsToPrint: Card[]) => {
    setPrintCards(cardsToPrint);
    window.setTimeout(() => handlePrint("cards"), 0);
  };

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);

    if (window.matchMedia("(max-width: 980px)").matches) {
      setModalCard(card);
    }
  };

  const cardsDownloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(cards, null, 2))}`;

  return (
    <>
      <main className="app-shell">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Juego de cartas imprimible</p>
            <h1>Batalla de monstruitos</h1>
            <p>
              Jugá con el mazo clásico de 50 cartas: 12 monstruos, 27 mejoras y 11 poderes especiales. También podés crear tus propios monstruos en modo creativo.
            </p>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => handlePrintCards(cards)}>Imprimir mazo actual ({cardCounts.total})</button>
              <button type="button" onClick={() => handlePrint("backs")}>Imprimir dorsos</button>
              <button type="button" onClick={() => handlePrint("boards")}>Imprimir tablero</button>
              <button type="button" onClick={() => handlePrint("rules")}>Imprimir reglas</button>
              <button type="button" onClick={() => handlePrint("consumables")}>Imprimir consumibles</button>
              <a href={cardsDownloadHref} download={`batalla-de-monstruitos-clasico-${cardCounts.total}.json`}>Descargar JSON</a>
              <details className="print-options">
                <summary className="print-options-summary">
                  <span>
                    <strong>Personalizar impresión</strong>
                    <small>Elegí qué mostrar en las cartas y el formato antes de imprimir.</small>
                  </span>
                  <span className="print-options-chevron" aria-hidden="true" />
                </summary>
                <div className="print-options-body">
                  <label className="print-option-switch">
                    <input type="checkbox" checked={hideCardTitleAndArt} onChange={(event) => setHideCardTitleAndArt(event.target.checked)} />
                    <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
                    <span className="switch-copy">
                      <strong>Sin título y dibujo</strong>
                      <small>Deja las cartas listas para completar o pegar dibujo propio.</small>
                    </span>
                  </label>
                  <label className="print-option-switch">
                    <input type="checkbox" checked={showStatIconsOnly} onChange={(event) => setShowStatIconsOnly(event.target.checked)} />
                    <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
                    <span className="switch-copy">
                      <strong>Cartas sin números de vida, defensa y ataque</strong>
                      <small>Deja los iconos y vacía los valores para escribir números propios a mano.</small>
                    </span>
                  </label>
                  <label className="print-option-switch">
                    <input type="checkbox" checked={hideBoostValues} onChange={(event) => setHideBoostValues(event.target.checked)} />
                    <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
                    <span className="switch-copy">
                      <strong>Mejoras sin números</strong>
                      <small>Conserva el signo + y deja el valor listo para completar a mano.</small>
                    </span>
                  </label>
                  <fieldset className="card-size-options">
                    <legend>Formato de cartas</legend>
                    <label><input type="radio" name="card-size-print" checked={cardSizeMode === "spanish"} onChange={() => setCardSizeMode("spanish")} /> Cartas españolas (57 × 92 mm)</label>
                    <label><input type="radio" name="card-size-print" checked={cardSizeMode === "max-per-sheet"} onChange={() => setCardSizeMode("max-per-sheet")} /> Máxima cantidad por hoja (57 × 66 mm)</label>
                  </fieldset>
                  <label className="print-option-switch">
                    <input type="checkbox" checked={printBoardA3} onChange={(event) => setPrintBoardA3(event.target.checked)} />
                    <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
                    <span className="switch-copy">
                      <strong>Tablero A3</strong>
                      <small>Imprime el tablero más grande; elegí A3 horizontal si el diálogo lo pide</small>
                    </span>
                  </label>
                </div>
              </details>
            </div>
          </div>
          <div className="deck-summary" aria-label="Resumen del mazo">
            <div><strong>{cardCounts.total}</strong><span>cartas por jugador</span></div>
            <div><strong>{cardCounts.monsters}</strong><span>monstruos</span></div>
            <div><strong>{cardCounts.boosts}</strong><span>mejoras</span></div>
            <div><strong>{cardCounts.specials}</strong><span>especiales</span></div>
          </div>
        </section>

        <ExpansionSelector
          mode={adventureMode}
          onChange={handleAdventureModeChange}
          hideTitleAndArt={hideCardTitleAndArt}
          showStatIconsOnly={showStatIconsOnly}
          hideBoostValues={hideBoostValues}
          cardSizeMode={cardSizeMode}
          onHideTitleAndArtChange={setHideCardTitleAndArt}
          onShowStatIconsOnlyChange={setShowStatIconsOnly}
          onHideBoostValuesChange={setHideBoostValues}
          onCardSizeModeChange={setCardSizeMode}
        />

        <nav className="app-tabs" aria-label="Secciones del juego">
          <button className={activeTab === "cards" ? "active" : ""} type="button" onClick={() => setActiveTab("cards")}>Cartas y reglas</button>
          <button className={activeTab === "simulator" ? "active" : ""} type="button" onClick={() => setActiveTab("simulator")}>Simulador</button>
        </nav>

        {activeTab === "cards" ? (
          <>
            <RulesPanel />

            <section className="workspace">
              <CardGallery cards={cards} selectedCardId={selectedCard.id} filter={filter} onFilterChange={setFilter} onSelect={handleSelectCard} cardPrintOptions={cardPrintOptions} />
              <CardDetail card={selectedCard} cardPrintOptions={cardPrintOptions} />
            </section>

            {modalCard ? (
              <div className="mobile-card-modal" role="dialog" aria-modal="true" aria-labelledby="mobile-detail-title" onClick={() => setModalCard(null)}>
                <div className="mobile-card-modal-content" onClick={(event) => event.stopPropagation()}>
                  <button className="modal-close" type="button" aria-label="Cerrar carta" onClick={() => setModalCard(null)}>Cerrar</button>
                  <CardDetail card={modalCard} titleId="mobile-detail-title" cardPrintOptions={cardPrintOptions} />
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <GameSimulator cards={cards} />
        )}

        <footer className="app-footer">Versión {packageJson.version}</footer>
      </main>

      <PrintArea cards={printCards} cardPrintOptions={cardPrintOptions} boardPrintOptions={boardPrintOptions} />
    </>
  );
}
