import { SignalType, TCard } from "../types";

export const Prince: TCard = {
  level: 5,
  requires: "p",
  handlers: {
    onUse: (players, cards, [target]) => {
      const currentPlayer = players.getCurrent();

      // Countess must be played if the player has a prince or king
      if (currentPlayer.hand[0] === "countess") {
        return [
          { type: SignalType.KILL, performer: currentPlayer.name, target1: currentPlayer.name },
        ];
      }

      return [{ type: SignalType.REJECT, performer: currentPlayer.name, target1: target }];
    },
  },
};
