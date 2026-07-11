import { useEffect, useState } from "react";
import { cards } from "../data/deck";
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
    <div className={`sim-station ${active ? "is-attacking" : ""} ${target ? "is-target" : ""} ${discardedCards.length > 0 ? "is-discarding" : ""}`}>
      {discardedCards[0] ? <SimCard card={discardedCards[0]} className="sim-discard-ghost" size="ghost" /> : null}
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

export function GameSimulator() {
  const [seed, setSeed] = useState(11);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const result = started ? simulateGame(cards, seed) : null;
  const currentStep = result?.steps[Math.min(step, Math.max(0, result.steps.length - 1))];
  const playerOne = currentStep?.players[0] ?? { player: 1 as const, life: 20, board: { player: 1 as const, life: 20, monsters: [] }, hand: [], deckCount: cards.filter((card) => card.deck === 1).length, discard: [] };
  const playerTwo = currentStep?.players[1] ?? { player: 2 as const, life: 20, board: { player: 2 as const, life: 20, monsters: [] }, hand: [], deckCount: cards.filter((card) => card.deck === 2).length, discard: [] };
  const currentAttack = currentStep?.attack ?? null;
  const playerOneAttack = currentAttack?.player === 1 ? currentAttack.attackerSlot : undefined;
  const playerTwoAttack = currentAttack?.player === 2 ? currentAttack.attackerSlot : undefined;
  const playerOneTarget = currentAttack?.player === 2 ? currentAttack.targetSlot ?? undefined : undefined;
  const playerTwoTarget = currentAttack?.player === 1 ? currentAttack.targetSlot ?? undefined : undefined;

  useEffect(() => {
    if (!result || step >= result.steps.length - 1) return;
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, result.steps.length - 1)), 3000);
    return () => window.clearInterval(timer);
  }, [result?.steps.length, seed, step]);

  const startSimulation = () => {
    setStep(0);
    setSeed(Math.floor(Math.random() * 1000000));
    setStarted(true);
  };

  return (
    <section className="panel simulator" aria-labelledby="simulator-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Prueba de partida</p>
          <h2 id="simulator-title">Simulador</h2>
        </div>
        <button className="primary-action" type="button" onClick={startSimulation}>{started ? "Simular otra" : "Simular partida aleatoria"}</button>
      </div>
      <div className="sim-current-event">
        <span>{result ? `Paso ${Math.min(step + 1, result.steps.length)} / ${result.steps.length}` : "En espera"}</span>
        <strong>{currentStep?.message.toUpperCase() ?? "TOCA SIMULAR PARTIDA ALEATORIA PARA EMPEZAR"}</strong>
      </div>
      <div className={`sim-table attack-from-${currentAttack?.player ?? 0}`}>
        <PlayerPanel player={playerTwo} />
        <SimBoard activeSlot={playerTwoAttack} discarded={currentStep?.discarded ?? null} player={playerTwo} targetSlot={playerTwoTarget} />
        <div className="attack-lane">
          <div className="attack-beam"><StatIcon stat="attack" /></div>
          <strong>{currentAttack ? `J${currentAttack.player} HACE ${currentAttack.damage} DANO` : "LISTO"}</strong>
        </div>
        <SimBoard activeSlot={playerOneAttack} discarded={currentStep?.discarded ?? null} player={playerOne} targetSlot={playerOneTarget} />
        <PlayerPanel player={playerOne} />
      </div>
      <div className="sim-summary">
        <div><strong>{currentStep?.winner ? `J${currentStep.winner}` : "-"}</strong><span>Ganador</span></div>
        <div><strong>{currentStep?.turn ?? 0}</strong><span>Turno actual</span></div>
        <div><strong>{playerOne.life}</strong><span>Vida J1</span></div>
        <div><strong>{playerTwo.life}</strong><span>Vida J2</span></div>
      </div>
      <ol className="sim-log">
        {[...(currentStep?.log ?? [])].reverse().map((entry, index) => (
          <li key={`${seed}-${index}`}>{entry.toUpperCase()}</li>
        ))}
      </ol>
    </section>
  );
}
