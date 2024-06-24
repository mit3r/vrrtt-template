import { TCard } from "./types";

export default class CardsEngine {
  cardsBase: Record<string, TCard> = {
    guard: { level: 1, actions: {} },
    priest: { level: 2, actions: {} },
    baron: { level: 3, actions: {} },
    handmaid: { level: 4, actions: {} },
    prince: { level: 5, actions: {} },
    king: { level: 6, actions: {} },
    countess: { level: 7, actions: {} },
    princess: { level: 8, actions: {} },
  };

  private stack: TCard[] = [];
}
