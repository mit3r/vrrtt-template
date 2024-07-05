import { TRole } from "./Classes/Card";
import { TState } from "./Classes/State";
import { Gameplay } from "./Managers/Gameplay";
import { PlayersManager } from "./Managers/PlayerManager";
import { StackManager } from "./Managers/StackManager";
import { State } from "./Managers/State";
import { Errors } from "./utils/Errors";

export class GameEngine {
  emit: (state: TState) => void = () => {};

  winner: string | null = null;
  round: number = 0;

  players: PlayersManager;
  stack: StackManager;

  constructor(names: string[], debug: boolean = false, stack: TRole[] | undefined = undefined) {
    this.stack = new StackManager(stack, !debug);
    this.players = new PlayersManager(names);

    // each player gets a card
    this.players.getAll().forEach((player) => {
      const card = this.stack.pop();
      if (card) player.giveCard(card);
    });

    // first player
    this.players.current().giveCard(this.stack.pop() as TRole);

    // emit current state
    if (!debug) this.emit(State.get.bind(this)());
  }

  playTurn(who: string, hand: TRole, params: string[]) {
    let state: TState;
    try {
      state = this.handle(who, hand, params);
    } catch (error: any) {
      throw error;
    }

    this.emit(state);
  }

  handle(who: string, hand: TRole, params: string[]): TState {
    // check if it's the player's turn
    if (this.players.current().name !== who) throw new Error(Errors.NOT_PLAYER_TURN);

    // play the turn
    let currentPlayer = this.players.current();
    if (Gameplay.ProccesActionCard.bind(this)(hand, params)) return State.get.bind(this)();

    this.players.resetKnown(currentPlayer);
    this.players.resetProtections();
    if (Gameplay.ProccesEffectsAndRejected.bind(this)()) return State.get.bind(this)();

    // change player
    this.players.chooseNext();
    currentPlayer = this.players.current();

    currentPlayer.giveCard(this.stack.pop() as TRole);
    currentPlayer.rejectEffectCard();

    // emit current state
    return State.get.bind(this)();
  }
}
