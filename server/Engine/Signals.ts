import CardsEngine from "./CardsEngine";
import PlayersEngine from "./PlayersEngine";
import { Signal } from "./types";

export function collectSignals(players: PlayersEngine, cards: CardsEngine): Signal[] {
  const alive = players.getAlive();

  const signals: Signal[] = [];

  for (const player of alive) {
    // Collect effects
    if (player.rejected[0] !== null) {
      const card = cards.getCard(player.rejected[0]);

      if (card.handlers.inRejected) signals.push(...card.handlers.inRejected(players, cards));
    }

    // Collect rejected

    if (player.rejected.length > 1) {
      for (const cardId of player.rejected.slice(1) as string[]) {
        const card = cards.getCard(cardId);

        if (card.handlers.inRejected) signals.push(...card.handlers.inRejected(players, cards));
      }
    }

    // Collect hand
    for ()
  }

  return [];
}
