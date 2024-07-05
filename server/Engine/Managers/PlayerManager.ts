import { Card, TRole } from "../Classes/Card";
import { TSignal } from "../Classes/Signal";
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

  getTargetable = () => this.list.filter((p) => p.alive && !p.protected);

  current = () => this.list[this.currentPointer];
  chooseNext = () => {
    if (this.list.length === 0) throw new Error(Errors.NO_PLAYERS);

    while (true) {
      this.currentPointer = (this.currentPointer + 1) % this.list.length;
      let player = this.current();
      if (player.alive) break;
    }
  };

  whoIsNext = () => {
    let pointer = this.currentPointer;
    while (true) {
      pointer = (pointer + 1) % this.list.length;
      let player = this.list[pointer];
      if (player.alive) return player;
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

  constructor(name: string) {
    this.name = name;
    this.reset();
  }

  has = (card: TRole) => this.hand.includes(card);

  giveCard(id: TRole) {
    if (this.hand.length === 0) this.hand[0] = id;
    else if (this.hand.length === 1) this.hand[1] = id;
    else throw Error(Errors.HAND_FAULT);

    this.hand.sort((a, b) => Cards.get(a).level - Cards.get(b).level);
  }

  forUseCard<R extends TRole>(hand: R, transformer: (card: Card<R>) => TSignal[]): TSignal[] {
    // Check if player has this card
    const action_index = this.hand.findIndex((id) => id === hand);
    if (action_index === -1) throw new Error(Errors.PLAYER_DOESNT_HAVE_THIS_CARD);
    if (action_index < 0 || action_index > 1) throw new Error(Errors.HAND_FAULT);

    // Manage the order of the hand [hand, action]
    if (action_index === 0) this.hand.reverse();
    const [, action_id] = this.hand; // [hand, action]

    // Collect signals
    let signals: TSignal[] = [];

    try {
      signals = transformer(Cards.get(action_id));
    } catch (e) {
      // on error reverse the hand
      if (!hand) this.hand.reverse();
      throw e;
    }

    this.rejectActionCard();
    return signals;
  }

  forEffect(transformer: (card: Card<TRole>) => TSignal[]): TSignal[] {
    return this.effect ? transformer(Cards.get(this.effect)) : [];
  }

  forRejected(transformer: (card: Card<TRole>) => TSignal[]): TSignal[] {
    return this.rejected.map((card_id) => Cards.get(card_id)).flatMap(transformer);
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
  }
}
