import { cardCounts } from "../data/deck";

export function RulesPanel() {
  return (
    <section className="rules panel" aria-labelledby="rules-title">
      <p className="eyebrow">Reglas simples</p>
      <h2 id="rules-title">Como se juega</h2>
      <div className="rules-grid">
        <div>
          <h3>Preparacion</h3>
          <p>Son {cardCounts.total} cartas: 2 mazos de 30. Cada jugador mezcla su mazo, roba 5 cartas y baja 1 monstruo activo.</p>
        </div>
        <div>
          <h3>Turno</h3>
          <p>Roba 1 carta, baja hasta 1 monstruo en espera, juega hasta 1 mejora y ataca con el monstruo activo.</p>
        </div>
        <div>
          <h3>Combate</h3>
          <p>Dano = ataque del atacante menos defensa del defensor. Siempre hace minimo 1 dano.</p>
        </div>
        <div>
          <h3>Victoria</h3>
          <p>Cuando un monstruo queda sin vida va al descarte. El primero que derrota 3 monstruos gana.</p>
        </div>
      </div>
    </section>
  );
}
