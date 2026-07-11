import type { BoostCard, Card, MonsterCard } from "../types/cards";

type PlayerId = 1 | 2;

type BoardMonster = {
  id: string;
  card: MonsterCard;
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
  life: number;
};

export type SimulationResult = {
  winner: PlayerId | null;
  turns: number;
  log: string[];
  playerOneLife: number;
  playerTwoLife: number;
  finalBoards: SimulationBoard[];
  attacks: SimulationAttack[];
  steps: SimulationStep[];
};

export type SimulationMonster = {
  slot: number;
  card: MonsterCard;
  name: string;
  life: number;
  totalLife: number;
  attack: number;
  defense: number;
  damage: number;
  attackCards: BoostCard[];
  defenseCards: BoostCard[];
  lifeCards: BoostCard[];
  attackBoosts: number;
  defenseBoosts: number;
  lifeBoosts: number;
};

export type SimulationBoard = {
  player: PlayerId;
  life: number;
  monsters: SimulationMonster[];
};

export type SimulationAttack = {
  turn: number;
  player: PlayerId;
  attackerSlot: number;
  targetSlot: number | null;
  damage: number;
};

export type SimulationDiscard = {
  player: PlayerId;
  monsterSlot: number;
  cards: Card[];
};

export type SimulationPlayer = {
  player: PlayerId;
  life: number;
  board: SimulationBoard;
  hand: Card[];
  deckCount: number;
  discard: Card[];
};

export type SimulationStep = {
  turn: number;
  activePlayer: PlayerId | null;
  message: string;
  log: string[];
  players: [SimulationPlayer, SimulationPlayer];
  attack: SimulationAttack | null;
  discarded: SimulationDiscard | null;
  winner: PlayerId | null;
};

type LogEvent = (message: string, attack?: SimulationAttack | null, discarded?: SimulationDiscard | null) => void;

const isMonster = (card: Card): card is MonsterCard => card.kind === "monster";
const isBoost = (card: Card): card is BoostCard => card.kind !== "monster";

