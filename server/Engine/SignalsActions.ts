import { LoveLetterEngine } from ".";
import { Signal, SignalType } from "./types";
import { Errors } from "./utils/Errors";

export const SignalsActions: Record<SignalType, (this: LoveLetterEngine, signal: Signal) => void> =
  {
    [SignalType.PROTECT]: function (this, signal) {
      const player = this.PlayerGet(signal.performer);
      if (!player.alive) throw new Error(Errors.PLAYER_MUST_BE_ALIVE);
      player.protected = true;
    },

    [SignalType.SHOW]: function (this, signal) {
      if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
      if (signal.target1 === signal.performer) return;

      const performer = this.PlayerGet(signal.performer);

      performer.known[signal.target1] = this.PlayerGet(signal.target1).hand[0];
    },

    [SignalType.REJECT]: function (this, signal) {
      if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
      // Don't be so strict XD
      // if (signal.target1 === signal.performer) throw new Error(Errors.PLAYER_CANT_USE_THEIR_SELF);

      const target = this.PlayerGet(signal.target1);
      target.rejected.push(target.hand[0]);

      const card = this.StackPop();

      if (card === undefined) return; // exception
      target.hand[0] = card;
    },

    [SignalType.KILL]: function (this, signal) {
      if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);

      const performer = this.PlayerGet(signal.performer);
      if (!performer.alive) throw new Error(Errors.PLAYER_MUST_BE_ALIVE);

      const target = this.PlayerGet(signal.target1);

      target.alive = false;
      console.log(target.name, "killed", signal.target1);
      console.log(target.name, target.alive);
    },

    [SignalType.SWAP]: function (this, signal) {
      if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
      if (signal.target2 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);

      const player1 = this.PlayerGet(signal.target1);
      const player2 = this.PlayerGet(signal.target2);

      const hand1 = player1.hand[0];
      const hand2 = player2.hand[0];

      player1.hand[0] = hand2;
      player2.hand[0] = hand1;
    },

    [SignalType.POINT]: function (this, signal) {
      const player = this.PlayerGet(signal.performer);
      player.points += 1;
    },

    [SignalType.LEVEL]: function (this, signal) {
      const player = this.PlayerGet(signal.performer);

      player.level += 1;
    },

    [SignalType.FLATTERY]: function (this, signal) {
      if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
      const player = this.PlayerGet(signal.performer);

      player.flattery_pointer = signal.target1;
    },

    [SignalType.JOKE]: function (this, signal) {
      if (signal.target1 === undefined) throw new Error(Errors.CORUPTED_SIGNAL);
      const player = this.PlayerGet(signal.performer);

      player.joke_pointer = signal.target1;
    },
  };
