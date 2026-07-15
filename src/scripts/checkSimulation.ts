import { baseCards, deckForMode, specialCards, type DeckMode } from "../data/deck";
import { resolveAttack, simulateGame } from "../utils/simulator";

const failures: string[] = [];

const expectedCounts: Record<DeckMode, Record<string, number>> = {
  base: { monster: 18, boost_attack: 9, boost_defense: 9, boost_life: 9, special: 0 },
  "special-powers": { monster: 12, boost_attack: 9, boost_defense: 9, boost_life: 9, special: 11 },
};

const blockedAttack = resolveAttack(2, 5);
if (blockedAttack.damage !== 0 || blockedAttack.spentDefense !== 2) failures.push("Un escudo debe poder bloquear todo el dano sin forzar un minimo de 1.");

const brokenShield = resolveAttack(5, 2);
if (brokenShield.damage !== 3 || brokenShield.spentDefense !== 2) failures.push("El ataque debe gastar el escudo y causar solo el dano excedente.");

for (const mode of ["base", "special-powers"] as const) {
  const cards = deckForMode(mode);
  const expectedTotal = mode === "base" ? 45 : 50;

  if (cards.length !== expectedTotal) failures.push(`${mode}: el mazo tiene ${cards.length} cartas en lugar de ${expectedTotal}.`);

  for (const [kind, expected] of Object.entries(expectedCounts[mode])) {
    const actual = cards.filter((card) => card.kind === kind).length;
    if (actual !== expected) failures.push(`${mode}: hay ${actual} cartas ${kind} en lugar de ${expected}.`);
  }

  if (new Set(cards.map((card) => card.id)).size !== cards.length) failures.push(`${mode}: el mazo contiene identificadores repetidos.`);

  for (let seed = 1; seed <= 60; seed += 1) {
    const result = simulateGame(cards, seed);
    const initialPlayers = result.steps[0]?.players;

    if (!initialPlayers || initialPlayers.some((player) => player.deckCount + player.hand.length !== expectedTotal)) {
      failures.push(`${mode}, seed ${seed}: cada jugador no recibio su mazo completo.`);
    }
    if (initialPlayers?.some((player) => !player.hand.some((card) => card.kind === "monster"))) {
      failures.push(`${mode}, seed ${seed}: una mano inicial no contiene monstruos.`);
    }
    if (result.turns > 80) failures.push(`${mode}, seed ${seed}: supero el limite de turnos.`);
    if (result.playerOneLife < 0 || result.playerTwoLife < 0 || result.playerOneLife > 20 || result.playerTwoLife > 20) failures.push(`${mode}, seed ${seed}: vidas invalidas.`);
    if (!result.winner && result.turns < 80) failures.push(`${mode}, seed ${seed}: termino sin ganador antes del limite.`);
  }
}

if (baseCards.some((card) => card.kind === "special")) failures.push("El juego base no debe contener cartas especiales.");
if (specialCards.some((card) => card.kind !== "special")) failures.push("La expansion contiene una carta que no es especial.");

if (failures.length > 0) throw new Error(failures.join("\n"));

console.log("Juego base de 45 cartas y expansion de 50 verificadas en 120 partidas.");
