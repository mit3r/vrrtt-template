import { TRole } from "../types/Cards";
import { Errors } from "../utils/Errors";
import { Cards } from "./CardsUtils";

export class PlayersManager {
  private list: Player[] = [];
  private currentPointer: number;

  constructor(names: string[]) {
    if (names.length < 2 || names.length > 4) throw new Error(Errors.INVALID_PLAYERS_AMOUNT);
    if (names.length !== new Set(names).size) throw new Error(Errors.PLAYERS_MUST_BE_UNIQUE);

    this.list = names.map((name) => new Player(name));
    this.currentPointer = 0;
  }

  get = (name: string) => {
    const player = this.list.find((p) => p.name === name);
    if (!player) throw new Error(Errors.PLAYER_NOT_FOUND);
    return player;
  };

  getAll = () => this.list;
  getAlive = () => this.list.filter((p) => p.alive);

  getProtected = () => this.list.filter((p) => p.protected);
  getUnprotected = () => this.list.filter((p) => !p.protected);
  resetProtections = () => this.list.forEach((p) => (p.protected = false));

  current = () => this.list[this.currentPointer];
  chooseNext = () => {
    if (this.list.length === 0) throw new Error(Errors.NO_PLAYERS);

    while (true) {
      this.currentPointer = (this.currentPointer + 1) % this.list.length;
      let player = this.current();
      if (player.online && player.alive) break;
    }
  };

  whoIsNext = () => {
    let pointer = this.currentPointer;
    while (true) {
      pointer = (pointer + 1) % this.list.length;
      let player = this.list[pointer];
      if (player.online && player.alive) return player;
    }
  };

  resetKnown = (player: Player) => {
    for (const p of this.getAll()) {
      if (p.known[player.name] !== undefined) delete p.known[player.name];
    }
  };
}

export class Player {
  name: string;
  points: number = 0;

  hand: TRole[] = [];
  level: number = 0;
  protected: boolean = false;
  alive: boolean = true;

  rejected: TRole[] = [];
  effect: TRole | null = null;

  known: { [name: string]: TRole | null } = {};

  flattery_pointer: string | null = null;
  joke_pointer: string | null = null;

  // to deletion
  online: boolean = true;

  constructor(name: string) {
    this.name = name;
    this.reset();
  }

  giveCard(id: TRole) {
    if (this.hand.length === 0) this.hand[0] = id;
    else if (this.hand.length === 1) this.hand[1] = id;
    else throw Error(Errors.HAND_FAULT);

    this.hand.sort((a, b) => Cards.get(a).level - Cards.get(b).level);
  }

  forUseCard(hand: 0 | 1, callback: (card_id: TRole) => void) {
    if (!hand) this.hand.reverse();
    const [, action_id] = this.hand; // [hand, action]

    try {
      callback(action_id);
    } catch (e) {
      if (!hand) this.hand.reverse();
      throw e;
    }

    this.rejectActionCard();
  }

  forEffect(callback: (card_id: TRole) => void) {
    if (this.effect) callback(this.effect);
  }

  forRejected(callback: (card_id: TRole) => void) {
    this.rejected.forEach(callback);
  }

  rejectEffectCard() {
    if (this.effect) {
      this.rejected.push(this.effect);
      this.effect = null;
    }
  }

  rejectActionCard() {
    if (this.hand.length != 2) throw new Error(Errors.HAND_FAULT);

    if (Cards.get(this.hand[1]).handlers.onEffect === undefined) this.rejected.push(this.hand[1]);
    else this.effect = this.hand[1];

    this.hand.pop();
  }

  rejectHandCard(replace: TRole | null) {
    if (this.hand.length === 0) throw new Error(Errors.HAND_FAULT);

    this.rejected.push(this.hand[0]);

    if (!replace && this.alive) throw new Error(Errors.HAND_FAULT);

    this.hand[0] = replace as TRole;
  }

  kill() {
    this.alive = false;
    this.rejectEffectCard();
    this.rejectHandCard(null);
  }

  reset() {
    this.hand = [];
    this.level = 0;
    this.protected = false;
    this.alive = true;

    this.rejected = [];
    this.effect = null;
    this.known = {};

    this.flattery_pointer = null;
    this.joke_pointer = null;

    // to deletion
    this.online = true;
  }
}
