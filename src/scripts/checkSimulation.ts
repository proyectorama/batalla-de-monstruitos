import { cards } from "../data/deck";
import { simulateGame } from "../utils/simulator";

const failures: string[] = [];

const expectedCounts = {
  monster: 18,
  boost_attack: 9,
  boost_defense: 9,
  boost_life: 9,
};

if (cards.length !== 45) {
  failures.push(`El mazo tiene ${cards.length} cartas en lugar de 45.`);
}

for (const [kind, expected] of Object.entries(expectedCounts)) {
  const actual = cards.filter((card) => card.kind === kind).length;
  if (actual !== expected) failures.push(`Hay ${actual} cartas ${kind} en lugar de ${expected}.`);
}

if (new Set(cards.map((card) => card.id)).size !== cards.length) {
  failures.push("El mazo contiene identificadores repetidos.");
}

for (let seed = 1; seed <= 30; seed += 1) {
  const result = simulateGame(cards, seed);
  const initialPlayers = result.steps[0]?.players;

  if (!initialPlayers || initialPlayers.some((player) => player.deckCount + player.hand.length !== 45)) {
    failures.push(`Seed ${seed}: cada jugador no recibio su copia completa de 45 cartas.`);
  }

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

console.log("Mazo de 45 cartas y 30 partidas simuladas correctamente.");
