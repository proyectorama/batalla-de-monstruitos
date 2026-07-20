export type CardKind = "monster" | "boost_attack" | "boost_defense" | "boost_life" | "special" | "npc_boss" | "npc_action" | "npc_minion";

export type BodyShape = "blob" | "round" | "drop" | "cloud" | "star" | "jelly" | "shell" | "sprout";

export type ArtFeature = "horns" | "antenna" | "wings" | "feet" | "spots" | "tail" | "tuft" | "cheeks";

export type MonsterArt = {
  body: BodyShape;
  color: string;
  accent: string;
  eyeCount: 1 | 2 | 3;
  features: ArtFeature[];
};

export type BoostArt = {
  icon: "cookie" | "spark" | "shield" | "leaf" | "heart" | "potion";
  color: string;
  accent: string;
};

export type MonsterCard = {
  id: string;
  name: string;
  kind: "monster";
  life: number;
  attack: number;
  defense: number;
  art: MonsterArt;
};

export type BoostCard = {
  id: string;
  name: string;
  kind: "boost_attack" | "boost_defense" | "boost_life";
  attackBonus: number;
  defenseBonus: number;
  lifeBonus: number;
  rule: string;
  art: BoostArt;
};

export type SpecialEffect =
  | { type: "true_damage"; amount: number }
  | { type: "draw"; amount: number }
  | { type: "draw_discard"; draw: number; discard: number }
  | { type: "search_monster" }
  | { type: "heal"; amount: number }
  | { type: "move_boost" }
  | { type: "recover_boost" }
  | { type: "skip_attack" };

export type SpecialArt =
  | "double_swords"
  | "crossed_swords"
  | "two_cards"
  | "three_cards_discard"
  | "monster_search"
  | "three_hearts"
  | "three_hearts_spark"
  | "move_boost"
  | "recover_card"
  | "web"
  | "web_trap";

export type SpecialCard = {
  id: string;
  name: string;
  kind: "special";
  rule: string;
  effect: SpecialEffect;
  art: SpecialArt;
};


export type NpcCreatureId = "dragon-volcan" | "monstruo-gigante";

export type NpcActionEffect =
  | { type: "direct_damage"; amount: number; target: "all_players" | "lowest_life_player" }
  | { type: "monster_damage"; amount: number; target: "highest_attack_monster" | "lowest_life_monster" }
  | { type: "shield"; amount: number }
  | { type: "fury"; amount: number }
  | { type: "summon"; minionId: string }
  | { type: "discard"; amount: number };

export type NpcBossCard = {
  id: string;
  name: string;
  kind: "npc_boss";
  creatureId: NpcCreatureId;
  difficulty: "normal" | "hard";
  soloLife: number;
  twoPlayerLife: number;
  extraPlayerLife: number;
  maxFury: number;
  passiveRule: string;
  rule: string;
};

export type NpcActionCard = {
  id: string;
  name: string;
  kind: "npc_action";
  creatureId: NpcCreatureId | "shared";
  phase: "attack" | "defense" | "control" | "summon" | "reward";
  furyBonusAt?: number;
  rule: string;
  priority: string;
  effect: NpcActionEffect;
};

export type NpcMinionCard = {
  id: string;
  name: string;
  kind: "npc_minion";
  creatureId: NpcCreatureId;
  life: number;
  attack: number;
  rule: string;
};

export type Card = MonsterCard | BoostCard | SpecialCard | NpcBossCard | NpcActionCard | NpcMinionCard;

export type StatKey = "life" | "attack" | "defense";
