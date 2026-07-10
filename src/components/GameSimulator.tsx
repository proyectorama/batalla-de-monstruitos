import { useEffect, useState } from "react";
import { cards } from "../data/deck";
import { simulateGame, type SimulationBoard } from "../utils/simulator";

type SimBoardProps = {
  board: SimulationBoard;
  activeSlot: number | undefined;
  targetSlot: number | undefined;
};

function SimBoard({ board, activeSlot, targetSlot }: SimBoardProps) {
  return (
    <div className={`sim-board player-${board.player}`}>
      <h3>JUGADOR {board.player}</h3>
      <div className="sim-monsters">
        {[1, 2, 3].map((slot) => {
          const monster = board.monsters.find((item) => item.slot === slot);
          return (
            <div className={`sim-monster ${activeSlot === slot ? "is-attacking" : ""} ${targetSlot === slot ? "is-target" : ""}`} key={`sim-${board.player}-${slot}`}>
              <div className="sim-attack-slots">{Array.from({ length: monster?.attackBoosts ?? 0 }, (_, index) => <span key={index}>✦</span>)}</div>
              <div className="sim-core">
                <div className="sim-life-slots">{Array.from({ length: monster?.lifeBoosts ?? 0 }, (_, index) => <span key={index}>♥</span>)}</div>
                <div className="sim-card-mini">
                  <strong>{monster?.name ?? `MONSTRUO ${slot}`}</strong>
                  {monster ? <span>♥ {monster.life}  ✦ {monster.attack}  ⬟ {monster.defense}</span> : <span>VACIO</span>}
                </div>
                <div className="sim-defense-slots">{Array.from({ length: monster?.defenseBoosts ?? 0 }, (_, index) => <span key={index}>⬟</span>)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p>PUNTOS {board.points}/3</p>
    </div>
  );
}

export function GameSimulator() {
  const [seed, setSeed] = useState(11);
  const [step, setStep] = useState(0);
  const result = simulateGame(cards, seed);
  const boardOne = result.finalBoards[0] ?? { player: 1, points: 0, monsters: [] };
  const boardTwo = result.finalBoards[1] ?? { player: 2, points: 0, monsters: [] };
  const currentAttack = result.attacks[step % Math.max(1, result.attacks.length)];
  const playerOneAttack = currentAttack?.player === 1 ? currentAttack.attackerSlot : undefined;
  const playerTwoAttack = currentAttack?.player === 2 ? currentAttack.attackerSlot : undefined;
  const playerOneTarget = currentAttack?.player === 2 ? currentAttack.targetSlot : undefined;
  const playerTwoTarget = currentAttack?.player === 1 ? currentAttack.targetSlot : undefined;

  useEffect(() => {
    const timer = window.setInterval(() => setStep((current) => current + 1), 1100);
    return () => window.clearInterval(timer);
  }, [seed]);

  return (
    <section className="panel simulator" aria-labelledby="simulator-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Prueba de partida</p>
          <h2 id="simulator-title">Simulador</h2>
        </div>
        <button className="primary-action" type="button" onClick={() => { setStep(0); setSeed((current) => current + 1); }}>Simular otra</button>
      </div>
      <div className={`sim-table attack-from-${currentAttack?.player ?? 0}`}>
        <SimBoard board={boardOne} activeSlot={playerOneAttack} targetSlot={playerOneTarget} />
        <div className="attack-lane">
          <div className="attack-beam">✦</div>
          <strong>{currentAttack ? `J${currentAttack.player} HACE ${currentAttack.damage} DANO` : "LISTO"}</strong>
        </div>
        <SimBoard board={boardTwo} activeSlot={playerTwoAttack} targetSlot={playerTwoTarget} />
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
