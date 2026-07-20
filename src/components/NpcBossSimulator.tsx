import { useEffect, useState } from "react";
import { specialCreatures } from "../data/deck";
import type { NpcCreatureId } from "../types/cards";
import { simulateNpcGame } from "../utils/npcSimulator";
import { CardFace } from "./CardFace";

type PlayerCount = 1 | 2;

export function NpcBossSimulator() {
  const [creatureId, setCreatureId] = useState<NpcCreatureId>("dragon-volcan");
  const [playerCount, setPlayerCount] = useState<PlayerCount>(2);
  const [seed, setSeed] = useState(101);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const result = started ? simulateNpcGame(creatureId, seed, playerCount) : null;
  const currentStep = result?.steps[Math.min(step, Math.max(0, result.steps.length - 1))];
  const selectedCreature = specialCreatures.find((creature) => creature.id === creatureId) ?? specialCreatures[0];
  if (!selectedCreature) {
    throw new Error("No hay criaturas especiales configuradas");
  }
  const isFinished = result ? step >= result.steps.length - 1 : false;

  useEffect(() => {
    setStarted(false);
    setStep(0);
  }, [creatureId, playerCount]);

  const start = () => {
    setSeed(Math.floor(Math.random() * 1000000));
    setStep(0);
    setStarted(true);
  };

  return (
    <section className="panel npc-simulator" aria-labelledby="npc-simulator-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Expansión · Criaturas especiales</p>
          <h2 id="npc-simulator-title">Mazo NPC público</h2>
          <p>1 o 2 jugadores contra una criatura que juega sola con 3 cartas públicas.</p>
        </div>
        <button className="primary-action" type="button" onClick={start}>{started ? "Simular otra" : "Iniciar criatura"}</button>
      </div>

      <div className="npc-controls">
        <label>
          <span>Criatura</span>
          <select value={creatureId} onChange={(event) => setCreatureId(event.target.value as NpcCreatureId)}>
            {specialCreatures.map((creature) => <option key={creature.id} value={creature.id}>{creature.boss.name}</option>)}
          </select>
        </label>
        <label>
          <span>Jugadores</span>
          <select value={playerCount} onChange={(event) => setPlayerCount(Number(event.target.value) as PlayerCount)}>
            <option value={1}>1 jugador</option>
            <option value={2}>2 jugadores</option>
          </select>
        </label>
        <button type="button" disabled={!result || isFinished} onClick={() => setStep((value) => Math.min(value + 1, (result?.steps.length ?? 1) - 1))}>Siguiente evento</button>
        <button type="button" disabled={!result || isFinished} onClick={() => {
          if (!result || !currentStep) return;
          const nextRound = result.steps.findIndex((item, index) => index > step && item.round > currentStep.round);
          setStep(nextRound >= 0 ? nextRound : result.steps.length - 1);
        }}>Siguiente ronda</button>
      </div>

      <div className={`npc-boss-panel ${selectedCreature?.boss.difficulty === "hard" ? "hard" : "normal"}`}>
        <div className="npc-boss-card-wrap"><CardFace card={currentStep?.boss.card ?? selectedCreature.boss} /></div>
        <div className="npc-boss-status">
          <strong>{currentStep?.boss.card.name ?? selectedCreature.boss.name}</strong>
          <span>Vida {currentStep?.boss.life ?? selectedCreature.boss.twoPlayerLife}/{currentStep?.boss.maxLife ?? selectedCreature.boss.twoPlayerLife}</span>
          <span>Furia {currentStep?.boss.fury ?? (selectedCreature.boss.difficulty === "hard" ? 1 : 0)}/{selectedCreature.boss.maxFury}</span>
          <span>Escudos temporales {currentStep?.boss.shield ?? 0}</span>
          <small>{selectedCreature.boss.passiveRule}</small>
        </div>
      </div>

      <section className="npc-threat-row" aria-label="Fila pública de amenaza">
        <header><strong>Próximas cartas públicas</strong><span>Mazo {currentStep?.boss.deckCount ?? selectedCreature.actions.length}</span></header>
        <div className="npc-threat-cards">
          {(currentStep?.boss.threatRow ?? selectedCreature.actions.slice(0, 3)).map((card) => <CardFace card={card} key={card.id} />)}
        </div>
      </section>

      <div className="sim-current-event">
        <span>{result ? `Paso ${Math.min(step + 1, result.steps.length)} / ${result.steps.length}` : "En espera"}</span>
        <strong>{currentStep?.message.toUpperCase() ?? "ELEGÍ UNA CRIATURA Y TOCÁ INICIAR"}</strong>
      </div>

      <div className="npc-player-grid">
        {(currentStep?.players ?? []).map((player) => (
          <article className="npc-player-card" key={player.player}>
            <header><strong>Jugador {player.player}</strong><span>♥ {player.life}/20 · Mazo {player.deckCount}</span></header>
            <div className="npc-monster-row">
              {player.board.map((monster) => <div className="npc-monster-pill" key={`${player.player}-${monster.slot}`}><strong>{monster.card.name}</strong><span>♥ {monster.life}/{monster.totalLife} · 🛡 {monster.defense} · ⚔ {monster.attack}</span></div>)}
            </div>
          </article>
        ))}
      </div>

      <ol className="sim-log npc-log">
        {[...(currentStep?.log ?? [])].reverse().slice(0, 14).map((entry, index) => <li key={`${seed}-${index}`}>{entry.toUpperCase()}</li>)}
      </ol>
    </section>
  );
}
