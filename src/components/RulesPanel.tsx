import { cardCounts } from "../data/deck";

export function RulesPanel() {
  return (
    <section className="rules panel" aria-labelledby="rules-title">
      <p className="eyebrow">Reglas claras</p>
      <h2 id="rules-title">Como se juega</h2>
      <div className="rules-grid">
        <div>
          <h3>1. Objetivo</h3>
          <p>Derrota 3 monstruos del rival. Cada monstruo que queda con 0 vida da 1 punto.</p>
        </div>
        <div>
          <h3>2. Preparacion</h3>
          <p>Son {cardCounts.total} cartas. Cada jugador roba 5 y puede tener hasta 3 monstruos en juego.</p>
        </div>
        <div>
          <h3>3. Turno</h3>
          <p>Roba 1, baja 1 monstruo, juega 1 mejora y elige 1 monstruo tuyo para atacar a cualquiera de los 3 rivales.</p>
        </div>
        <div>
          <h3>4. Mejoras</h3>
          <p>Cada monstruo puede tener hasta 3 mejoras. Pueden ser de vida, ataque o defensa.</p>
        </div>
      </div>
      <div className="icon-rules" aria-label="Iconos de las cartas">
        <span><b className="icon life-icon">♥</b> Vida</span>
        <span><b className="icon attack-icon">✦</b> Ataque</span>
        <span><b className="icon defense-icon">⬟</b> Defensa</span>
      </div>
      <div className="combat-examples">
        <h3>Ejemplos de combate</h3>
        <p><b>✦ 5 - ⬟ 2 = 3 dano.</b> El defensor pierde 3 vidas.</p>
        <p><b>✦ 3 - ⬟ 3 = 0.</b> Como el minimo es 1, pierde 1 vida.</p>
        <p><b>✦ 2 - ⬟ 5 = -3.</b> Como el minimo es 1, pierde 1 vida.</p>
        <p><b>Objetivo libre.</b> Si el rival tiene 3 monstruos, puedes elegir a cual atacar.</p>
      </div>
    </section>
  );
}
