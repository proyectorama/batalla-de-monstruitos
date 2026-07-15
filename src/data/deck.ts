import rawCards from "./cards.json";
import rawSpecialCards from "./specialCards.json";
import type { Card, SpecialCard } from "../types/cards";

export type DeckMode = "base" | "special-powers";

export type ExpansionDefinition = {
  id: Exclude<DeckMode, "base">;
  name: string;
  shortName: string;
  description: string;
  removedCardIds: string[];
  cards: SpecialCard[];
};

export const baseCards = rawCards as Card[];
export const specialCards = rawSpecialCards as SpecialCard[];

export const expansions: ExpansionDefinition[] = [
  {
    id: "special-powers",
    name: "Poderes especiales",
    shortName: "Especiales",
    description: "Retira 6 monstruos, suma 11 poderes y juega con un mazo de 50 cartas.",
    removedCardIds: ["m001", "m009", "m014", "m016", "m017", "m018"],
    cards: specialCards,
  },
];

export const expansionById = Object.fromEntries(expansions.map((expansion) => [expansion.id, expansion])) as Record<Exclude<DeckMode, "base">, ExpansionDefinition>;

export const deckForMode = (mode: DeckMode): Card[] => {
  if (mode === "base") return baseCards;
  const expansion = expansionById[mode];
  const removed = new Set(expansion.removedCardIds);
  return [...baseCards.filter((card) => !removed.has(card.id)), ...expansion.cards];
};

export const cards = deckForMode("special-powers");

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
