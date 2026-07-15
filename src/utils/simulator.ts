import type { BoostCard, Card, MonsterCard, SpecialCard } from "../types/cards";

type PlayerId = 1 | 2;

type BoardMonster = {
  id: string;
  card: MonsterCard;
  name: string;
  baseLife: number;
  damage: number;
  attack: number;
  defense: number;
  defenseSpent: number;
  attackBoosts: BoostCard[];
  defenseBoosts: BoostCard[];
  lifeBoosts: BoostCard[];
  skipNextAttack: boolean;
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
  skipNextAttack: boolean;
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
const isBoost = (card: Card): card is BoostCard => card.kind === "boost_attack" || card.kind === "boost_defense" || card.kind === "boost_life";
const isSpecial = (card: Card): card is SpecialCard => card.kind === "special";

const createMonster = (card: MonsterCard): BoardMonster => ({
  id: card.id,
  card,
  name: card.name.toUpperCase(),
  baseLife: card.life,
  damage: 0,
  attack: card.attack,
  defense: card.defense,
  defenseSpent: 0,
  attackBoosts: [],
  defenseBoosts: [],
  lifeBoosts: [],
  skipNextAttack: false,
});

const totalLife = (monster: BoardMonster): number => monster.baseLife + monster.lifeBoosts.reduce((total, boost) => total + boost.lifeBonus, 0);
const totalAttack = (monster: BoardMonster): number => monster.attack + monster.attackBoosts.reduce((total, boost) => total + boost.attackBonus, 0);
const totalDefense = (monster: BoardMonster): number => monster.defense + monster.defenseBoosts.reduce((total, boost) => total + boost.defenseBonus, 0);
const availableDefense = (monster: BoardMonster): number => Math.max(0, totalDefense(monster) - monster.defenseSpent);
const remainingLife = (monster: BoardMonster): number => totalLife(monster) - monster.damage;

export const resolveAttack = (attack: number, defense: number): { damage: number; spentDefense: number } => ({
  damage: Math.max(0, attack - defense),
  spentDefense: Math.min(attack, defense),
});

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
    deck: shuffle(cards, seed),
    hand: [],
    board: [],
    discard: [],
    life: 20,
  };

  draw(player, 5);

  let redraw = 0;
  while (!player.hand.some(isMonster)) {
    redraw += 1;
    player.deck = shuffle([...player.deck, ...player.hand], seed + redraw * 7);
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

const chooseStrongestTarget = (player: PlayerState): BoardMonster | undefined =>
  [...player.board].filter((monster) => !monster.skipNextAttack).sort((left, right) => totalAttack(right) - totalAttack(left))[0];

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

const movableBoost = (player: PlayerState): { source: BoardMonster; target: BoardMonster; boost: BoostCard } | null => {
  for (const source of [...player.board].sort((left, right) => remainingLife(left) - remainingLife(right))) {
    const sourceBoosts = [...source.attackBoosts, ...source.defenseBoosts, ...source.lifeBoosts];
    for (const boost of sourceBoosts) {
      const target = player.board.find((monster) => monster.id !== source.id && boostPile(monster, boost).length < 3);
      if (target) return { source, target, boost };
    }
  }
  return null;
};

const canPlaySpecial = (card: SpecialCard, active: PlayerState, rival: PlayerState): boolean => {
  switch (card.effect.type) {
    case "true_damage": return rival.board.length > 0;
    case "draw":
    case "draw_discard": return active.deck.length > 0;
    case "search_monster": return active.deck.some(isMonster);
    case "heal": return active.life < 20 || active.board.some((monster) => monster.damage > 0);
    case "move_boost": return movableBoost(active) !== null;
    case "recover_boost": return active.discard.some(isBoost);
    case "skip_attack": return rival.board.some((monster) => !monster.skipNextAttack);
  }
};

const playSpecial = (active: PlayerState, rival: PlayerState, turn: number, log: LogEvent): boolean => {
  const specialIndex = active.hand.findIndex((card) => isSpecial(card) && canPlaySpecial(card, active, rival));
  const card = active.hand[specialIndex];
  if (!card || !isSpecial(card)) return false;

  active.hand.splice(specialIndex, 1);
  const effect = card.effect;

  switch (effect.type) {
    case "true_damage": {
      const target = chooseTarget(rival);
      if (target) {
        target.damage += effect.amount;
        log(`J${active.id} usa ${card.name.toUpperCase()}: ${target.name} recibe ${effect.amount} de dano verdadero.`);
        cleanupDefeated(rival, target, log);
      }
      break;
    }
    case "draw": {
      const drawn = draw(active, effect.amount);
      log(`J${active.id} usa ${card.name.toUpperCase()} y roba ${drawn.length} cartas.`);
      break;
    }
    case "draw_discard": {
      const drawn = draw(active, effect.draw);
      const discarded: Card[] = [];
      for (let count = 0; count < effect.discard; count += 1) {
        const discardIndex = active.hand.findIndex((item) => !isMonster(item));
        const [discardedCard] = active.hand.splice(discardIndex >= 0 ? discardIndex : active.hand.length - 1, 1);
        if (discardedCard) discarded.push(discardedCard);
      }
      active.discard.unshift(...discarded);
      log(`J${active.id} usa ${card.name.toUpperCase()}, roba ${drawn.length} y descarta ${discarded.length}.`);
      break;
    }
    case "search_monster": {
      const monsterIndex = active.deck.findIndex(isMonster);
      const [monster] = active.deck.splice(monsterIndex, 1);
      if (monster) active.hand.push(monster);
      active.deck = shuffle(active.deck, turn * 97 + active.id);
      log(`J${active.id} usa ${card.name.toUpperCase()} y lleva ${monster?.name.toUpperCase() ?? "UN MONSTRUO"} a su mano.`);
      break;
    }
    case "heal": {
      const target = [...active.board].sort((left, right) => right.damage - left.damage)[0];
      if (20 - active.life >= (target?.damage ?? 0)) {
        const healed = Math.min(effect.amount, 20 - active.life);
        active.life += healed;
        log(`J${active.id} usa ${card.name.toUpperCase()} y recupera ${healed} vidas. Ahora tiene ${active.life}.`);
      } else if (target) {
        const healed = Math.min(effect.amount, target.damage);
        target.damage -= healed;
        log(`J${active.id} usa ${card.name.toUpperCase()}: ${target.name} recupera ${healed} vidas.`);
      }
      break;
    }
    case "move_boost": {
      const movement = movableBoost(active);
      if (movement) {
        const sourcePile = boostPile(movement.source, movement.boost);
        sourcePile.splice(sourcePile.indexOf(movement.boost), 1);
        boostPile(movement.target, movement.boost).push(movement.boost);
        log(`J${active.id} usa ${card.name.toUpperCase()} y mueve ${movement.boost.name.toUpperCase()} de ${movement.source.name} a ${movement.target.name}.`);
      }
      break;
    }
    case "recover_boost": {
      const boostIndex = active.discard.findIndex(isBoost);
      const [boost] = active.discard.splice(boostIndex, 1);
      if (boost) active.hand.push(boost);
      log(`J${active.id} usa ${card.name.toUpperCase()} y recupera ${boost?.name.toUpperCase() ?? "UNA MEJORA"}.`);
      break;
    }
    case "skip_attack": {
      const target = chooseStrongestTarget(rival);
      if (target) target.skipNextAttack = true;
      log(`J${active.id} usa ${card.name.toUpperCase()}: ${target?.name ?? "EL OBJETIVO"} queda atrapado y perdera su proximo ataque.`);
      break;
    }
  }

  active.discard.unshift(card);
  return true;
};

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
    defense: availableDefense(monster),
    damage: monster.damage,
    attackCards: [...monster.attackBoosts],
    defenseCards: [...monster.defenseBoosts],
    lifeCards: [...monster.lifeBoosts],
    attackBoosts: monster.attackBoosts.length,
    defenseBoosts: monster.defenseBoosts.length,
    lifeBoosts: monster.lifeBoosts.length,
    skipNextAttack: monster.skipNextAttack,
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
  playSpecial(active, rival, turn, log);

  const attackers = [...active.board];

  for (const attacker of attackers) {
    if (!active.board.some((monster) => monster.id === attacker.id)) continue;
    if (attacker.skipNextAttack) {
      attacker.skipNextAttack = false;
      log(`${attacker.name} esta atrapado en una red y no puede atacar este turno.`);
      continue;
    }
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

    const attackPower = totalAttack(attacker);
    const defense = availableDefense(target);
    const { damage, spentDefense } = resolveAttack(attackPower, defense);
    const attackerSlot = monsterSlot(active, attacker);
    const targetSlot = monsterSlot(rival, target);
    target.defenseSpent += spentDefense;
    target.damage += damage;
    const attack = { turn, player: active.id, attackerSlot, targetSlot, damage };
    attacks.push(attack);
    log(`${attacker.name} ataca a ${target.name}: ${attackPower} espadas - ${defense} escudos = ${damage} dano. Le quedan ${Math.max(0, remainingLife(target))} vidas.`, attack);
    cleanupDefeated(rival, target, log);
  }

  rival.board.forEach((monster) => { monster.defenseSpent = 0; });
  log(`Los escudos de J${rival.id} se reponen al terminar el turno.`);
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

  record(`Cada jugador mezcla su copia del mazo de ${cards.length} cartas y roba 5.`);

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
