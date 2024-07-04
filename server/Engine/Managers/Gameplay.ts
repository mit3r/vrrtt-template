import { Cards } from "./CardsUtils";
import { SignalsUtils } from "./SignalsUtils";
import { Errors } from "../utils/Errors";
import { GameEngine } from "../GameEngine";
import { Player } from "./PlayerManager";
import { TSignal } from "../types/Signals";

export namespace Gameplay {
  export function ProccesActionCard(this: GameEngine, hand: 0 | 1, params: string[]) {
    SignalsUtils.process.bind(this)(SignalsUtils.collectUse.bind(this)(hand, params));
  }

  export function ProccesSignals(this: GameEngine) {
    // After the turn is played, the engine should prepare for the next turn.
    SignalsUtils.process.bind(this)([
      ...SignalsUtils.collectEffects.bind(this)(),
      ...SignalsUtils.collectRejected.bind(this)(),
    ]);
  }

  export function ProccessOnEnd(this: GameEngine) {
    SignalsUtils.process.bind(this)(SignalsUtils.collectEnd.bind(this)());
  }

  export function CheckWin(this: GameEngine): boolean {
    const alivePlayers = this.players.getAll().filter((player) => player.alive);

    if (alivePlayers.length === 1) {
      this.winner = alivePlayers[0].name;
    }

    if (this.stack.empty()) {
      const max = Math.max(...alivePlayers.map((player) => Cards.get(player.hand[0]).level));
      const winners = alivePlayers.filter((player) => Cards.get(player.hand[0]).level === max);

      if (winners.length === 1) {
        this.winner = winners[0].name;
      }
    }

    return this.winner !== null;
  }
}
