import { SignalType, TCard } from "../types";

export const Princess: TCard = {
  level: 8,
  requires: "",
  handlers: {
    inRejected: (players, cards) => {
      const { name } = players.getCurrent();
      return [{ type: SignalType.KILL, performer: name, target1: name }];
    },
  },
};
