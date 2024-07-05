import { LoveLetterBase } from "./base";
import { Roles } from "./Managers/CardsUtils";
import { Gameplay } from "./Managers/Gameplay";
import { State } from "./Managers/State";
import { TState } from "./types";

export class LoveLetterEngine extends LoveLetterBase {
  emit: (state: TState) => void = () => {};

  winner: string | null = null;
  round = 0;

  constructor(names: string[], debug: boolean = false, stack: Roles[] = []) {
    super(names);

    if (debug) this.stack = stack;

    // each player gets a card
    Gameplay.DealCards.bind(this)();

    // first player
    Gameplay.DealSecondCard.bind(this)(this.PlayerGetCurrent());

    // emit current state
    if (!debug) this.emit(State.get.bind(this)());
  }

  playTurn(who: string, hand: 0 | 1, params: string[]) {
    // check if it's the player's turn
    if (!this.PlayerAuthorize(who)) {
      return;
    }

    // check if targets are protected
    Gameplay.IsNotTargetProtected.bind(this)(params);
    Gameplay.ClearProtection.bind(this)();

    // play the turn
    let currentPlayer = this.PlayerGetCurrent();
    Gameplay.ProccesActionCard.bind(this)(hand, params);

    // collect effects
    Gameplay.ProccesEffects & Rejected.bind(this)();

    // reset protected

    if (Gameplay.CheckWin.bind(this)()) {
      this.emit(State.get.bind(this)());
      return;
    }

    // change player
    this.PlayerChooseNext();
    currentPlayer = this.PlayerGetCurrent();

    Gameplay.DealSecondCard.bind(this)(currentPlayer);
    Gameplay.DropEffectCard.bind(this)(currentPlayer);
    Gameplay.ResetKnown.bind(this)(currentPlayer);

    // emit current state
    this.emit(State.get.bind(this)());
  }
}
