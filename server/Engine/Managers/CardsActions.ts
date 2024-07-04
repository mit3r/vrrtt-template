import { TCard, TOtherCallback, TRole, TUseCallback } from "../types/Cards";
import { SignalType } from "../types/Signals";
import { Errors } from "../utils/Errors";
import { Cards } from "./CardsUtils";

const GuardOnUse: TUseCallback<"guard"> = function (performer, [target, level]) {
  const target_card = Cards.get(target.hand[0]);

  if (level <= 0 || level > 8) throw Error(Errors.INVALID_LEVEL);
  if (level === 1) throw Error(Errors.GUARD_CANT_GUESS_ANOTHER_GUARD);

  // Check if target is assassin
  if (target_card.level === 0)
    return [{ type: SignalType.KILL, performer: performer.name, target1: performer.name }];

  // Check if guess is correct
  if (target_card.level === level)
    return [{ type: SignalType.KILL, performer: performer.name, target1: target.name }];

  return [];
};

const PriestOnUse: TUseCallback<"priest"> = function (performer, [target]) {
  if (performer === target) throw Error(Errors.PLAYER_CANT_USE_THEIR_SELF);

  return [{ type: SignalType.SHOW, performer: performer.name, target1: target.name }];
};

const BaronOnUse: TUseCallback<"baron"> = function (performer, [target]) {
  const my_card = Cards.get(performer.hand[0]);
  const target_card = Cards.get(target.hand[0]);

  if (my_card.level > target_card.level)
    return [{ type: SignalType.KILL, performer: performer.name, target1: target.name }];

  if (my_card.level < target_card.level)
    return [{ type: SignalType.KILL, performer: target.name, target1: performer.name }];

  return [];
};

const HandmaidOnEffect: TOtherCallback = function (performer) {
  return [{ type: SignalType.PROTECT, performer: performer.name }];
};

const PrinceOnUse: TUseCallback<"prince"> = function (performer, [target]) {
  // Countess must be played if the player has a prince or king
  if (performer.hand[0] === "countess")
    return [{ type: SignalType.KILL, performer: performer.name, target1: performer.name }];

  return [{ type: SignalType.REJECT, performer: performer.name, target1: target.name }];
};

const KingOnUse: TUseCallback<"king"> = function (performer, []) {
  // Countess must be played if the player has a prince or king
  if (performer.hand[0] === "countess")
    return [{ type: SignalType.KILL, performer: performer.name, target1: performer.name }];

  return [{ type: SignalType.REJECT, performer: performer.name, target1: performer.name }];
};

const PrincessInRejected: TOtherCallback = function (performer) {
  return [{ type: SignalType.KILL, performer: performer.name, target1: performer.name }];
};

export const cardsList: Record<
  TRole,
  [TCard<TRole>["level"], TCard<TRole>["requires"], TCard<TRole>["handlers"]]
> = {
  guard: [1, "pl", { onUse: GuardOnUse }],
  priest: [2, "p", { onUse: PriestOnUse }],
  baron: [3, "p", { onUse: BaronOnUse }],
  handmaid: [4, "", { onEffect: HandmaidOnEffect }],
  prince: [5, "p", { onUse: PrinceOnUse }],
  king: [6, "", { onUse: KingOnUse }],
  countess: [7, "", {}],
  princess: [8, "", { onRejected: PrincessInRejected }],
};
