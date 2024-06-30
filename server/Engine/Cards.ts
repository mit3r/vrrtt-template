import { LoveLetterEngine } from ".";
import { SignalType, TCard, TCardHandler, TCardHandlerUse } from "./types";
import { Errors } from "./utils/Errors";

export type CardsTypes =
  | "guard"
  | "priest"
  | "baron"
  | "handmaid"
  | "prince"
  | "king"
  | "countess"
  | "princess";

export namespace Cards {
  function validateParams(this: LoveLetterEngine, requires: string, params: string[]) {
    if (requires.length !== params.length) throw new Error(Errors.CARD_REQUIRES_MORE_PARAMS);

    for (let i = 0; i < params.length; i++) {
      switch (requires[i]) {
        case "p":
          const player = this.PlayerGet(params[i]);
          if (!player.alive) throw new Error(Errors.PLAYER_MUST_BE_ALIVE);
          break;
        case "l":
          const level = parseInt(params[i]);
          if (isNaN(level)) throw new Error(Errors.LEVEL_MUST_BE_NUMBER);
          if (level < 0 || level > 9) throw new Error(Errors.INVALID_LEVEL);
          break;
      }
    }

    return true;
  }

  const GuardOnUse: TCardHandlerUse = function (performer, [target, level]) {
    const target_player = this.PlayerGet(target);
    const target_card = get(target_player.hand[0]);

    const l = parseInt(level);
    if (l <= 0 || l > 8) throw Error(Errors.INVALID_LEVEL);

    if (l === 1) throw Error(Errors.GUARD_CANT_GUESS_ANOTHER_GUARD);

    if (target_card.level === 0)
      // Check if target is assassin
      return [{ type: SignalType.KILL, performer: performer, target1: performer }];

    // Check if guess is correct
    if (target_card.level === l)
      return [{ type: SignalType.KILL, performer: performer, target1: target }]; // Kill target

    return [];
  };

  const PriestOnUse: TCardHandlerUse = function (performer, [target]) {
    this.PlayerGet(target);
    if (performer === target) throw Error(Errors.PLAYER_CANT_USE_THEIR_SELF);

    return [{ type: SignalType.SHOW, performer: performer, target1: target }];
  };

  const BaronOnUse: TCardHandlerUse = function (performer, [target]) {
    const me = this.PlayerGet(performer);
    const my_card = get(me.hand[0]);

    const target_player = this.PlayerGet(target);
    const target_card = get(target_player.hand[0]);

    if (my_card.level > target_card.level) {
      return [{ type: SignalType.KILL, performer: performer, target1: target }];
    }
    if (my_card.level < target_card.level) {
      return [{ type: SignalType.KILL, performer: target, target1: performer }];
    }

    return [];
  };

  const HandmaidOnEffect: TCardHandler = function (performer) {
    return [{ type: SignalType.PROTECT, performer: performer }];
  };

  const PrinceOnUse: TCardHandlerUse = function (performer, [target]) {
    const me = this.PlayerGet(performer);

    // Countess must be played if the player has a prince or king
    if (me.hand[0] === "countess")
      return [{ type: SignalType.KILL, performer: performer, target1: performer }];

    return [{ type: SignalType.REJECT, performer: performer, target1: target }];
  };

  const KingOnUse: TCardHandlerUse = function (performer, []) {
    const me = this.PlayerGet(performer);

    // Countess must be played if the player has a prince or king
    if (me.hand[0] === "countess")
      return [{ type: SignalType.KILL, performer: performer, target1: performer }];

    return [{ type: SignalType.REJECT, performer: performer, target1: performer }];
  };

  const PrincessInRejected: TCardHandler = function (performer) {
    return [{ type: SignalType.KILL, performer: performer, target1: performer }];
  };

  const cardsList: Record<CardsTypes, [number, string, TCard["handlers"]]> = {
    guard: [1, "pl", { onUse: GuardOnUse }],
    priest: [2, "p", { onUse: PriestOnUse }],
    baron: [3, "p", { onUse: BaronOnUse }],
    handmaid: [4, "", { onEffect: HandmaidOnEffect }],
    prince: [5, "p", { onUse: PrinceOnUse }],
    king: [6, "", { onUse: KingOnUse }],
    countess: [7, "", {}],
    princess: [8, "", { inRejected: PrincessInRejected }],
  };

  export function get(id: CardsTypes): TCard {
    const card = cardsList[id];
    if (!card) throw new Error(Errors.CARD_NOT_FOUND);

    const [level, requires, handlers] = card;
    return { level, requires, handlers };
  }
}

export const initStack: CardsTypes[] = [
  "guard",
  "guard",
  "guard",
  "guard",
  "guard",
  "priest",
  "priest",
  "baron",
  "baron",
  "handmaid",
  "handmaid",
  "prince",
  "prince",
  "king",
  "countess",
  "princess",
];
