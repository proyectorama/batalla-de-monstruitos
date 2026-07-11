import { cards } from "../data/deck";
import { simulateGame } from "../utils/simulator";

const failures: string[] = [];

for (let seed = 1; seed <= 30; seed += 1) {
  const result = simulateGame(cards, seed);

  if (result.turns > 80) {
    failures.push(`Seed ${seed}: supero el limite de turnos.`);
  }

  if (result.playerOneLife < 0 || result.playerTwoLife < 0 || result.playerOneLife > 20 || result.playerTwoLife > 20) {
    failures.push(`Seed ${seed}: vidas invalidas.`);
  }

  if (!result.winner && result.turns < 80) {
    failures.push(`Seed ${seed}: termino sin ganador antes del limite.`);
  }
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"));
}

console.log("30 partidas simuladas correctamente.");
