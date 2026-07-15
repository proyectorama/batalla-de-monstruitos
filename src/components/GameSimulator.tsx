import { useEffect, useState } from "react";
import type { DeckMode } from "../data/deck";
import type { BoostCard, Card, StatKey } from "../types/cards";
import { simulateGame, type SimulationDiscard, type SimulationMonster, type SimulationPlayer } from "../utils/simulator";
import { CardFace } from "./CardFace";
import { StatIcon } from "./StatIcon";

type SimBoardProps = {
  player: SimulationPlayer;
  activeSlot: number | undefined;
  targetSlot: number | undefined;
  discarded: SimulationDiscard | null;
};

const slots = [1, 2, 3];
const totalSlots = [1, 2, 3, 4, 5];

function SimCard({ card, size = "hand", className = "" }: { card: Card; size?: "hand" | "board" | "boost" | "discard" | "ghost"; className?: string }) {
  return <div className={`sim-card-scale sim-card-${size} ${className}`}><CardFace card={card} /></div>;
}

function CardStrip({ title, cards: visibleCards, emptyText }: { title: string; cards: Card[]; emptyText: string }) {
  return (
    <section className="sim-card-strip">
      <header><strong>{title}</strong><span>{visibleCards.length}</span></header>
      <div className="sim-card-row">
        {visibleCards.length > 0 ? visibleCards.map((card) => <SimCard card={card} key={card.id} />) : <p>{emptyText}</p>}
      </div>
    </section>
  );
}

function BoostSlots({ cards: boostCards, stat }: { cards: BoostCard[]; stat: StatKey }) {
  return (
    <>
      {slots.map((slot) => {
        const card = boostCards[slot - 1];
        return (
          <div className={`sim-boost-slot sim-${stat}-slot ${card ? "filled" : ""}`} key={`${stat}-${slot}`}>
            {card ? <SimCard card={card} size="boost" /> : <><StatIcon stat={stat} /><span>{stat === "attack" ? "Ataque" : stat === "defense" ? "Defensa" : "Vida"}</span></>}
          </div>
        );
      })}
    </>
  );
}

function TotalTrack({ stat, value }: { stat: "attack" | "defense"; value: number }) {
  return (
    <div className={`sim-total-track sim-${stat}-total-track`} aria-label={`Total ${stat}`}>
      {totalSlots.map((slot) => <span className={slot <= value ? "filled" : ""} key={`${stat}-${slot}`}><StatIcon stat={stat} /></span>)}
    </div>
  );
}

