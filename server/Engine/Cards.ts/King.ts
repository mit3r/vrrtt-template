import { SignalType, TCard } from "../types";

export const King: TCard = {
  level: 6,
  requires: "",
  handlers: {
    onUse: (players, cards, []) => {
      const performer = players.getCurrent();

      // Countess must be played if the player has a prince or king
      if (performer.hand[0] === "countess") {
        return [{ type: SignalType.KILL, performer: performer.name, target1: performer.name }];
      }

      return [{ type: SignalType.CHANGE, performer: performer.name, target1: performer.name }];
    },
  },
};
