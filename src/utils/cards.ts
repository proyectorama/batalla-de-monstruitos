import type { Card, StatKey } from "../types/cards";

export const kindLabel = (kind: Card["kind"]): string => {
  switch (kind) {
    case "monster":
      return "Monstruo";
    case "boost_attack":
      return "Mejora ataque";
    case "boost_defense":
      return "Mejora defensa";
    case "boost_life":
      return "Mejora vida";
    case "special":
      return "Especial";
    case "npc_boss":
      return "Criatura especial";
    case "npc_action":
      return "Acción NPC";
    case "npc_minion":
      return "Amenaza NPC";
  }
};

export const statLabel = (stat: StatKey): string => {
  switch (stat) {
    case "life":
      return "Vida";
    case "attack":
      return "Ataque";
    case "defense":
      return "Defensa";
  }
};

export const chunkCards = (items: Card[], size: number): Card[][] => {
  const chunks: Card[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};
