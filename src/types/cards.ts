export type CardKind = "monster" | "boost_attack" | "boost_defense" | "boost_life" | "special";

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

export type Card = MonsterCard | BoostCard | SpecialCard;

export type StatKey = "life" | "attack" | "defense";
