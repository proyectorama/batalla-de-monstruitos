import type { BoostCard, Card, MonsterCard } from "../types/cards";

type PlayerId = 1 | 2;

type BoardMonster = {
  id: string;
  name: string;
  baseLife: number;
  damage: number;
  attack: number;
  defense: number;
  attackBoosts: BoostCard[];
  defenseBoosts: BoostCard[];
  lifeBoosts: BoostCard[];
};

type PlayerState = {
  id: PlayerId;
  deck: Card[];
  hand: Card[];
  board: BoardMonster[];
  discard: Card[];
  points: number;
};

export type SimulationResult = {
  winner: PlayerId | null;
  turns: number;
  log: string[];
  playerOnePoints: number;
  playerTwoPoints: number;
  finalBoards: SimulationBoard[];
  attacks: SimulationAttack[];
};

export type SimulationMonster = {
  slot: number;
  name: string;
  life: number;
  attack: number;
  defense: number;
  damage: number;
  attackBoosts: number;
  defenseBoosts: number;
  lifeBoosts: number;
};

export type SimulationBoard = {
  player: PlayerId;
  points: number;
  monsters: SimulationMonster[];
};

export type SimulationAttack = {
  turn: number;
  player: PlayerId;
  attackerSlot: number;
  targetSlot: number;
  damage: number;
};

const isMonster = (card: Card): card is MonsterCard => card.kind === "monster";
const isBoost = (card: Card): card is BoostCard => card.kind !== "monster";

const createMonster = (card: MonsterCard): BoardMonster => ({
  id: card.id,
  name: card.name.toUpperCase(),
  baseLife: card.life,
  damage: 0,
  attack: card.attack,
  defense: card.defense,
  attackBoosts: [],
  defenseBoosts: [],
  lifeBoosts: [],
});

const totalLife = (monster: BoardMonster): number => monster.baseLife + monster.lifeBoosts.reduce((total, boost) => total + boost.lifeBonus, 0);
const totalAttack = (monster: BoardMonster): number => monster.attack + monster.attackBoosts.reduce((total, boost) => total + boost.attackBonus, 0);
const totalDefense = (monster: BoardMonster): number => monster.defense + monster.defenseBoosts.reduce((total, boost) => total + boost.defenseBonus, 0);
const remainingLife = (monster: BoardMonster): number => totalLife(monster) - monster.damage;

const boostPile = (monster: BoardMonster, boost: BoostCard): BoostCard[] => {
  if (boost.kind === "boost_attack") return monster.attackBoosts;
  if (boost.kind === "boost_defense") return monster.defenseBoosts;
  return monster.lifeBoosts;
};

const shuffle = (items: Card[], seed: number): Card[] => {
  const shuffled = [...items];
  let value = seed;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) % 4294967296;
    const swapIndex = value % (index + 1);
    const current = shuffled[index];
    const swap = shuffled[swapIndex];

    if (current && swap) {
      shuffled[index] = swap;
      shuffled[swapIndex] = current;
    }
  }

  return shuffled;
};

const draw = (player: PlayerState, amount: number): void => {
  for (let count = 0; count < amount; count += 1) {
    const card = player.deck.shift();

    if (card) {
      player.hand.push(card);
    }
  }
};

const preparePlayer = (id: PlayerId, cards: Card[], seed: number): PlayerState => {
  const player: PlayerState = {
    id,
    deck: shuffle(cards.filter((card) => card.deck === id), seed),
    hand: [],
    board: [],
    discard: [],
    points: 0,
  };

  draw(player, 5);

  if (!player.hand.some(isMonster)) {
    player.deck = shuffle([...player.deck, ...player.hand], seed + 7);
    player.hand = [];
    draw(player, 5);
  }

  return player;
};

const playMonster = (player: PlayerState, log: string[]): void => {
  if (player.board.length >= 3) {
    return;
  }

  const monsterIndex = player.hand.findIndex(isMonster);
  const card = player.hand[monsterIndex];

  if (!card || !isMonster(card)) {
    return;
  }

  player.hand.splice(monsterIndex, 1);
  player.board.push(createMonster(card));
  log.push(`J${player.id} baja ${card.name.toUpperCase()} a la zona ${player.board.length}.`);
};

const playBoost = (player: PlayerState, log: string[]): boolean => {
  const boostIndex = player.hand.findIndex((card) => isBoost(card) && player.board.some((monster) => boostPile(monster, card).length < 3));
  const card = player.hand[boostIndex];

  if (!card || !isBoost(card)) {
    return false;
  }

  const target = player.board.find((monster) => boostPile(monster, card).length < 3);

  if (!target) {
    return false;
  }

  player.hand.splice(boostIndex, 1);
  boostPile(target, card).push(card);
  log.push(`J${player.id} pone ${card.name.toUpperCase()} en ${target.name}.`);
  return true;
};

