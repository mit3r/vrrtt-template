import { Cards } from "../Managers/CardsUtils";
import { Errors } from "../utils/Errors";
import { Card, TRole } from "./Card";
import { TSignal } from "./Signal";

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
