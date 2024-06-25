import { Actions, Responses } from "./Cards";
import { EventsType, RequestType, TCard, TRequest } from "./types";
import { Errors } from "./utils/Errors";

export default class CardsEngine {
  private readonly cardsBase: Record<string, TCard> = {
    assasin: {
      level: 0,
      actions: null,
      requires: "",
      response: Responses.Assasin,
    },
    guard: {
      level: 1,
      requires: "pl",
      actions: Actions.Guard,
      response: null,
    },
    priest: { level: 2, actions: Actions.Priest, requires: "p", response: {} },
    baron: { level: 3, actions: {}, requires: "p", response: {} },
    handmaid: { level: 4, actions: {}, requires: "", response: {} },
    prince: { level: 5, actions: {}, requires: "p", response: {} },
    king: { level: 6, actions: {}, requires: "p", response: {} },
    countess: { level: 7, actions: {}, requires: "", response: {} },
    princess: { level: 8, actions: {}, requires: "", response: {} },
  };

  private stack: string[] = [
    "guard",
    "guard",
    "guard",
    "guard",
    "guard",
    "priest",
    "priest",
    "baron",
    "baron",
    "handmaid",
    "handmaid",
    "prince",
    "prince",
    "king",
    "countess",
    "princess",
  ].sort(() => Math.random() - 0.5);

  popCard = () => {
    if (this.stack.length === 0) return null;

    this.stack.pop();
  };

  getCard = (id: string) => {
    const card = this.cardsBase[id];
    if (!card) throw new Error(Errors.CARD_NOT_FOUND);

    return card;
  };
}
