import { SignalType, TCard } from "../types";

export const Handmaid: TCard = {
  level: 4,
  requires: "pl",
  handlers: {
    onEffect: (players, cards) => {
      const currentPlayer = players.getCurrent();

      return [{ type: SignalType.PROTECT, performer: currentPlayer.name }];
    },
  },
};
