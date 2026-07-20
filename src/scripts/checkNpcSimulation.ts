import { simulateNpcGame } from "../utils/npcSimulator";
import type { NpcCreatureId } from "../types/cards";

const creatureIds: NpcCreatureId[] = ["dragon-volcan", "monstruo-gigante"];

for (const creatureId of creatureIds) {
  for (const playerCount of [1, 2] as const) {
    const results = Array.from({ length: 20 }, (_, index) => simulateNpcGame(creatureId, 1000 + index * 17, playerCount));
    const playerWins = results.filter((result) => result.winner === "players").length;
    const creatureWins = results.filter((result) => result.winner === "creature").length;
    const averageRounds = results.reduce((total, result) => total + result.rounds, 0) / results.length;
    const invalid = results.find((result) => result.steps.length === 0 || result.playerLives.some((life) => Number.isNaN(life)) || Number.isNaN(result.bossLife));

    if (invalid) {
      throw new Error(`Simulación NPC inválida para ${creatureId} con ${playerCount} jugadores`);
    }

    console.log(`${creatureId} · ${playerCount}J · jugadores ${playerWins}/20 · criatura ${creatureWins}/20 · rondas promedio ${averageRounds.toFixed(1)}`);
  }
}