const createMonster = (card: MonsterCard): BoardMonster => ({
  id: card.id,
  card,
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

const draw = (player: PlayerState, amount: number): Card[] => {
  const drawn: Card[] = [];

  for (let count = 0; count < amount; count += 1) {
    const card = player.deck.shift();

    if (card) {
      player.hand.push(card);
      drawn.push(card);
    }
  }

  return drawn;
};

const preparePlayer = (id: PlayerId, cards: Card[], seed: number): PlayerState => {
  const player: PlayerState = {
    id,
    deck: shuffle(cards.filter((card) => card.deck === id), seed),
    hand: [],
    board: [],
    discard: [],
    life: 20,
  };

  draw(player, 5);

  if (!player.hand.some(isMonster)) {
    player.deck = shuffle([...player.deck, ...player.hand], seed + 7);
    player.hand = [];
    draw(player, 5);
  }

  return player;
};

const playMonster = (player: PlayerState, log: LogEvent): void => {
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
  log(`J${player.id} baja ${card.name.toUpperCase()} a la zona ${player.board.length}.`);
};

const playBoost = (player: PlayerState, log: LogEvent): boolean => {
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
  log(`J${player.id} pone ${card.name.toUpperCase()} en ${target.name}.`);
  return true;
};

const chooseAttacker = (player: PlayerState): BoardMonster | undefined =>
  [...player.board].sort((left, right) => totalAttack(right) - totalAttack(left))[0];

const chooseTarget = (player: PlayerState): BoardMonster | undefined =>
  [...player.board].sort((left, right) => remainingLife(left) - remainingLife(right))[0];

const cleanupDefeated = (defender: PlayerState, target: BoardMonster, log: LogEvent): void => {
  if (remainingLife(target) > 0) {
    return;
  }

  const monsterSlot = defender.board.findIndex((monster) => monster.id === target.id) + 1;
  const discardedCards = [target.card, ...target.attackBoosts, ...target.defenseBoosts, ...target.lifeBoosts];

  defender.board = defender.board.filter((monster) => monster.id !== target.id);
  defender.discard.unshift(...discardedCards);
  log(`${target.name} queda sin vida y va al descarte con sus mejoras.`, null, { player: defender.id, monsterSlot, cards: discardedCards });
};

const monsterSlot = (player: PlayerState, monster: BoardMonster): number => player.board.findIndex((item) => item.id === monster.id) + 1;

const boardView = (player: PlayerState): SimulationBoard => ({
  player: player.id,
  life: player.life,
  monsters: player.board.map((monster, index) => ({
    slot: index + 1,
    card: monster.card,
    name: monster.name,
    life: Math.max(0, remainingLife(monster)),
    totalLife: totalLife(monster),
    attack: totalAttack(monster),
    defense: totalDefense(monster),
    damage: monster.damage,
    attackCards: [...monster.attackBoosts],
    defenseCards: [...monster.defenseBoosts],
    lifeCards: [...monster.lifeBoosts],
    attackBoosts: monster.attackBoosts.length,
    defenseBoosts: monster.defenseBoosts.length,
    lifeBoosts: monster.lifeBoosts.length,
  })),
});

const playerView = (player: PlayerState): SimulationPlayer => ({
  player: player.id,
  life: player.life,
  board: boardView(player),
  hand: [...player.hand],
  deckCount: player.deck.length,
  discard: [...player.discard],
});

const takeTurn = (active: PlayerState, rival: PlayerState, turn: number, log: LogEvent, attacks: SimulationAttack[]): void => {
  log(`Turno ${turn}: J${active.id}.`);
  const drawn = draw(active, 1);
  log(drawn[0] ? `J${active.id} roba ${drawn[0].name.toUpperCase()}.` : `J${active.id} no tiene cartas para robar.`);
  playMonster(active, log);
  for (let count = 0; count < 3; count += 1) {
    if (!playBoost(active, log)) break;
  }

  const attackers = [...active.board];

  for (const attacker of attackers) {
    if (!active.board.some((monster) => monster.id === attacker.id)) continue;
    const target = chooseTarget(rival);

    if (!target) {
      const directDamage = totalAttack(attacker);
      const attackerSlot = monsterSlot(active, attacker);
      rival.life = Math.max(0, rival.life - directDamage);
      const attack = { turn, player: active.id, attackerSlot, targetSlot: null, damage: directDamage };
      attacks.push(attack);
      log(`${attacker.name} no encuentra monstruos y pega directo: ${directDamage} dano a J${rival.id}. Le quedan ${rival.life} vidas.`, attack);
      continue;
    }

    const damage = Math.max(1, totalAttack(attacker) - totalDefense(target));
    const attackerSlot = monsterSlot(active, attacker);
    const targetSlot = monsterSlot(rival, target);
    target.damage += damage;
    const attack = { turn, player: active.id, attackerSlot, targetSlot, damage };
    attacks.push(attack);
    log(`${attacker.name} ataca a ${target.name}: ${totalAttack(attacker)} espadas - ${totalDefense(target)} escudos = ${damage} dano. Le quedan ${Math.max(0, remainingLife(target))} vidas.`, attack);
    cleanupDefeated(rival, target, log);
  }
};

export const simulateGame = (cards: Card[], seed: number): SimulationResult => {
  const log: string[] = [];
  const steps: SimulationStep[] = [];
  const attacks: SimulationAttack[] = [];
  const playerOne = preparePlayer(1, cards, seed + 1);
  const playerTwo = preparePlayer(2, cards, seed + 2);
  let activePlayer: PlayerId | null = null;
  let currentTurn = 0;
  let winner: PlayerId | null = null;

  const record: LogEvent = (message, attack = null, discarded = null) => {
    log.push(message);
    steps.push({
      turn: currentTurn,
      activePlayer,
      message,
      log: [...log],
      players: [playerView(playerOne), playerView(playerTwo)],
      attack,
      discarded,
      winner,
    });
  };

  record("Se mezclan los mazos y ambos jugadores roban 5 cartas.");

  while (playerOne.board.length < 3) {
    const before = playerOne.board.length;
    activePlayer = 1;
    playMonster(playerOne, record);
    if (playerOne.board.length === before) break;
  }

  while (playerTwo.board.length < 3) {
    const before = playerTwo.board.length;
    activePlayer = 2;
    playMonster(playerTwo, record);
    if (playerTwo.board.length === before) break;
  }

  let turns = 0;

  for (turns = 1; turns <= 80; turns += 1) {
    currentTurn = turns;
    const active = turns % 2 === 1 ? playerOne : playerTwo;
    const rival = turns % 2 === 1 ? playerTwo : playerOne;
    activePlayer = active.id;
    takeTurn(active, rival, turns, record, attacks);

    if (rival.life <= 0) {
      winner = active.id;
      break;
    }
  }

  const finalTurns = Math.min(turns, 80);
  activePlayer = null;
  currentTurn = finalTurns;
  record(winner ? `Gana J${winner} en ${finalTurns} turnos.` : "La partida llego al limite de turnos.");

  return {
    winner,
    turns: finalTurns,
    log,
    playerOneLife: playerOne.life,
    playerTwoLife: playerTwo.life,
    finalBoards: [boardView(playerOne), boardView(playerTwo)],
    attacks,
    steps,
  };
};
