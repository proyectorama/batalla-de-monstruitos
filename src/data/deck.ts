import rawCards from "./cards.json";
import type { Card } from "../types/cards";

export const cards = rawCards as Card[];

export const deckOne = cards.filter((card) => card.deck === 1);
export const deckTwo = cards.filter((card) => card.deck === 2);

export const cardCounts = {
  total: cards.length,
  monsters: cards.filter((card) => card.kind === "monster").length,
  boosts: cards.filter((card) => card.kind !== "monster").length,
  attackBoosts: cards.filter((card) => card.kind === "boost_attack").length,
  defenseBoosts: cards.filter((card) => card.kind === "boost_defense").length,
  lifeBoosts: cards.filter((card) => card.kind === "boost_life").length,
};
