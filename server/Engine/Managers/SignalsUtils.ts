import { GameEngine } from "../GameEngine";
import { Card, roles, TRole } from "../Classes/Card";
import { Signal, TSignal } from "../Classes/Signal";
import { Errors } from "../utils/Errors";
import { Cards } from "./CardsUtils";
import { SignalsActions } from "./SignalsActions";

export namespace SignalsUtils {
  export function validateSignal(this: GameEngine, signal: TSignal): boolean {
    const hasPerformer = signal.performer !== undefined;
    const hasTarget1 = signal.target1 !== undefined;
    const hasTarget2 = signal.target2 !== undefined;

    const performer = this.players.get(signal.performer);
    if (performer === undefined) throw new Error(Errors.CORUPTED_SIGNAL);

    const hasFlattery = performer.flattery_pointer !== null;
    const hasJoke = performer.joke_pointer !== null;

    if (!hasPerformer) return false;

    switch (signal.type) {
      case Signal.PROTECT:
        return true;
      case Signal.SHOW:
        return hasTarget1;
      case Signal.REJECT:
        return hasTarget1;
      case Signal.KILL:
        return hasTarget1;
      case Signal.SWAP:
        return hasTarget1 && hasTarget2;
      case Signal.POINT:
        return true;
      case Signal.LEVEL:
        return true;
      case Signal.FLATTERY:
        return hasFlattery;
      case Signal.JOKE:
        return hasJoke;

      default:
        return false;
    }
  }

  export function collectEnd(this: GameEngine): TSignal[] {
    // todo: extensionn
    return [];
  }

  export function process(this: GameEngine, signals: TSignal[]): void {
    for (const signal of signals) {
      if (!validateSignal.bind(this)(signal)) throw new Error(Errors.CORUPTED_SIGNAL);
      SignalsActions[signal.type as Signal].bind(this)(signal);
    }
  }
}
