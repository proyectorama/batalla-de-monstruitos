import { cards as classicCards, getSpecialCreature } from "../data/deck";
import type { BoostCard, Card, MonsterCard, NpcActionCard, NpcBossCard, NpcCreatureId, NpcMinionCard } from "../types/cards";

type PlayerId = 1 | 2;
type NpcWinner = "players" | "creature" | null;

type BoardMonster = {
  id: string;
  card: MonsterCard;
  damage: number;
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

type BossState = {
  card: NpcBossCard;
  deck: NpcActionCard[];
  threatRow: NpcActionCard[];
  discard: NpcActionCard[];
  minions: NpcMinionCard[];
  life: number;
  maxLife: number;
  fury: number;
  shield: number;
};

export type NpcSimulationMonster = {
  slot: number;
  card: MonsterCard;
  life: number;
  totalLife: number;
  attack: number;
  defense: number;
};

export type NpcSimulationPlayer = {
  player: PlayerId;
  life: number;
  hand: Card[];
  deckCount: number;
  discard: Card[];
  board: NpcSimulationMonster[];
};

export type NpcBossView = {
  card: NpcBossCard;
  life: number;
  maxLife: number;
  fury: number;
  shield: number;
  deckCount: number;
  discard: NpcActionCard[];
  threatRow: NpcActionCard[];
  minions: NpcMinionCard[];
};

export type NpcSimulationStep = {
  round: number;
  active: "setup" | `player-${PlayerId}` | "creature" | "end";
  message: string;
  log: string[];
  boss: NpcBossView;
  players: NpcSimulationPlayer[];
  winner: NpcWinner;
};

export type NpcSimulationResult = {
  creatureId: NpcCreatureId;
  playerCount: 1 | 2;
  winner: NpcWinner;
  rounds: number;
  steps: NpcSimulationStep[];
  log: string[];
  bossLife: number;
  playerLives: number[];
};

const isMonster = (card: Card): card is MonsterCard => card.kind === "monster";
const isBoost = (card: Card): card is BoostCard => card.kind === "boost_attack" || card.kind === "boost_defense" || card.kind === "boost_life";

const shuffle = <T,>(items: T[], seed: number): T[] => {
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

const createMonster = (card: MonsterCard): BoardMonster => ({ id: `${card.id}-${Math.random()}`, card, damage: 0, attackBoosts: [], defenseBoosts: [], lifeBoosts: [] });
const totalLife = (monster: BoardMonster) => monster.card.life + monster.lifeBoosts.reduce((total, boost) => total + boost.lifeBonus, 0);
const totalAttack = (monster: BoardMonster) => monster.card.attack + monster.attackBoosts.reduce((total, boost) => total + boost.attackBonus, 0);
const totalDefense = (monster: BoardMonster) => monster.card.defense + monster.defenseBoosts.reduce((total, boost) => total + boost.defenseBonus, 0);
const remainingLife = (monster: BoardMonster) => totalLife(monster) - monster.damage;

const preparePlayer = (id: PlayerId, seed: number): PlayerState => {
  const player: PlayerState = { id, deck: shuffle(classicCards, seed), hand: [], board: [], discard: [], life: 20 };
  draw(player, 5);
  let redraw = 0;
  while (!player.hand.some(isMonster)) {
    redraw += 1;
    player.deck = shuffle([...player.deck, ...player.hand], seed + redraw * 13);
    player.hand = [];
    draw(player, 5);
  }
  return player;
};

const boostPile = (monster: BoardMonster, boost: BoostCard): BoostCard[] => {
  if (boost.kind === "boost_attack") return monster.attackBoosts;
  if (boost.kind === "boost_defense") return monster.defenseBoosts;
  return monster.lifeBoosts;
};

const playSetupMonster = (player: PlayerState): string | null => {
  if (player.board.length >= 3) return null;
  const index = player.hand.findIndex(isMonster);
  const card = player.hand[index];
  if (!card || !isMonster(card)) return null;
  player.hand.splice(index, 1);
  player.board.push(createMonster(card));
  return `J${player.id} baja ${card.name.toUpperCase()}.`;
};

const playPlayerTurn = (player: PlayerState, boss: BossState): string[] => {
  const messages: string[] = [];
  const drawn = draw(player, 1)[0];
  messages.push(drawn ? `J${player.id} roba ${drawn.name.toUpperCase()}.` : `J${player.id} no tiene cartas para robar.`);
  const setup = playSetupMonster(player);
  if (setup) messages.push(setup);

  for (let count = 0; count < 2; count += 1) {
    const boostIndex = player.hand.findIndex((card) => isBoost(card) && player.board.some((monster) => boostPile(monster, card).length < 3));
    const boost = player.hand[boostIndex];
    const target = boost && isBoost(boost) ? player.board.find((monster) => boostPile(monster, boost).length < 3) : undefined;
    if (!boost || !isBoost(boost) || !target) break;
    player.hand.splice(boostIndex, 1);
    boostPile(target, boost).push(boost);
    messages.push(`J${player.id} mejora ${target.card.name.toUpperCase()} con ${boost.name.toUpperCase()}.`);
  }

  for (const monster of [...player.board]) {
    const rawAttack = totalAttack(monster);
    const passiveReduction = boss.card.creatureId === "monstruo-gigante" ? 2 : 0;
    const shieldReduction = Math.min(boss.shield, Math.max(0, rawAttack - passiveReduction));
    boss.shield -= shieldReduction;
    const damage = Math.max(0, rawAttack - passiveReduction - shieldReduction);
    boss.life = Math.max(0, boss.life - damage);
    messages.push(`${monster.card.name.toUpperCase()} ataca a ${boss.card.name.toUpperCase()}: ${rawAttack} ataque, ${passiveReduction + shieldReduction} bloqueado, ${damage} daño. Vida jefe ${boss.life}/${boss.maxLife}.`);
    if (boss.life <= 0) break;
  }
  return messages;
};

const allMonsters = (players: PlayerState[]): { player: PlayerState; monster: BoardMonster }[] => players.flatMap((player) => player.board.map((monster) => ({ player, monster })));

const defeatMonsterIfNeeded = (player: PlayerState, monster: BoardMonster): string | null => {
  if (remainingLife(monster) > 0) return null;
  player.board = player.board.filter((item) => item.id !== monster.id);
  player.discard.unshift(monster.card, ...monster.attackBoosts, ...monster.defenseBoosts, ...monster.lifeBoosts);
  return `${monster.card.name.toUpperCase()} queda derrotado y va al descarte.`;
};

const resolveCreatureTurn = (boss: BossState, players: PlayerState[]): string[] => {
  boss.shield = 0;
  const messages: string[] = [];
  const action = boss.threatRow.shift();
  if (!action) {
    boss.fury = Math.min(boss.card.maxFury, boss.fury + 2);
    messages.push(`${boss.card.name.toUpperCase()} no tiene acción revelada y gana 2 Furia.`);
  } else {
    const furyBonus = action.furyBonusAt !== undefined && boss.fury >= action.furyBonusAt ? 1 : 0;
    messages.push(`${boss.card.name.toUpperCase()} resuelve ${action.name.toUpperCase()}: ${action.rule}`);
    const effect = action.effect;
    switch (effect.type) {
      case "direct_damage": {
        const amount = effect.amount + furyBonus;
        const targets = effect.target === "all_players" ? players : [[...players].sort((a, b) => a.life - b.life || a.id - b.id)[0]].filter((item): item is PlayerState => Boolean(item));
        targets.forEach((target) => {
          target.life = Math.max(0, target.life - amount);
          messages.push(`J${target.id} recibe ${amount} daño. Queda en ${target.life}/20.`);
        });
        break;
      }
      case "monster_damage": {
        const target = allMonsters(players).sort((a, b) => totalAttack(b.monster) - totalAttack(a.monster) || a.player.life - b.player.life)[0];
        const amount = effect.amount + furyBonus;
        if (target) {
          const blocked = Math.min(amount, totalDefense(target.monster));
          const damage = Math.max(0, amount - blocked);
          target.monster.damage += damage;
          messages.push(`${target.monster.card.name.toUpperCase()} recibe ${amount} daño, bloquea ${blocked}, pierde ${damage} vida.`);
          const defeated = defeatMonsterIfNeeded(target.player, target.monster);
          if (defeated) messages.push(defeated);
        } else {
          const player = [...players].sort((a, b) => a.life - b.life || a.id - b.id)[0];
          if (player) {
            player.life = Math.max(0, player.life - amount);
            messages.push(`Sin monstruitos: J${player.id} recibe ${amount} daño directo.`);
          }
        }
        break;
      }
      case "shield":
        boss.shield = effect.amount + furyBonus;
        messages.push(`${boss.card.name.toUpperCase()} gana ${boss.shield} escudos temporales.`);
        break;
      case "fury":
        boss.fury = Math.min(boss.card.maxFury, boss.fury + effect.amount);
        messages.push(`${boss.card.name.toUpperCase()} sube a Furia ${boss.fury}/${boss.card.maxFury}.`);
        break;
      case "summon": {
        const creature = getSpecialCreature(boss.card.creatureId);
        const minion = creature.minions.find((item) => item.id === effect.minionId);
        if (minion) {
          boss.minions.push(minion);
          messages.push(`${boss.card.name.toUpperCase()} invoca ${minion.name.toUpperCase()}.`);
        } else {
          boss.fury = Math.min(boss.card.maxFury, boss.fury + 1);
        }
        break;
      }
      case "discard":
        players.forEach((player) => {
          const discarded = player.hand.shift();
          if (discarded) player.discard.unshift(discarded);
          messages.push(`J${player.id} descarta ${discarded?.name.toUpperCase() ?? "nada"}.`);
        });
        break;
    }
    boss.discard.unshift(action);
  }

  while (boss.threatRow.length < 3) {
    const next = boss.deck.shift();
    if (next) {
      boss.threatRow.push(next);
    } else if (boss.discard.length > 0) {
      boss.deck = shuffle(boss.discard, boss.fury + boss.life + boss.threatRow.length);
      boss.discard = [];
      boss.fury = Math.min(boss.card.maxFury, boss.fury + 2);
      messages.push(`El mazo NPC se remezcla y ${boss.card.name.toUpperCase()} gana 2 Furia.`);
    } else {
      boss.fury = Math.min(boss.card.maxFury, boss.fury + 2);
      break;
    }
  }

  return messages;
};

const bossView = (boss: BossState): NpcBossView => ({ card: boss.card, life: boss.life, maxLife: boss.maxLife, fury: boss.fury, shield: boss.shield, deckCount: boss.deck.length, discard: [...boss.discard], threatRow: [...boss.threatRow], minions: [...boss.minions] });
const playerView = (player: PlayerState): NpcSimulationPlayer => ({
  player: player.id,
  life: player.life,
  hand: [...player.hand],
  deckCount: player.deck.length,
  discard: [...player.discard],
  board: player.board.map((monster, index) => ({ slot: index + 1, card: monster.card, life: Math.max(0, remainingLife(monster)), totalLife: totalLife(monster), attack: totalAttack(monster), defense: totalDefense(monster) })),
});

export const simulateNpcGame = (creatureId: NpcCreatureId, seed: number, playerCount: 1 | 2 = 2): NpcSimulationResult => {
  const creature = getSpecialCreature(creatureId);
  const maxLife = playerCount === 1 ? creature.boss.soloLife : creature.boss.twoPlayerLife;
  const boss: BossState = { card: creature.boss, deck: shuffle(creature.actions, seed + 77), threatRow: [], discard: [], minions: [], life: maxLife, maxLife, fury: creature.boss.creatureId === "monstruo-gigante" ? 1 : 0, shield: 0 };
  while (boss.threatRow.length < 3) {
    const action = boss.deck.shift();
    if (action) boss.threatRow.push(action);
  }
  const players = Array.from({ length: playerCount }, (_, index) => preparePlayer((index + 1) as PlayerId, seed + index + 1));
  const log: string[] = [];
  const steps: NpcSimulationStep[] = [];
  let round = 0;
  let winner: NpcWinner = null;
  let active: NpcSimulationStep["active"] = "setup";

  const record = (message: string) => {
    log.push(message);
    steps.push({ round, active, message, log: [...log], boss: bossView(boss), players: players.map(playerView), winner });
  };

  record(`Se prepara Criaturas especiales: ${creature.boss.name.toUpperCase()} con fila pública de 3 cartas.`);
  players.forEach((player) => {
    while (player.board.length < 2) {
      const message = playSetupMonster(player);
      if (!message) break;
      record(message);
    }
  });

  for (round = 1; round <= 40; round += 1) {
    for (const player of players) {
      active = `player-${player.id}`;
      record(`Ronda ${round}: turno de J${player.id}.`);
      for (const message of playPlayerTurn(player, boss)) record(message);
      if (boss.life <= 0) {
        winner = "players";
        active = "end";
        record(`Los jugadores derrotan a ${boss.card.name.toUpperCase()} en la ronda ${round}.`);
        return { creatureId, playerCount, winner, rounds: round, steps, log, bossLife: boss.life, playerLives: players.map((player) => player.life) };
      }
    }

    active = "creature";
    record(`Ronda ${round}: turno de ${boss.card.name.toUpperCase()}.`);
    for (const message of resolveCreatureTurn(boss, players)) record(message);
    if (players.every((player) => player.life <= 0)) {
      winner = "creature";
      active = "end";
      record(`${boss.card.name.toUpperCase()} derrota a todos los jugadores.`);
      return { creatureId, playerCount, winner, rounds: round, steps, log, bossLife: boss.life, playerLives: players.map((player) => player.life) };
    }
  }

  winner = "creature";
  active = "end";
  record(`${boss.card.name.toUpperCase()} resiste hasta el límite de rondas.`);
  return { creatureId, playerCount, winner, rounds: 40, steps, log, bossLife: boss.life, playerLives: players.map((player) => player.life) };
};
