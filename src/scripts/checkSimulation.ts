import { cards } from "../data/deck";
import { simulateGame } from "../utils/simulator";

const failures: string[] = [];

for (let seed = 1; seed <= 30; seed += 1) {
  const result = simulateGame(cards, seed);

  if (!result.winner) {
    failures.push(`Seed ${seed}: no tuvo ganador.`);
  }

  if (result.turns > 80) {
    failures.push(`Seed ${seed}: supero el limite de turnos.`);
  }

  if (result.playerOnePoints < 0 || result.playerTwoPoints < 0) {
    failures.push(`Seed ${seed}: puntos invalidos.`);
  }
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"));
}

console.log("30 partidas simuladas correctamente.");
