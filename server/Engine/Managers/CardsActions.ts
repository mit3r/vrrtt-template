import { Card, TOtherCallback, TRole, TUseCallback } from "../Classes/Card";
import { Signal } from "../Classes/Signal";
import { Errors } from "../utils/Errors";
import { Cards } from "./CardsUtils";

const GuardOnUse: TUseCallback<"guard"> = function (performer, [target, level]) {
  const target_card = Cards.get(target.hand[0]);

  if (level < 0 || level > 8) throw Error(Errors.INVALID_LEVEL);
  if (level === 1) throw Error(Errors.GUARD_CANT_GUESS_ANOTHER_GUARD);

  // Check if target is assassin
  if (target_card.level === 0)
    return [{ type: Signal.KILL, performer: performer.name, target1: performer.name }];

  // Check if guess is correct
  if (target_card.level === level)
    return [{ type: Signal.KILL, performer: performer.name, target1: target.name }];

  return [];
};

const PriestOnUse: TUseCallback<"priest"> = function (performer, [target]) {
  return [{ type: Signal.SHOW, performer: performer.name, target1: target.name }];
};

const BaronOnUse: TUseCallback<"baron"> = function (performer, [target]) {
  const my_card = Cards.get(performer.hand[0]);
  const target_card = Cards.get(target.hand[0]);

  if (my_card.level > target_card.level)
    return [{ type: Signal.KILL, performer: performer.name, target1: target.name }];

  if (my_card.level < target_card.level)
    return [{ type: Signal.KILL, performer: target.name, target1: performer.name }];

  return [];
};

const HandmaidOnEffect: TOtherCallback = function (performer) {
  return [{ type: Signal.PROTECT, performer: performer.name }];
};

const PrinceOnUse: TUseCallback<"prince"> = function (performer, [target]) {
  // Countess must be played if the player has a prince or king
  if (performer.hand[0] === "countess")
    return [{ type: Signal.KILL, performer: performer.name, target1: performer.name }];

  return [{ type: Signal.REJECT, performer: performer.name, target1: target.name }];
};

const KingOnUse: TUseCallback<"king"> = function (performer, [target]) {
  // Countess must be played if the player has a prince or king
  if (performer.hand[0] === "countess")
    return [{ type: Signal.KILL, performer: performer.name, target1: performer.name }];

  return [
    { type: Signal.SWAP, performer: performer.name, target1: performer.name, target2: target.name },
  ];
};

const PrincessInRejected: TOtherCallback = function (performer) {
  return [{ type: Signal.KILL, performer: performer.name, target1: performer.name }];
};

export const cardsMap = new Map<TRole, Card<TRole>>([
  ["guard", new Card("guard", 1, false, "pl", { onUse: GuardOnUse })],
  ["priest", new Card("priest", 2, false, "p", { onUse: PriestOnUse })],
  ["baron", new Card("baron", 3, false, "p", { onUse: BaronOnUse })],
  ["handmaid", new Card("handmaid", 4, false, "", { onEffect: HandmaidOnEffect })],
  ["prince", new Card("prince", 5, true, "p", { onUse: PrinceOnUse })],
  ["king", new Card("king", 6, false, "p", { onUse: KingOnUse })],
  ["countess", new Card("countess", 7, false, "", {})],
  ["princess", new Card("princess", 8, false, "", { onRejected: PrincessInRejected })],
]);
