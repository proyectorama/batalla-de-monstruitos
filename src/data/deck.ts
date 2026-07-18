import rawCards from "./cards.json";
import rawSpecialCards from "./specialCards.json";
import type { Card, SpecialCard } from "../types/cards";

export const baseCards = rawCards as Card[];
export const specialCards = rawSpecialCards as SpecialCard[];
const removedMonsterIds = new Set(["m001", "m009", "m014", "m016", "m017", "m018"]);

export const cards = [...baseCards.filter((card) => !removedMonsterIds.has(card.id)), ...specialCards];

export const countsForCards = (deck: Card[]) => ({
  total: deck.length,
  monsters: deck.filter((card) => card.kind === "monster").length,
  boosts: deck.filter((card) => card.kind === "boost_attack" || card.kind === "boost_defense" || card.kind === "boost_life").length,
  specials: deck.filter((card) => card.kind === "special").length,
  attackBoosts: deck.filter((card) => card.kind === "boost_attack").length,
  defenseBoosts: deck.filter((card) => card.kind === "boost_defense").length,
  lifeBoosts: deck.filter((card) => card.kind === "boost_life").length,
});

export const cardCounts = countsForCards(cards);
