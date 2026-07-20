import type { NpcActionCard, NpcBossCard, NpcCreatureId, NpcMinionCard } from "../types/cards";

export type SpecialCreatureDefinition = {
  id: NpcCreatureId;
  boss: NpcBossCard;
  actions: NpcActionCard[];
  minions: NpcMinionCard[];
};

export const dragonBoss: NpcBossCard = {
  id: "npc-boss-dragon-volcan",
  name: "Dragón del Volcán",
  kind: "npc_boss",
  creatureId: "dragon-volcan",
  difficulty: "normal",
  soloLife: 55,
  twoPlayerLife: 85,
  extraPlayerLife: 20,
  maxFury: 5,
  passiveRule: "Cuando recibe 5 o más daño en una ronda, gana 1 Furia.",
  rule: "Criatura especial inicial. Usa una fila pública de 3 cartas y resuelve la carta de la izquierda en su turno.",
};

export const giantBoss: NpcBossCard = {
  id: "npc-boss-monstruo-gigante",
  name: "Monstruo Gigante Ancestral",
  kind: "npc_boss",
  creatureId: "monstruo-gigante",
  difficulty: "hard",
  soloLife: 90,
  twoPlayerLife: 140,
  extraPlayerLife: 28,
  maxFury: 6,
  passiveRule: "Piel Colosal: reduce en 2 cada ataque recibido, mínimo 0. Empieza con 1 Furia.",
  rule: "Criatura especial difícil. Más vida, más Furia y castigo superior por ronda.",
};

export const npcMinions: NpcMinionCard[] = [
  { id: "npc-minion-cria-dragon", name: "Cría de Dragón", kind: "npc_minion", creatureId: "dragon-volcan", life: 3, attack: 2, rule: "Mientras viva, absorbe el primer ataque dirigido al jefe." },
  { id: "npc-minion-roca-viva", name: "Roca Viva", kind: "npc_minion", creatureId: "monstruo-gigante", life: 4, attack: 3, rule: "Mientras viva, el Monstruo Gigante reduce 1 daño adicional por ronda." },
];

const sharedActions: NpcActionCard[] = [
  { id: "npc-shared-rugido", name: "Rugido Aterrador", kind: "npc_action", creatureId: "shared", phase: "control", rule: "Cada jugador descarta 1 carta si puede.", priority: "Todos los jugadores, en orden de turno.", effect: { type: "discard", amount: 1 } },
  { id: "npc-shared-furia", name: "La Bestia se Enfurece", kind: "npc_action", creatureId: "shared", phase: "control", rule: "La criatura gana 2 Furia.", priority: "No elige objetivo.", effect: { type: "fury", amount: 2 } },
  { id: "npc-shared-golpe", name: "Golpe Brutal", kind: "npc_action", creatureId: "shared", phase: "attack", rule: "Hace 3 daño al jugador con menos vida. Con Furia 3+, hace 4.", priority: "Jugador con menos vida; empate: orden de turno.", furyBonusAt: 3, effect: { type: "direct_damage", amount: 3, target: "lowest_life_player" } },
];

export const dragonActions: NpcActionCard[] = [
  { id: "npc-dragon-aliento", name: "Aliento de Fuego", kind: "npc_action", creatureId: "dragon-volcan", phase: "attack", rule: "Hace 2 daño a cada jugador. Con Furia 3+, hace 3.", priority: "Todos los jugadores.", furyBonusAt: 3, effect: { type: "direct_damage", amount: 4, target: "all_players" } },
  { id: "npc-dragon-garra", name: "Garra Colosal", kind: "npc_action", creatureId: "dragon-volcan", phase: "attack", rule: "Hace 4 daño al monstruito con más ataque.", priority: "Monstruito con más ataque; empate: jugador con menos vida.", effect: { type: "monster_damage", amount: 7, target: "highest_attack_monster" } },
  { id: "npc-dragon-escamas", name: "Escamas de Obsidiana", kind: "npc_action", creatureId: "dragon-volcan", phase: "defense", rule: "La criatura gana 3 escudos temporales hasta su próximo turno.", priority: "No elige objetivo.", effect: { type: "shield", amount: 3 } },
  { id: "npc-dragon-cria", name: "Nido Ardiente", kind: "npc_action", creatureId: "dragon-volcan", phase: "summon", rule: "Invoca una Cría de Dragón.", priority: "Si ya hay amenaza, gana 1 Furia.", effect: { type: "summon", minionId: "npc-minion-cria-dragon" } },
  { id: "npc-dragon-tesoro", name: "Tesoro Ardiente", kind: "npc_action", creatureId: "dragon-volcan", phase: "reward", rule: "Si sobrevive hasta el turno del jefe, la criatura gana 2 Furia.", priority: "No elige objetivo.", effect: { type: "fury", amount: 2 } },
  ...sharedActions,
];

export const giantActions: NpcActionCard[] = [
  { id: "npc-giant-pisoton", name: "Pisotón Sísmico", kind: "npc_action", creatureId: "monstruo-gigante", phase: "attack", rule: "Hace 3 daño a cada jugador. Con Furia 3+, hace 4.", priority: "Todos los jugadores.", furyBonusAt: 3, effect: { type: "direct_damage", amount: 4, target: "all_players" } },
  { id: "npc-giant-mano", name: "Manotazo de Montaña", kind: "npc_action", creatureId: "monstruo-gigante", phase: "attack", rule: "Hace 5 daño al monstruito con más ataque. Con Furia 4+, hace 6.", priority: "Monstruito con más ataque; empate: jugador con menos vida.", furyBonusAt: 4, effect: { type: "monster_damage", amount: 7, target: "highest_attack_monster" } },
  { id: "npc-giant-piel", name: "Piel Colosal", kind: "npc_action", creatureId: "monstruo-gigante", phase: "defense", rule: "La criatura gana 5 escudos temporales hasta su próximo turno.", priority: "No elige objetivo.", effect: { type: "shield", amount: 5 } },
  { id: "npc-giant-roca", name: "Rocas Vivientes", kind: "npc_action", creatureId: "monstruo-gigante", phase: "summon", rule: "Invoca una Roca Viva.", priority: "Si ya hay amenaza, gana 1 Furia.", effect: { type: "summon", minionId: "npc-minion-roca-viva" } },
  { id: "npc-giant-temblor", name: "Temblor Infinito", kind: "npc_action", creatureId: "monstruo-gigante", phase: "control", rule: "La criatura gana 2 Furia y hace 2 daño al jugador con menos vida.", priority: "Jugador con menos vida; empate: orden de turno.", effect: { type: "fury", amount: 2 } },
  ...sharedActions,
];

export const specialCreatures: SpecialCreatureDefinition[] = [
  { id: "dragon-volcan", boss: dragonBoss, actions: dragonActions, minions: npcMinions.filter((item) => item.creatureId === "dragon-volcan") },
  { id: "monstruo-gigante", boss: giantBoss, actions: giantActions, minions: npcMinions.filter((item) => item.creatureId === "monstruo-gigante") },
];

export const specialCreatureCards = specialCreatures.flatMap((creature) => [creature.boss, ...creature.actions, ...creature.minions]);
export const getSpecialCreature = (id: NpcCreatureId): SpecialCreatureDefinition => {
  const creature = specialCreatures.find((item) => item.id === id);
  if (!creature) throw new Error(`Criatura especial desconocida: ${id}`);
  return creature;
};
