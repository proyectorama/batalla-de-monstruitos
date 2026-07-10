import { useState } from "react";
import { cards } from "../data/deck";
import { simulateGame } from "../utils/simulator";

export function GameSimulator() {
  const [seed, setSeed] = useState(11);
  const result = simulateGame(cards, seed);

  return (
    <section className="panel simulator" aria-labelledby="simulator-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Prueba de partida</p>
          <h2 id="simulator-title">Simulador</h2>
        </div>
        <button className="primary-action" type="button" onClick={() => setSeed((current) => current + 1)}>Simular otra</button>
      </div>
      <div className="sim-summary">
        <div><strong>{result.winner ? `J${result.winner}` : "-"}</strong><span>Ganador</span></div>
        <div><strong>{result.turns}</strong><span>Turnos</span></div>
        <div><strong>{result.playerOnePoints}</strong><span>Puntos J1</span></div>
        <div><strong>{result.playerTwoPoints}</strong><span>Puntos J2</span></div>
      </div>
      <ol className="sim-log">
        {result.log.slice(0, 42).map((entry, index) => (
          <li key={`${seed}-${index}`}>{entry.toUpperCase()}</li>
        ))}
      </ol>
    </section>
  );
}
