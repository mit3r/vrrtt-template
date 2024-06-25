import { SignalType, TCard } from "../types";

export const Guard: TCard = {
  level: 1,
  requires: "pl",
  handlers: {
    onUse: (players, cards, [target, level]) => {
      const target_player = players.get(target);
      const target_card = cards.getCard(target_player.hand[0]);

      const performer = players.getCurrent().name;

      // Check if target is not assassin
      if (target_card.level === 0) {
        return [
          { type: SignalType.PROTECT, performer: target }, // Protect target
          { type: SignalType.KILL, performer: performer, target: performer }, // Kill performer
        ];
      }

      // Check if guess is correct
      if (target_card.level === parseInt(level)) {
        return [{ type: SignalType.KILL, performer: performer, target: target }]; // Kill target
      }

      return [];
    },
  },
};
