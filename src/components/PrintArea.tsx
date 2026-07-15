import type { CSSProperties } from "react";
import type { Card } from "../types/cards";
import { expansionById, type DeckMode } from "../data/deck";
import { spanishSizeHeight, spanishSizeWidth, type BoardPrintOptions, type CardPrintOptions } from "../types/print";
import { chunkCards } from "../utils/cards";
import { CardFace } from "./CardFace";
import { StatIcon } from "./StatIcon";

type PrintAreaProps = {
  cards: Card[];
  cardPrintOptions: CardPrintOptions;
  boardPrintOptions: BoardPrintOptions;
  deckMode: DeckMode;
};

const monsterSlots = [1, 2, 3];
const boostSlots = [1, 2, 3];
const playerLife = Array.from({ length: 20 }, (_, index) => index + 1);
const totalSlots = Array.from({ length: 5 }, (_, index) => index + 1);

function TotalTrack({ stat, label, slot }: { stat: "attack" | "defense"; label: string; slot: number }) {
  return (
    <div className={`total-track ${stat}-total-track`} aria-label={label}>
      {totalSlots.map((trackSlot) => (
        <span key={`${stat}-${slot}-${trackSlot}`}><StatIcon stat={stat} /></span>
      ))}
    </div>
  );
}

function MonsterBoardStation({ slot }: { slot: number }) {
  return (
    <div className="monster-station">
      <div className="heart-track" aria-label="Contador de vida">
        {Array.from({ length: 5 }, (_, index) => <span key={`heart-${slot}-${index}`}>♡</span>)}
      </div>
      <TotalTrack stat="defense" label="Suma de escudos" slot={slot} />
      <TotalTrack stat="attack" label="Suma de espadas" slot={slot} />
      <div className="attack-stack" aria-label="Mejoras de ataque">
        {boostSlots.map((boostSlot) => <div className="boost-slot attack-slot" key={`attack-${slot}-${boostSlot}`}><StatIcon stat="attack" /> Ataque</div>)}
      </div>
      <div className="station-core">
        <div className="life-stack" aria-label="Mejoras de vida">
          {boostSlots.map((boostSlot) => <div className="boost-slot life-slot" key={`life-${slot}-${boostSlot}`}><StatIcon stat="life" /><span>Vida</span></div>)}
        </div>
        <div className="monster-card-zone">Carta</div>
        <div className="defense-stack" aria-label="Mejoras de defensa">
          {boostSlots.map((boostSlot) => <div className="boost-slot defense-slot" key={`defense-${slot}-${boostSlot}`}><StatIcon stat="defense" /><span>Defensa</span></div>)}
        </div>
      </div>
    </div>
  );
}

const consumables = [
  ...Array.from({ length: 80 }, (_, index) => ({ stat: "life" as const, id: `life-${index + 1}` })),
  ...Array.from({ length: 40 }, (_, index) => ({ stat: "attack" as const, id: `attack-${index + 1}` })),
  ...Array.from({ length: 40 }, (_, index) => ({ stat: "defense" as const, id: `defense-${index + 1}` })),
];

function ConsumablesPage() {
  return (
    <div className="tokens-page consumables-page">
      <h1>Consumibles</h1>
      <p>80 corazones de vida, 40 espadas de ataque y 40 escudos de defensa.</p>
      <div className="tokens-grid">
        {consumables.map((token) => (
          <div className={`life-token stat-token stat-token-${token.stat}`} key={token.id}><StatIcon stat={token.stat} /></div>
        ))}
      </div>
    </div>
  );
}

