import type { Card } from "../types/cards";
import { chunkCards } from "../utils/cards";
import { CardFace } from "./CardFace";

type PrintAreaProps = {
  cards: Card[];
};

const monsterSlots = [1, 2, 3];
const boostSlots = [1, 2, 3];

function MonsterBoardStation({ slot }: { slot: number }) {
  return (
    <div className="monster-station">
      <div className="station-title">Monstruo {slot}</div>
      <div className="attack-slots" aria-label="Mejoras de ataque">
        {boostSlots.map((boostSlot) => <div className="boost-slot attack-slot" key={`attack-${slot}-${boostSlot}`}>✦</div>)}
      </div>
      <div className="station-core">
        <div className="life-slots" aria-label="Mejoras de vida">
          {boostSlots.map((boostSlot) => <div className="boost-slot life-slot" key={`life-${slot}-${boostSlot}`}>♥</div>)}
        </div>
        <div className="monster-card-zone">Carta</div>
        <div className="defense-slots" aria-label="Mejoras de defensa">
          {boostSlots.map((boostSlot) => <div className="boost-slot defense-slot" key={`defense-${slot}-${boostSlot}`}>⬟</div>)}
        </div>
      </div>
    </div>
  );
}

export function PrintArea({ cards }: PrintAreaProps) {
  const pages = chunkCards(cards, 15);
  const lifeTokens = Array.from({ length: 80 }, (_, index) => index + 1);

  return (
    <section className="print-area" aria-label="Hojas listas para imprimir">
      <div className="print-cards">
        {pages.map((pageCards, pageIndex) => (
          <div className="print-page card-print-page" key={`page-${pageIndex + 1}`}>
            {pageCards.map((card) => (
              <CardFace card={card} key={card.id} />
            ))}
          </div>
        ))}
      </div>

      <div className="print-backs">
        {pages.map((pageCards, pageIndex) => (
          <div className="print-page card-back-page" key={`backs-${pageIndex + 1}`}>
            {pageCards.map((card) => (
              <div className={`card-back team-${card.deck}`} key={`back-${card.id}`}>
                <div className="back-circle">
                  <span>Equipo</span>
                  <strong>{card.deck}</strong>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="print-boards">
        {[1, 2].map((player) => (
          <div className="board-page" key={`board-${player}`}>
            <header>
              <span>Tablero</span>
              <strong>Jugador {player}</strong>
            </header>
            <div className="board-layout">
              {monsterSlots.map((slot) => <MonsterBoardStation slot={slot} key={`station-${player}-${slot}`} />)}
              <div className="board-zone deck-zone">Mazo</div>
              <div className="board-zone discard-zone">Descarte</div>
              <div className="board-zone points-zone">Puntos: 0  1  2  3</div>
            </div>
            <footer>
              <span>1 Roba</span>
              <span>2 Baja monstruo</span>
              <span>3 Juega mejoras</span>
              <span>4 Atacan 3</span>
              <span>5 Pasa turno</span>
            </footer>
          </div>
        ))}
      </div>

      <div className="print-rules">
        <div className="rules-page">
          <h1>Reglas de Monstruitos Batalla</h1>
          <section>
            <h2>Objetivo</h2>
            <p>Gana quien derrota 3 monstruos del rival. Un monstruo es derrotado cuando su vida llega a 0.</p>
          </section>
          <section>
            <h2>Preparacion</h2>
            <ol>
              <li>Cada jugador usa su equipo de 30 cartas: equipo 1 o equipo 2.</li>
              <li>Mezcla el mazo y roba 5 cartas.</li>
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
              <li>Atacan tus 3 monstruos, uno por uno.</li>
              <li>Cada atacante elige cualquiera de los monstruos rivales como objetivo.</li>
              <li>Pasa el turno.</li>
            </ol>
          </section>
          <section>
            <h2>Mejoras</h2>
            <p>Cada monstruo puede tener hasta 3 mejoras de vida a la izquierda, 3 de ataque arriba y 3 de defensa a la derecha. Si el monstruo es derrotado, sus mejoras tambien van al descarte.</p>
          </section>
          <section>
            <h2>Combate</h2>
            <p><b>Dano = ataque del atacante - defensa del defensor.</b> Si el resultado es 0 o menos, igual hace 1 dano.</p>
            <div className="print-combat-examples">
              <p>✦ 5 - ⬟ 2 = 3 dano. Pierde 3 corazones.</p>
              <p>✦ 3 - ⬟ 3 = 0, pero el minimo es 1. Pierde 1 corazon.</p>
              <p>✦ 2 - ⬟ 5 = -3, pero el minimo es 1. Pierde 1 corazon.</p>
              <p>Si el rival tiene 3 monstruos, elige a cual atacar antes de calcular el dano.</p>
            </div>
          </section>
          <section>
            <h2>Iconos</h2>
            <p><b>♥ Vida</b> son los corazones que tiene el monstruo. <b>✦ Ataque</b> es la fuerza para atacar. <b>⬟ Defensa</b> reduce el dano recibido.</p>
          </section>
        </div>
      </div>

      <div className="print-tokens">
        <div className="tokens-page">
          <h1>Fichas de vida</h1>
          <p>Recorta los cuadrados. Cada corazon vale 1 vida.</p>
          <div className="tokens-grid">
            {lifeTokens.map((token) => (
              <div className="life-token" key={token}>♥</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
