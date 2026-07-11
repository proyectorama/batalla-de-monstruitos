import { cardCounts } from "../data/deck";
import { StatIcon } from "./StatIcon";

export function RulesPanel() {
  return (
    <section className="rules panel" aria-labelledby="rules-title">
      <p className="eyebrow">Reglas claras</p>
      <h2 id="rules-title">Como se juega</h2>
      <div className="rules-grid">
        <div>
          <h3>1. Objetivo</h3>
          <p>Cada jugador empieza con 20 vidas. Gana quien deja al rival en 0 vidas.</p>
        </div>
        <div>
          <h3>2. Preparacion</h3>
          <p>Son {cardCounts.total} cartas. Cada jugador roba 5 y puede tener hasta 3 monstruos en juego.</p>
        </div>
        <div>
          <h3>3. Turno</h3>
          <p>Roba 1, baja 1 monstruo, juega mejoras y atacan tus 3 monstruos, uno por uno.</p>
        </div>
        <div>
          <h3>4. Mejoras</h3>
          <p>Cada monstruo puede tener 3 de vida, 3 de ataque y 3 de defensa. Usa espadas y escudos para sumar facil.</p>
        </div>
      </div>
      <div className="icon-rules" aria-label="Iconos de las cartas">
        <span><b className="icon life-icon">♥</b> Vida</span>
        <span><b className="icon attack-icon"><StatIcon stat="attack" /></b> Ataque</span>
        <span><b className="icon defense-icon"><StatIcon stat="defense" /></b> Defensa</span>
      </div>
      <div className="combat-examples">
        <h3>Ejemplos de combate</h3>
        <p><b>5 espadas - 2 escudos = 3 dano.</b> El defensor pierde 3 vidas.</p>
        <p><b>3 espadas - 3 escudos = 0.</b> Como el minimo es 1, pierde 1 vida.</p>
        <p><b>2 espadas - 5 escudos = -3.</b> Como el minimo es 1, pierde 1 vida.</p>
        <p><b>Atacan los 3.</b> Cada monstruo tuyo elige a cual rival atacar.</p>
        <p><b>Sin monstruos.</b> Si no tienes monstruos para defenderte, el dano baja de tus 20 vidas.</p>
      </div>
    </section>
  );
}
