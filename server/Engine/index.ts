import CardsEngine from "./CardsEngine";
import PlayersEngine from "./PlayersEngine";
import StateEngine from "./StateEngine";

export class LoveLetterEngine {
  players = new PlayersEngine();
  cards = new CardsEngine();
  state = new StateEngine();

  private emit: () => void;

  constructor(names: string[], emit: () => void) {
    this.players.add(names);

    emit();
  }
}
