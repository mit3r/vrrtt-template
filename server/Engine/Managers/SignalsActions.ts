import { GameEngine } from "../GameEngine";
import { TRole } from "../Classes/Card";
import { Signal, TSignal } from "../Classes/Signal";
import { Errors } from "../utils/Errors";

export const SignalsActions: Record<Signal, (this: GameEngine, signal: TSignal) => void> = {
  [Signal.PROTECT]: function (this, signal) {
    const player = this.players.get(signal.performer);
    if (!player.alive) throw new Error(Errors.PLAYER_MUST_BE_ALIVE);
    player.protected = true;
  },

  [Signal.SHOW]: function (this, signal) {
    if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
    if (signal.target1 === signal.performer) return;

    const performer = this.players.get(signal.performer);
    const target = this.players.get(signal.target1);

    performer.known[target.name] = target.hand[0];
  },

  [Signal.REJECT]: function (this, signal) {
    if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
    // Don't be so strict XD
    // if (signal.target1 === signal.performer) throw new Error(Errors.PLAYER_CANT_USE_THEIR_SELF);

    const target = this.players.get(signal.target1);

    const card = this.stack.pop();

    target.rejectHandCard(card as TRole);
  },

  [Signal.KILL]: function (this, signal) {
    if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);

    const performer = this.players.get(signal.performer);
    if (!performer.alive) throw new Error(Errors.PLAYER_MUST_BE_ALIVE);

    const target = this.players.get(signal.target1);

    target.kill();
    // console.log(target.name, "killed", signal.target1);
    // console.log(target.name, target.alive);
  },

  [Signal.SWAP]: function (this, signal) {
    if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
    if (signal.target2 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);

    const player1 = this.players.get(signal.target1);
    const player2 = this.players.get(signal.target2);

    const hand1 = player1.hand[0];
    const hand2 = player2.hand[0];

    player1.hand[0] = hand2;
    player2.hand[0] = hand1;
  },

  [Signal.POINT]: function (this, signal) {
    const player = this.players.get(signal.performer);
    player.points += 1;
  },

  [Signal.LEVEL]: function (this, signal) {
    const player = this.players.get(signal.performer);

    player.level += 1;
  },

  [Signal.FLATTERY]: function (this, signal) {
    // Flattery has effect only on next turn
    if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);

    const next = this.players.whoIsNext();
    next.flattery_pointer = signal.target1;
  },

  [Signal.JOKE]: function (this, signal) {
    // Joke has effect only on the end of the game
    if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
    const player = this.players.get(signal.performer);

    player.joke_pointer = signal.target1;
  },
};
