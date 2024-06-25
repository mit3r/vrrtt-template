import { SignalType, TCard } from "../types";

export const Baron: TCard = {
  level: 3,
  requires: "p",
  handlers: {
    onUse: (players, cards, [target]) => {
      const target_player = players.get(target);
      const target_card = cards.getCard(target_player.hand[0]);

      const performer = players.getCurrent().name;
      const performer_card = cards.getCard(players.getCurrent().hand[0]);

      if (performer_card.level > target_card.level) {
        return [{ type: SignalType.KILL, performer: performer, target: target }];
      }
      if (performer_card.level < target_card.level) {
        return [{ type: SignalType.KILL, performer: target, target: performer }];
      }

      return [];
    },
  },
};