function LifeTrack({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  return (
    <div className={`sim-life-token-track ${className}`}>
      {Array.from({ length: max }, (_, index) => <span className={index < value ? "filled" : ""} key={index}><StatIcon stat="life" /></span>)}
    </div>
  );
}

function MonsterStation({ monster, active, target, discardedCards }: { monster: SimulationMonster | undefined; active: boolean; target: boolean; discardedCards: Card[] }) {
  return (
    <div className={`sim-station ${active ? "is-attacking" : ""} ${target ? "is-target" : ""} ${monster?.skipNextAttack ? "is-trapped" : ""} ${discardedCards.length > 0 ? "is-discarding" : ""}`}>
      {discardedCards[0] ? <SimCard card={discardedCards[0]} className="sim-discard-ghost" size="ghost" /> : null}
      {monster?.skipNextAttack ? <span className="sim-trapped-badge">Red</span> : null}
      <LifeTrack className="sim-monster-life-track" max={5} value={monster?.life ?? 0} />
      <TotalTrack stat="defense" value={monster?.defense ?? 0} />
      <TotalTrack stat="attack" value={monster?.attack ?? 0} />
      <div className="sim-attack-stack" aria-label="Mejoras de ataque">
        <BoostSlots cards={monster?.attackCards ?? []} stat="attack" />
      </div>
      <div className="sim-station-core">
        <div className="sim-life-stack" aria-label="Mejoras de vida">
          <BoostSlots cards={monster?.lifeCards ?? []} stat="life" />
        </div>
        <div className="sim-card-zone">
          {monster ? <SimCard card={monster.card} size="board" /> : <strong>Carta</strong>}
          {monster ? <span className="sim-card-stats">♥ {monster.life}/{monster.totalLife} · A{monster.attack} · D{monster.defense}</span> : null}
        </div>
        <div className="sim-defense-stack" aria-label="Mejoras de defensa">
          <BoostSlots cards={monster?.defenseCards ?? []} stat="defense" />
        </div>
      </div>
    </div>
  );
}

function DiscardZone({ player }: { player: SimulationPlayer }) {
  return (
    <div className="sim-board-zone sim-discard-zone">
      <strong>Descarte</strong>
      <div className="sim-discard-row">
        {player.discard.length > 0 ? player.discard.map((card, index) => <SimCard card={card} key={`${card.id}-${index}`} size="discard" />) : <span>Sin descarte</span>}
      </div>
    </div>
  );
}

function SimBoard({ player, activeSlot, targetSlot, discarded }: SimBoardProps) {
  const board = player.board;
  const boardSlots = board.player === 2 ? [...slots].reverse() : slots;

  return (
    <div className={`sim-board player-${board.player}`}>
      <header className="sim-board-header">
        <span>Tablero J{board.player}</span>
        <LifeTrack className="sim-player-life-track" max={20} value={board.life} />
      </header>
      <div className="sim-board-layout">
        {boardSlots.map((slot) => {
          const monster = board.monsters.find((item) => item.slot === slot);
          const discardedCards = discarded?.player === board.player && discarded.monsterSlot === slot ? discarded.cards : [];
          return <MonsterStation active={activeSlot === slot} discardedCards={discardedCards} key={`sim-${board.player}-${slot}`} monster={monster} target={targetSlot === slot} />;
        })}
        <div className="sim-board-zone sim-deck-zone"><strong>Mazo</strong><span>{player.deckCount}</span></div>
        <DiscardZone player={player} />
      </div>
    </div>
  );
}

function PlayerPanel({ player }: { player: SimulationPlayer }) {
  return (
    <aside className={`sim-player-panel player-${player.player}`}>
      <header>
        <strong>Jugador {player.player}</strong>
        <span>♥ {player.life}/20</span>
        <span>Mazo {player.deckCount}</span>
      </header>
      <CardStrip cards={player.hand} emptyText="Sin cartas en mano" title="Mano actual" />
    </aside>
  );
}

export function GameSimulator({ cards, mode }: { cards: Card[]; mode: DeckMode }) {
  const [seed, setSeed] = useState(11);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [turnSpeed, setTurnSpeed] = useState(3);
  const result = started ? simulateGame(cards, seed) : null;
  const currentStep = result?.steps[Math.min(step, Math.max(0, result.steps.length - 1))];
  const playerOne = currentStep?.players[0] ?? { player: 1 as const, life: 20, board: { player: 1 as const, life: 20, monsters: [] }, hand: [], deckCount: cards.length, discard: [] };
  const playerTwo = currentStep?.players[1] ?? { player: 2 as const, life: 20, board: { player: 2 as const, life: 20, monsters: [] }, hand: [], deckCount: cards.length, discard: [] };
  const currentAttack = currentStep?.attack ?? null;
  const playerOneAttack = currentAttack?.player === 1 ? currentAttack.attackerSlot : undefined;
  const playerTwoAttack = currentAttack?.player === 2 ? currentAttack.attackerSlot : undefined;
  const playerOneTarget = currentAttack?.player === 2 ? currentAttack.targetSlot ?? undefined : undefined;
  const playerTwoTarget = currentAttack?.player === 1 ? currentAttack.targetSlot ?? undefined : undefined;
  const isFinished = result ? step >= result.steps.length - 1 : false;

  useEffect(() => {
    setStarted(false);
    setStep(0);
  }, [mode]);

  useEffect(() => {
    if (!result || paused || isFinished) return;
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, result.steps.length - 1)), turnSpeed * 1000);
    return () => window.clearInterval(timer);
  }, [isFinished, paused, result?.steps.length, seed, step, turnSpeed]);

  const startSimulation = () => {
    setStep(0);
    setSeed(Math.floor(Math.random() * 1000000));
    setStarted(true);
    setPaused(false);
  };

  const nextTurn = () => {
    if (!result) return;
    const currentTurn = currentStep?.turn ?? 0;
    const nextTurnIndex = result.steps.findIndex((item, index) => index > step && item.turn > currentTurn);
    setStep(nextTurnIndex >= 0 ? nextTurnIndex : result.steps.length - 1);
  };

  return (
    <section className="panel simulator" aria-labelledby="simulator-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Prueba de partida · {mode === "base" ? "Juego base" : "Poderes especiales"}</p>
          <h2 id="simulator-title">Simulador</h2>
        </div>
        <button className="primary-action" type="button" onClick={startSimulation}>{started ? "Simular otra" : "Simular partida aleatoria"}</button>
      </div>
      <div className="sim-controls" aria-label="Controles del simulador">
        <label>
          <span>Velocidad turno</span>
          <input min="0.5" max="20" step="0.5" type="number" value={turnSpeed} onChange={(event) => setTurnSpeed(Math.max(0.5, Number(event.target.value) || 0.5))} />
          <small>seg</small>
        </label>
        <button type="button" disabled={!result || isFinished} onClick={() => setPaused((current) => !current)}>{paused ? "Reanudar" : "Pausa"}</button>
        <button type="button" disabled={!result || isFinished} onClick={nextTurn}>Siguiente turno</button>
      </div>
      <div className="sim-current-event">
        <span>{result ? `Paso ${Math.min(step + 1, result.steps.length)} / ${result.steps.length}` : "En espera"}</span>
        <strong>{currentStep?.message.toUpperCase() ?? "TOCA SIMULAR PARTIDA ALEATORIA PARA EMPEZAR"}</strong>
      </div>
      <div className={`sim-table attack-from-${currentAttack?.player ?? 0}`}>
        <div className={`sim-player-area ${currentStep?.activePlayer === 2 ? "is-active-turn" : ""}`}>
          <PlayerPanel player={playerTwo} />
          <SimBoard activeSlot={playerTwoAttack} discarded={currentStep?.discarded ?? null} player={playerTwo} targetSlot={playerTwoTarget} />
        </div>
        <div className={`sim-player-area ${currentStep?.activePlayer === 1 ? "is-active-turn" : ""}`}>
          <PlayerPanel player={playerOne} />
          <SimBoard activeSlot={playerOneAttack} discarded={currentStep?.discarded ?? null} player={playerOne} targetSlot={playerOneTarget} />
        </div>
      </div>
      <div className="sim-summary">
        <div><strong>{currentStep?.winner ? `J${currentStep.winner}` : "-"}</strong><span>Ganador</span></div>
        <div><strong>{currentStep?.turn ?? 0}</strong><span>Turno actual</span></div>
        <div><strong>{playerOne.life}</strong><span>Vida J1</span></div>
        <div><strong>{playerTwo.life}</strong><span>Vida J2</span></div>
      </div>
      <ol className="sim-log">
        {[...(currentStep?.log ?? [])].reverse().map((entry, index) => (
          <li key={`${seed}-${index}`} value={(currentStep?.log.length ?? 0) - index}>{entry.toUpperCase()}</li>
        ))}
      </ol>
    </section>
  );
}
