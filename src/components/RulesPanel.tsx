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
          <p>Son {cardCounts.total} cartas: 2 mazos de 30. Cada jugador roba 5 y pone 1 monstruo activo.</p>
        </div>
        <div>
          <h3>3. Turno</h3>
          <p>Roba 1, baja hasta 1 monstruo, juega hasta 1 mejora, ataca y pasa el turno.</p>
        </div>
        <div>
          <h3>4. Mejoras</h3>
          <p>Cada monstruo puede tener como maximo 2 mejoras. Si ya tiene 2, no puede recibir otra.</p>
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
      </div>
    </section>
  );
}
