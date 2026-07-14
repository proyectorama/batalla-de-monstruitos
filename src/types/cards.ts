export type CardKind = "monster" | "boost_attack" | "boost_defense" | "boost_life";

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

export type Card = MonsterCard | BoostCard;

export type StatKey = "life" | "attack" | "defense";
