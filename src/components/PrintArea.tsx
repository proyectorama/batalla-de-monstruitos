import type { Card } from "../types/cards";
import { chunkCards } from "../utils/cards";
import { CardFace } from "./CardFace";

type PrintAreaProps = {
  cards: Card[];
};

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
              <div className="board-zone active-zone">Monstruo activo</div>
              <div className="board-zone bench-zone">Espera 1</div>
              <div className="board-zone bench-zone">Espera 2</div>
              <div className="board-zone deck-zone">Mazo</div>
              <div className="board-zone discard-zone">Descarte</div>
              <div className="board-zone points-zone">Puntos: 0  1  2  3</div>
            </div>
            <footer>
              <span>1 Roba</span>
              <span>2 Baja monstruo</span>
              <span>3 Juega 1 mejora</span>
              <span>4 Ataca</span>
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
              <li>Pone 1 monstruo como activo. Puedes tener hasta 2 monstruos en espera.</li>
            </ol>
          </section>
          <section>
            <h2>Turno</h2>
            <ol>
              <li>Roba 1 carta.</li>
              <li>Puedes bajar 1 monstruo a la espera si tienes lugar.</li>
              <li>Puedes jugar 1 mejora sobre un monstruo tuyo.</li>
              <li>Ataca con tu monstruo activo.</li>
              <li>Pasa el turno.</li>
            </ol>
          </section>
          <section>
            <h2>Mejoras</h2>
            <p>Cada monstruo puede tener como maximo 2 mejoras. Las mejoras quedan sobre el monstruo. Si el monstruo es derrotado, sus mejoras tambien van al descarte.</p>
          </section>
          <section>
            <h2>Combate</h2>
            <p><b>Dano = ataque del atacante - defensa del defensor.</b> Si el resultado es 0 o menos, igual hace 1 dano.</p>
            <div className="print-combat-examples">
              <p>✦ 5 - ⬟ 2 = 3 dano. Pierde 3 corazones.</p>
              <p>✦ 3 - ⬟ 3 = 0, pero el minimo es 1. Pierde 1 corazon.</p>
              <p>✦ 2 - ⬟ 5 = -3, pero el minimo es 1. Pierde 1 corazon.</p>
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