const chooseAttacker = (player: PlayerState): BoardMonster | undefined =>
  [...player.board].sort((left, right) => totalAttack(right) - totalAttack(left))[0];

const chooseTarget = (player: PlayerState): BoardMonster | undefined =>
  [...player.board].sort((left, right) => remainingLife(left) - remainingLife(right))[0];

const cleanupDefeated = (attacker: PlayerState, defender: PlayerState, target: BoardMonster, log: string[]): void => {
  if (remainingLife(target) > 0) {
    return;
  }

  defender.board = defender.board.filter((monster) => monster.id !== target.id);
  attacker.points += 1;
  log.push(`${target.name} queda sin vida. J${attacker.id} gana 1 punto (${attacker.points}/3).`);
};

const monsterSlot = (player: PlayerState, monster: BoardMonster): number => player.board.findIndex((item) => item.id === monster.id) + 1;

const boardView = (player: PlayerState): SimulationBoard => ({
  player: player.id,
  points: player.points,
  monsters: player.board.map((monster, index) => ({
    slot: index + 1,
    name: monster.name,
    life: Math.max(0, remainingLife(monster)),
    attack: totalAttack(monster),
    defense: totalDefense(monster),
    damage: monster.damage,
    attackBoosts: monster.attackBoosts.length,
    defenseBoosts: monster.defenseBoosts.length,
    lifeBoosts: monster.lifeBoosts.length,
  })),
});

const takeTurn = (active: PlayerState, rival: PlayerState, turn: number, log: string[], attacks: SimulationAttack[]): void => {
  log.push(`Turno ${turn}: J${active.id}.`);
  draw(active, 1);
  playMonster(active, log);
  for (let count = 0; count < 3; count += 1) {
    if (!playBoost(active, log)) break;
  }

  const attackers = [...active.board];

  for (const attacker of attackers) {
    if (!active.board.some((monster) => monster.id === attacker.id)) continue;
    const target = chooseTarget(rival);

    if (!target) {
      log.push(`J${active.id} no tiene objetivo para ${attacker.name}.`);
      return;
    }

    const damage = Math.max(1, totalAttack(attacker) - totalDefense(target));
    const attackerSlot = monsterSlot(active, attacker);
    const targetSlot = monsterSlot(rival, target);
    target.damage += damage;
    attacks.push({ turn, player: active.id, attackerSlot, targetSlot, damage });
    log.push(`${attacker.name} ataca a ${target.name}: ✦ ${totalAttack(attacker)} - ⬟ ${totalDefense(target)} = ${damage} dano. Le quedan ${Math.max(0, remainingLife(target))} vidas.`);
    cleanupDefeated(active, rival, target, log);
  }
};

const canContinue = (player: PlayerState): boolean => player.points < 3 && (player.board.length > 0 || player.hand.some(isMonster) || player.deck.some(isMonster));

export const simulateGame = (cards: Card[], seed: number): SimulationResult => {
  const log: string[] = [];
  const attacks: SimulationAttack[] = [];
  const playerOne = preparePlayer(1, cards, seed + 1);
  const playerTwo = preparePlayer(2, cards, seed + 2);

  while (playerOne.board.length < 3) {
    const before = playerOne.board.length;
    playMonster(playerOne, log);
    if (playerOne.board.length === before) break;
  }

  while (playerTwo.board.length < 3) {
    const before = playerTwo.board.length;
    playMonster(playerTwo, log);
    if (playerTwo.board.length === before) break;
  }

  let winner: PlayerId | null = null;
  let turns = 0;

  for (turns = 1; turns <= 80; turns += 1) {
    const active = turns % 2 === 1 ? playerOne : playerTwo;
    const rival = turns % 2 === 1 ? playerTwo : playerOne;
    takeTurn(active, rival, turns, log, attacks);

    if (active.points >= 3) {
      winner = active.id;
      break;
    }

    if (!canContinue(rival)) {
      winner = active.id;
      log.push(`J${rival.id} se queda sin monstruos disponibles.`);
      break;
    }
  }

  const finalTurns = Math.min(turns, 80);
  log.push(winner ? `Gana J${winner} en ${finalTurns} turnos.` : "La partida llego al limite de turnos.");

  return {
    winner,
    turns: finalTurns,
    log,
    playerOnePoints: playerOne.points,
    playerTwoPoints: playerTwo.points,
    finalBoards: [boardView(playerOne), boardView(playerTwo)],
    attacks,
  };
};
