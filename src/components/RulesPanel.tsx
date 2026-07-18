import { cards, countsForCards } from "../data/deck";
import { StatIcon } from "./StatIcon";

export function RulesPanel() {
  const counts = countsForCards(cards);

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
          <p>Cada jugador imprime y usa su propia copia del mazo de {counts.total} cartas. Mezcla, roba 5 y puede tener hasta 3 monstruos en juego.</p>
        </div>
        <div>
          <h3>3. Turno</h3>
          <p>Roba 1, baja 1 monstruo, juega mejoras, usa hasta 1 especial y atacan tus 3 monstruos, uno por uno.</p>
        </div>
        <div>
          <h3>4. Mejoras</h3>
          <p>Cada monstruo puede tener 3 de vida, 3 de ataque y 3 de defensa. Usa espadas y escudos para sumar facil.</p>
        </div>
      </div>
      <div className="expansion-rules">
          <div>
            <p className="eyebrow">Mazo clásico</p>
            <h3>50 cartas para jugar</h3>
            <p>El mazo incluye 12 monstruos, 27 mejoras y 11 cartas especiales.</p>
          </div>
          <div>
            <h3>Cómo usar especiales</h3>
            <p>Jugá como máximo 1 por turno, después de monstruos y mejoras y antes de atacar. Resolvé el efecto y mandala al descarte. Si no hay un objetivo válido, no se puede jugar.</p>
          </div>
          <div>
            <h3>Daño, cura y redes</h3>
            <p>El daño verdadero ignora defensa. Curar nunca supera la vida máxima. Una red evita el próximo ataque del monstruo elegido y no se acumula con otra red.</p>
          </div>
        </div>
      <div className="icon-rules" aria-label="Iconos de las cartas">
        <span><b className="icon life-icon">♥</b> Vida</span>
        <span><b className="icon attack-icon"><StatIcon stat="attack" /></b> Ataque</span>
        <span><b className="icon defense-icon"><StatIcon stat="defense" /></b> Defensa</span>
      </div>
      <div className="combat-examples">
        <h3>Ejemplos de combate</h3>
        <p><b>Los escudos se gastan durante el turno.</b> Cada escudo bloquea 1 punto de ataque y se retira. Todos los escudos se reponen al terminar el turno.</p>
        <p><b>5 espadas - 2 escudos = 3 dano.</b> El defensor pierde 3 vidas.</p>
        <p><b>3 espadas - 3 escudos = 0.</b> El defensor no pierde vidas y gasta sus 3 escudos.</p>
        <p><b>Ataques seguidos.</b> Si M1 rompe el escudo de M2, un ataque posterior de M3 a M2 ya no descuenta ese escudo.</p>
        <p><b>Atacan los 3.</b> Cada monstruo tuyo elige a cual rival atacar.</p>
        <p><b>Sin monstruos.</b> Si no tienes monstruos para defenderte, el dano baja de tus 20 vidas.</p>
      </div>
    </section>
  );
}
