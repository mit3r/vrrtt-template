import { GameEngine } from "../GameEngine";
import { SignalType, TSignal } from "../types/Signals";
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

  export function collectUse(this: GameEngine, hand: 0 | 1, params: string[]): TSignal[] {
    const signals: TSignal[] = [];

    const player = this.players.current();

    player.forUseCard(hand, (card_id) => {
      const card = Cards.get(card_id);

      const handler = card.handlers.onUse;
      if (handler === undefined) return;

      const parsed = Cards.parseUseParams.bind(this)(card_id, params);

      signals.push(...handler.bind(this)(player, parsed));
    });

    return signals;
  }

  export function collectEffects(this: GameEngine): TSignal[] {
    const signals: TSignal[] = [];

    for (const performer of this.players.getAll()) {
      performer.forEffect((card_id) => {
        if (performer.effect === null) return;

        const card = Cards.get(card_id);

        const handler = card.handlers.onEffect;
        if (handler === undefined) return;

        signals.push(...handler.bind(this)(performer));
      });
    }

    return signals;
  }

  export function collectRejected(this: GameEngine): TSignal[] {
    const signals: TSignal[] = [];

    for (const player of this.players.getAll()) {
      player.forRejected((card_id) => {
        const card = Cards.get(card_id);
        if (card === undefined) throw new Error(Errors.CARD_NOT_FOUND);

        const handler = card.handlers.onRejected;
        if (handler === undefined) return;

        signals.push(...handler.bind(this)(player));
      });
    }

    return signals;
  }

  export function collectEnd(this: GameEngine): TSignal[] {
    // todo: extensionn
    return [];
  }

  export function process(this: GameEngine, signals: TSignal[]): void {
    for (const signal of signals) {
      if (!validateSignal.bind(this)(signal)) throw new Error(Errors.CORUPTED_SIGNAL);
      SignalsActions[signal.type as SignalType].bind(this)(signal);
    }
  }
}
