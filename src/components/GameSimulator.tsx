import { useEffect, useState } from "react";
import { cards } from "../data/deck";
import { simulateGame, type SimulationBoard } from "../utils/simulator";
import { StatIcon } from "./StatIcon";

type SimBoardProps = {
  board: SimulationBoard;
  activeSlot: number | undefined;
  targetSlot: number | undefined;
};

function SimBoard({ board, activeSlot, targetSlot }: SimBoardProps) {
  return (
    <div className={`sim-board player-${board.player}`}>
      <header className="sim-board-header">
        <span>TABLERO</span>
        <strong>♥ {board.life}</strong>
      </header>
      <div className="sim-board-layout">
        {[1, 2, 3].map((slot) => {
          const monster = board.monsters.find((item) => item.slot === slot);
          return (
            <div className={`sim-station ${activeSlot === slot ? "is-attacking" : ""} ${targetSlot === slot ? "is-target" : ""}`} key={`sim-${board.player}-${slot}`}>
              <div className="sim-station-title">♥ VIDA</div>
              <div className="sim-attack-stack">
                {Array.from({ length: 3 }, (_, index) => <span className={index < (monster?.attackBoosts ?? 0) ? "filled" : ""} key={index}><StatIcon stat="attack" /> ATAQUE</span>)}
              </div>
              <div className="sim-station-core">
                <div className="sim-defense-stack">
                  {Array.from({ length: 3 }, (_, index) => <span className={index < (monster?.defenseBoosts ?? 0) ? "filled" : ""} key={index}><StatIcon stat="defense" /> DEFENSA</span>)}
                </div>
                <div className="sim-card-mini">
                  <strong>{monster?.name ?? "CARTA"}</strong>
                  {monster ? <span>♥ {monster.life} <StatIcon stat="attack" /> {monster.attack} <StatIcon stat="defense" /> {monster.defense}</span> : <span>CARTA</span>}
                </div>
                <div className="sim-life-stack">
                  {Array.from({ length: 3 }, (_, index) => <span className={index < (monster?.lifeBoosts ?? 0) ? "filled" : ""} key={index}>♥ VIDA</span>)}
                </div>
              </div>
              <div className="sim-heart-track">{Array.from({ length: 5 }, (_, index) => <span key={index}>♡</span>)}</div>
            </div>
          );
        })}
      </div>
      <footer className="sim-board-footer">
        <span>MAZO</span>
        <span>DESCARTE</span>
        <span>VIDA: {board.life}/20</span>
      </footer>
    </div>
  );
}

export function GameSimulator() {
  const [seed, setSeed] = useState(11);
  const [step, setStep] = useState(0);
  const result = simulateGame(cards, seed);
  const boardOne = result.finalBoards[0] ?? { player: 1, life: 20, monsters: [] };
  const boardTwo = result.finalBoards[1] ?? { player: 2, life: 20, monsters: [] };
  const currentAttack = result.attacks[step % Math.max(1, result.attacks.length)];
  const playerOneAttack = currentAttack?.player === 1 ? currentAttack.attackerSlot : undefined;
  const playerTwoAttack = currentAttack?.player === 2 ? currentAttack.attackerSlot : undefined;
  const playerOneTarget = currentAttack?.player === 2 ? currentAttack.targetSlot ?? undefined : undefined;
  const playerTwoTarget = currentAttack?.player === 1 ? currentAttack.targetSlot ?? undefined : undefined;

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
          <div className="attack-beam"><StatIcon stat="attack" /></div>
          <strong>{currentAttack ? `J${currentAttack.player} HACE ${currentAttack.damage} DANO` : "LISTO"}</strong>
        </div>
        <SimBoard board={boardTwo} activeSlot={playerTwoAttack} targetSlot={playerTwoTarget} />
      </div>
      <div className="sim-summary">
        <div><strong>{result.winner ? `J${result.winner}` : "-"}</strong><span>Ganador</span></div>
        <div><strong>{result.turns}</strong><span>Turnos</span></div>
        <div><strong>{result.playerOneLife}</strong><span>Vida J1</span></div>
        <div><strong>{result.playerTwoLife}</strong><span>Vida J2</span></div>
      </div>
      <ol className="sim-log">
        {result.log.slice(0, 42).map((entry, index) => (
          <li key={`${seed}-${index}`}>{entry.toUpperCase()}</li>
        ))}
      </ol>
    </section>
  );
}
