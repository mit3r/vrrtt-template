import { Cards } from "./Cards";
import { LoveLetterEngine } from "./index";
import { SignalsActions } from "./SignalsActions";
import { Signal, SignalType } from "./types";
import { Errors } from "./utils/Errors";

export namespace SignalsUtils {
  export function validate(this: LoveLetterEngine, signal: Signal): boolean {
    const hasPerformer = signal.performer !== undefined;
    const hasTarget1 = signal.target1 !== undefined;
    const hasTarget2 = signal.target2 !== undefined;

    const performer = this.PlayerGet(signal.performer);
    const hasFlattery = performer.flattery_pointer !== null;
    const hasJoke = performer.joke_pointer !== null;

    if (!hasPerformer) return false;

    switch (signal.type) {
      case SignalType.PROTECT:
        return true;
      case SignalType.SHOW:
        return hasTarget1;
      case SignalType.REJECT:
        return hasTarget1;
      case SignalType.KILL:
        return hasTarget1;
      case SignalType.SWAP:
        return hasTarget1 && hasTarget2;
      case SignalType.POINT:
        return true;
      case SignalType.LEVEL:
        return true;
      case SignalType.FLATTERY:
        return hasFlattery;
      case SignalType.JOKE:
        return hasJoke;

      default:
        return false;
    }
  }

  export function collectEffects(this: LoveLetterEngine): Signal[] {
    const signals: Signal[] = [];

    for (const performer of this.PlayersGetAll()) {
      if (performer.effect === null) continue;

      const handler = Cards.get(performer.effect).handlers.onEffect;
      if (handler === undefined) continue;

      signals.push(...handler.bind(this)(performer.name));
    }
    return signals;
  }

  export function collectUse(
    this: LoveLetterEngine,
    performer: string,
    params: string[]
  ): Signal[] {
    const signals: Signal[] = [];
    const handler = Cards.get(this.PlayerGet(performer).hand[1]).handlers.onUse;
    if (handler === undefined) return [];

    signals.push(...handler.bind(this)(performer, params));
    return signals;
  }

  export function collectRejected(this: LoveLetterEngine): Signal[] {
    const signals: Signal[] = [];

    for (const performer of this.PlayersGetAll()) {
      if (!performer.alive) continue;

      for (const card_id of performer.rejected) {
        const handler = Cards.get(card_id).handlers.inRejected;
        if (handler === undefined) continue;

        signals.push(...handler.bind(this)(performer.name));
      }
    }

    return signals;
  }

  export function collectEnd(this: LoveLetterEngine): Signal[] {
    // todo: extensionn
    return [];
  }

  export function process(this: LoveLetterEngine, signals: Signal[]): void {
    for (const signal of signals) {
      if (!validate.bind(this)(signal)) throw new Error(Errors.CORUPTED_SIGNAL);
    }

    for (const signal of signals) {
      SignalsActions[signal.type as SignalType].bind(this)(signal);
    }
  }
}