export function PrintArea({ cards, cardPrintOptions, boardPrintOptions, deckMode }: PrintAreaProps) {
  const pageWidth = 297;
  const pageHeight = 210;
  const columns = Math.floor(pageWidth / cardPrintOptions.width);
  const rows = Math.floor(pageHeight / cardPrintOptions.height);
  const cardsPerPage = columns * rows;
  const printedCardsWidth = columns * cardPrintOptions.width;
  const printedCardsHeight = rows * cardPrintOptions.height;
  const cardPageStyle = {
    "--card-print-width": `${cardPrintOptions.width}mm`,
    "--card-print-height": `${cardPrintOptions.height}mm`,
    "--card-print-columns": columns,
    "--card-print-rows": rows,
    "--printed-cards-width": `${printedCardsWidth}mm`,
    "--printed-cards-height": `${printedCardsHeight}mm`,
  } as CSSProperties;
  const usesSpanishCardSize = cardPrintOptions.width === spanishSizeWidth && cardPrintOptions.height === spanishSizeHeight;
  const boardCardWidth = usesSpanishCardSize || boardPrintOptions.size === "A3" ? cardPrintOptions.width : 53;
  const boardCardHeight = usesSpanishCardSize ? cardPrintOptions.height : boardPrintOptions.size === "A3" ? 66 : 60;
  const boardPageStyle = {
    "--board-card-width": `${boardCardWidth}mm`,
    "--board-card-height": `${boardCardHeight}mm`,
    "--board-side-boost-width": `${usesSpanishCardSize ? 6.8 : 7.2}mm`,
  } as CSSProperties;
  const pages = chunkCards(cards, cardsPerPage);
  const expansion = deckMode === "base" ? null : expansionById[deckMode];
  return (
    <section className="print-area" aria-label="Hojas listas para imprimir" data-board-size={boardPrintOptions.size} data-spanish-card-size={usesSpanishCardSize}>
      <div className="print-cards">
        {pages.map((pageCards, pageIndex) => (
          <div className="print-page card-print-page" style={cardPageStyle} key={`page-${pageIndex + 1}`}>
            {pageCards.map((card) => (
              <CardFace card={card} cardPrintOptions={cardPrintOptions} key={card.id} />
            ))}
          </div>
        ))}
      </div>

      <div className="print-backs">
        <div className="back-pattern-page" aria-label="Dorso continuo" />
      </div>

      <div className="print-boards">
        <div className="board-page" style={boardPageStyle}>
          <header>
            <span>Tablero</span>
            <div className="player-life-track" aria-label="Vida del jugador">
              {playerLife.map((life) => <span key={`player-life-${life}`}>♡</span>)}
            </div>
          </header>
          <div className="board-layout">
            {monsterSlots.map((slot) => <MonsterBoardStation slot={slot} key={`station-${slot}`} />)}
          </div>
        </div>
      </div>

      <div className="print-rules">
        <div className={`rules-page ${expansion ? "expanded-rules-page" : ""}`}>
          <h1>Reglas de Batalla de monstruitos {expansion ? `· ${expansion.name}` : ""}</h1>
          <div className="rules-columns">
            <div>
              <section>
                <h2>Objetivo</h2>
                <p>Cada jugador empieza con 20 vidas. Gana quien deja al rival en 0 vidas.</p>
              </section>
              <section>
                <h2>Preparacion</h2>
                <ol>
                  <li>Cada jugador imprime y usa su propia copia del mazo de {expansion ? 50 : 45} cartas.</li>
                  {expansion ? <li>Retira Bubu, Fafa, Gugu, Nono, Luli y Boni del mazo base y agrega las 11 cartas especiales.</li> : null}
                  <li>Cada jugador mezcla su mazo y roba 5 cartas.</li>
                  <li>Si no robaste monstruos, muestra la mano, mezcla y roba 5 otra vez.</li>
                  <li>Pone hasta 3 monstruos en juego. Si no tienes 3, puedes bajar mas en tus turnos.</li>
                </ol>
              </section>
              <section>
                <h2>Turno</h2>
                <ol>
                  <li>Roba 1 carta.</li>
                  <li>Puedes bajar 1 monstruo si tienes menos de 3 en juego.</li>
                  <li>Puedes jugar mejoras sobre tus monstruos.</li>
                  {expansion ? <li>Puedes jugar 1 especial, resolver su efecto y mandarla al descarte.</li> : null}
                  <li>Atacan tus 3 monstruos, uno por uno.</li>
                  <li>Cada atacante elige cualquiera de los monstruos rivales como objetivo.</li>
                  <li>Los escudos gastados se reponen al terminar el turno.</li>
                  <li>Pasa el turno.</li>
                </ol>
              </section>
              <section>
                <h2>Iconos</h2>
                <p><b>♥ Vida</b> son los corazones que tiene el monstruo. <b>Espadas</b> son la fuerza para atacar. <b>Escudos</b> reducen el dano recibido.</p>
              </section>
            </div>
            <div>
              <section>
                <h2>Mejoras</h2>
                <p>Cada monstruo puede tener hasta 3 mejoras de vida, 3 de ataque y 3 de defensa. Si el monstruo es derrotado, sus mejoras tambien van al descarte.</p>
                <p>Los escudos y espadas del tablero son una ayuda para sumar rapido: pon tantos escudos como defensa total y tantas espadas como ataque total tenga el monstruo con sus mejoras.</p>
              </section>
              <section>
                <h2>Combate</h2>
                <p><b>Dano = ataque del atacante - escudos disponibles del defensor.</b> Cada escudo bloquea 1 punto de ataque y se retira durante el turno. Todos se reponen al terminar el turno.</p>
                <div className="print-combat-examples">
                  <p>5 espadas - 2 escudos = 3 dano. Pierde 3 corazones.</p>
                  <p>3 espadas - 3 escudos = 0 dano. No pierde corazones y gasta sus 3 escudos.</p>
                  <p>Si M1 rompe el escudo de M2, un ataque posterior de M3 a M2 ya no descuenta ese escudo.</p>
                  <p>Si el rival tiene 3 monstruos, elige a cual atacar antes de calcular el dano.</p>
                  <p>Si un jugador se queda sin monstruos para defenderse, el dano baja directamente de sus 20 vidas.</p>
                </div>
              </section>
              {expansion ? (
                <section>
                  <h2>Cartas especiales</h2>
                  <p>Se juega como maximo 1 por turno, despues de monstruos y mejoras y antes de atacar. Debe tener un objetivo valido.</p>
                  <p><b>Dano verdadero:</b> quita vida sin restar defensa. <b>Curacion:</b> recupera vida sin superar el maximo. <b>Red:</b> el monstruo elegido pierde su proximo ataque y las redes no se acumulan.</p>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="print-consumables">
        <ConsumablesPage />
      </div>
    </section>
  );
}
