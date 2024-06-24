import PlayersEngine from "./PlayersEngine";
import StateEngine from "./StateEngine";

export class LoveLetterEngine {
  // Players
  private players = new PlayersEngine();

  // State
  private state = new StateEngine();

  constructor() {}
}
