import type { Card } from "../types/cards";
import { chunkCards } from "../utils/cards";
import { CardFace } from "./CardFace";
import { StatIcon } from "./StatIcon";

type PrintAreaProps = {
  cards: Card[];
  player: number;
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
          {boostSlots.map((boostSlot) => <div className="boost-slot life-slot" key={`life-${slot}-${boostSlot}`}><StatIcon stat="life" /> Vida</div>)}
        </div>
        <div className="monster-card-zone">Carta</div>
        <div className="defense-stack" aria-label="Mejoras de defensa">
          {boostSlots.map((boostSlot) => <div className="boost-slot defense-slot" key={`defense-${slot}-${boostSlot}`}><StatIcon stat="defense" /> Defensa</div>)}
        </div>
      </div>
    </div>
  );
}

function TokenPage({ stat, title, copy }: { stat: "life" | "attack" | "defense"; title: string; copy: string }) {
  const tokens = Array.from({ length: 160 }, (_, index) => index + 1);

  return (
    <div className={`tokens-page ${stat}-tokens-page`}>
      <h1>{title}</h1>
      <p>{copy}</p>
      <div className="tokens-grid">
        {tokens.map((token) => (
          <div className={`life-token stat-token stat-token-${stat}`} key={token}><StatIcon stat={stat} /></div>
        ))}
      </div>
    </div>
  );
}

export function PrintArea({ cards, player }: PrintAreaProps) {
  const pages = chunkCards(cards, 15);
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
        <div className={`back-pattern-page player-${player}`} aria-label="Dorso continuo" />
      </div>

      <div className="print-boards">
        <div className={`board-page player-${player}`} key={`board-${player}`}>
          <header>
            <span>Tablero</span>
            <div className="player-life-track" aria-label="Vida del jugador">
              {playerLife.map((life) => <span key={`player-life-${life}`}>♡</span>)}
            </div>
          </header>
          <div className="board-layout">
            {monsterSlots.map((slot) => <MonsterBoardStation slot={slot} key={`station-${player}-${slot}`} />)}
            <div className="board-zone deck-zone">Mazo</div>
            <div className="board-zone discard-zone">Descarte</div>
          </div>
        </div>
      </div>

      <div className="print-rules">
        <div className="rules-page">
          <h1>Reglas de Monstruitos Batalla</h1>
          <section>
            <h2>Objetivo</h2>
            <p>Cada jugador empieza con 20 vidas. Gana quien deja al rival en 0 vidas.</p>
          </section>
          <section>
            <h2>Preparacion</h2>
            <ol>
              <li>Cada jugador usa el mismo mazo. El numero de jugador solo cambia los colores del dorso.</li>
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
            <p>Cada monstruo puede tener hasta 3 mejoras de vida, 3 de ataque y 3 de defensa. Si el monstruo es derrotado, sus mejoras tambien van al descarte.</p>
            <p>Los escudos y espadas del tablero son una ayuda para sumar rapido: pon tantos escudos como defensa total y tantas espadas como ataque total tenga el monstruo con sus mejoras.</p>
          </section>
          <section>
            <h2>Combate</h2>
            <p><b>Dano = ataque del atacante - defensa del defensor.</b> Si el resultado es 0 o menos, igual hace 1 dano.</p>
            <div className="print-combat-examples">
              <p>5 espadas - 2 escudos = 3 dano. Pierde 3 corazones.</p>
              <p>3 espadas - 3 escudos = 0, pero el minimo es 1. Pierde 1 corazon.</p>
              <p>2 espadas - 5 escudos = -3, pero el minimo es 1. Pierde 1 corazon.</p>
              <p>Si el rival tiene 3 monstruos, elige a cual atacar antes de calcular el dano.</p>
              <p>Si un jugador se queda sin monstruos para defenderse, el dano baja directamente de sus 20 vidas.</p>
            </div>
          </section>
          <section>
            <h2>Iconos</h2>
            <p><b>♥ Vida</b> son los corazones que tiene el monstruo. <b>Espadas</b> son la fuerza para atacar. <b>Escudos</b> reducen el dano recibido.</p>
          </section>
        </div>
      </div>

      <div className="print-tokens">
        <TokenPage stat="life" title="Fichas de vida" copy="Recorta los cuadrados. Cada corazon vale 1 vida." />
      </div>

      <div className="print-shields">
        <TokenPage stat="defense" title="Fichas de escudo" copy="Recorta los cuadrados. Usalos para marcar la defensa total del monstruo." />
      </div>

      <div className="print-swords">
        <TokenPage stat="attack" title="Fichas de espada" copy="Recorta los cuadrados. Usalos para marcar el ataque total del monstruo." />
      </div>
    </section>
  );
}
