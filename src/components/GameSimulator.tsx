import { useEffect, useState } from "react";
import { cards } from "../data/deck";
import type { BoostCard, Card, StatKey } from "../types/cards";
import { simulateGame, type SimulationBoard, type SimulationMonster, type SimulationPlayer } from "../utils/simulator";
import { StatIcon } from "./StatIcon";

type SimBoardProps = {
  board: SimulationBoard;
  activeSlot: number | undefined;
  targetSlot: number | undefined;
};

const slots = [1, 2, 3];
const totalSlots = [1, 2, 3, 4, 5];

const boostStat = (card: Card): StatKey | null => {
  if (card.kind === "boost_attack") return "attack";
  if (card.kind === "boost_defense") return "defense";
  if (card.kind === "boost_life") return "life";
  return null;
};

const cardValue = (card: Card): string => {
  if (card.kind === "monster") return `♥${card.life} A${card.attack} D${card.defense}`;
  if (card.kind === "boost_attack") return `+${card.attackBonus}`;
  if (card.kind === "boost_defense") return `+${card.defenseBonus}`;
  return `+${card.lifeBonus}`;
};

function MiniCard({ card }: { card: Card }) {
  const stat = boostStat(card);
  return (
    <article className={`sim-mini-card ${card.kind}`} title={card.name}>
      <strong>{card.name.toUpperCase()}</strong>
      <span>{stat ? <StatIcon stat={stat} /> : <StatIcon stat="life" />}{cardValue(card)}</span>
    </article>
  );
}

function CardStrip({ title, cards: visibleCards, emptyText }: { title: string; cards: Card[]; emptyText: string }) {
  return (
    <section className="sim-card-strip">
      <header><strong>{title}</strong><span>{visibleCards.length}</span></header>
      <div className="sim-card-row">
        {visibleCards.length > 0 ? visibleCards.map((card) => <MiniCard card={card} key={card.id} />) : <p>{emptyText}</p>}
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
            <StatIcon stat={stat} />
            <span>{card ? `${card.name.toUpperCase()} ${cardValue(card)}` : stat === "attack" ? "Ataque" : stat === "defense" ? "Defensa" : "Vida"}</span>
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

function MonsterStation({ monster, active, target }: { monster: SimulationMonster | undefined; active: boolean; target: boolean }) {
  return (
    <div className={`sim-station ${active ? "is-attacking" : ""} ${target ? "is-target" : ""}`}>
      <div className="sim-heart-track" aria-label="Vida del monstruo">
        {totalSlots.map((slot) => <span className={monster && slot <= monster.life ? "filled" : ""} key={`heart-${slot}`}>♡</span>)}
      </div>
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
          {monster ? (
            <>
              <strong>{monster.name}</strong>
              <span>♥ {monster.life}/{monster.totalLife}</span>
              <span><StatIcon stat="attack" /> {monster.attack} <StatIcon stat="defense" /> {monster.defense}</span>
              {monster.damage > 0 ? <em>-{monster.damage} dano</em> : null}
            </>
          ) : <strong>Carta</strong>}
        </div>
        <div className="sim-defense-stack" aria-label="Mejoras de defensa">
          <BoostSlots cards={monster?.defenseCards ?? []} stat="defense" />
        </div>
      </div>
    </div>
  );
}

function SimBoard({ board, activeSlot, targetSlot }: SimBoardProps) {
  return (
    <div className={`sim-board player-${board.player}`}>
      <header className="sim-board-header">
        <span>TABLERO</span>
        <div className="sim-player-life-track" aria-label={`Vida de J${board.player}`}>
          {Array.from({ length: 20 }, (_, index) => <span className={index < board.life ? "filled" : ""} key={index}>♡</span>)}
        </div>
      </header>
      <div className="sim-board-layout">
        {slots.map((slot) => {
          const monster = board.monsters.find((item) => item.slot === slot);
          return <MonsterStation active={activeSlot === slot} key={`sim-${board.player}-${slot}`} monster={monster} target={targetSlot === slot} />;
        })}
        <div className="sim-board-zone sim-deck-zone">Mazo</div>
        <div className="sim-board-zone sim-discard-zone">Descarte</div>
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
      <CardStrip cards={player.hand} emptyText="Sin cartas en mano" title="Mano visible" />
      <CardStrip cards={player.discard} emptyText="Descarte vacio" title="Descarte" />
    </aside>
  );
}

export function GameSimulator() {
  const [seed, setSeed] = useState(11);
  const [step, setStep] = useState(0);
  const result = simulateGame(cards, seed);
  const currentStep = result.steps[Math.min(step, Math.max(0, result.steps.length - 1))];
  const playerOne = currentStep?.players[0] ?? { player: 1 as const, life: 20, board: { player: 1 as const, life: 20, monsters: [] }, hand: [], deckCount: 0, discard: [] };
  const playerTwo = currentStep?.players[1] ?? { player: 2 as const, life: 20, board: { player: 2 as const, life: 20, monsters: [] }, hand: [], deckCount: 0, discard: [] };
  const currentAttack = currentStep?.attack ?? null;
  const playerOneAttack = currentAttack?.player === 1 ? currentAttack.attackerSlot : undefined;
  const playerTwoAttack = currentAttack?.player === 2 ? currentAttack.attackerSlot : undefined;
  const playerOneTarget = currentAttack?.player === 2 ? currentAttack.targetSlot ?? undefined : undefined;
  const playerTwoTarget = currentAttack?.player === 1 ? currentAttack.targetSlot ?? undefined : undefined;

  useEffect(() => {
    if (step >= result.steps.length - 1) return;
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, result.steps.length - 1)), 2000);
    return () => window.clearInterval(timer);
  }, [result.steps.length, seed, step]);

  return (
    <section className="panel simulator" aria-labelledby="simulator-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Prueba de partida</p>
          <h2 id="simulator-title">Simulador</h2>
        </div>
        <button className="primary-action" type="button" onClick={() => { setStep(0); setSeed((current) => current + 1); }}>Simular otra</button>
      </div>
      <div className="sim-current-event">
        <span>Paso {Math.min(step + 1, result.steps.length)} / {result.steps.length}</span>
        <strong>{currentStep?.message.toUpperCase() ?? "LISTO"}</strong>
      </div>
      <div className={`sim-table attack-from-${currentAttack?.player ?? 0}`}>
        <PlayerPanel player={playerOne} />
        <SimBoard board={playerOne.board} activeSlot={playerOneAttack} targetSlot={playerOneTarget} />
        <div className="attack-lane">
          <div className="attack-beam"><StatIcon stat="attack" /></div>
          <strong>{currentAttack ? `J${currentAttack.player} HACE ${currentAttack.damage} DANO` : "LISTO"}</strong>
        </div>
        <SimBoard board={playerTwo.board} activeSlot={playerTwoAttack} targetSlot={playerTwoTarget} />
        <PlayerPanel player={playerTwo} />
      </div>
      <div className="sim-summary">
        <div><strong>{currentStep?.winner ? `J${currentStep.winner}` : "-"}</strong><span>Ganador</span></div>
        <div><strong>{currentStep?.turn ?? 0}</strong><span>Turno actual</span></div>
        <div><strong>{playerOne.life}</strong><span>Vida J1</span></div>
        <div><strong>{playerTwo.life}</strong><span>Vida J2</span></div>
      </div>
      <ol className="sim-log">
        {(currentStep?.log ?? []).map((entry, index) => (
          <li key={`${seed}-${index}`}>{entry.toUpperCase()}</li>
        ))}
      </ol>
    </section>
  );
}
