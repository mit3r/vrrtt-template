import { SignalType, TCard } from "../types";

export const Priest: TCard = {
  level: 2,
  requires: "p",
  handlers: {
    onUse: (players, cards, [target]) => {
      const currentPlayer = players.getCurrent();
      return [{ type: SignalType.SHOW, performer: currentPlayer.name, target1: target }];
    },
  },
};
