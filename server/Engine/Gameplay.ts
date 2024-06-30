import { LoveLetterEngine } from ".";
import { Cards } from "./Cards";
import { SignalsUtils } from "./SignalsUtils";
import { Signal, TPlayer } from "./types";
import { Errors } from "./utils/Errors";

export namespace Gameplay {
  export function DealCards(this: LoveLetterEngine) {
    for (const player of this.PlayersGetAll()) {
      const card = this.StackPop();
      if (card === undefined) throw new Error(Errors.HAND_FAULT);

      player.hand[0] = card;
    }
  }

  export function DealSecondCard(this: LoveLetterEngine, who: TPlayer) {
    const card = this.StackPop();
    if (card === undefined) throw new Error(Errors.HAND_FAULT);
    if (who.hand[1] !== undefined) throw new Error(Errors.HAND_FAULT);

    who.hand[1] = card;
  }

  export function IsNotTargetProtected(this: LoveLetterEngine, params: string[]) {
    const protectedPlayers = this.PlayersGetAll()
      .filter((player) => player.protected)
      .map((player) => player.name);

    for (const param of params) {
      if (protectedPlayers.includes(param)) throw new Error(Errors.PROTECTED_TARGET);
    }
  }

  function CheckForKills(this: LoveLetterEngine) {
    // check for kills
    for (const player of this.PlayersGetAll()) {
      if (!player.alive) {
        if (player.effect !== null) {
          player.rejected.push(player.effect);
          player.effect = null;
        }

        // drop hand
        player.rejected.push(player.hand[0]);
        player.hand = [];
      }
    }
  }

  export function ProccesActionCard(this: LoveLetterEngine, hand: 0 | 1, params: string[]) {
    const currentPlayer = this.PlayerGetCurrent();

    // swap cards to [hand, action]
    if (hand === 0) {
      let tmp = currentPlayer.hand[0];
      currentPlayer.hand[0] = currentPlayer.hand[1];
      currentPlayer.hand[1] = tmp;
    }

    // collect signals from action card
    const signals: Signal[] = SignalsUtils.collectUse.bind(this)(
      this.PlayerGetCurrent().name,
      params
    );

    SignalsUtils.process.bind(this)(signals);

    // if card has effect add it to effect else just reject
    if (Cards.get(currentPlayer.hand[1]).handlers.onEffect !== undefined) {
      currentPlayer.effect = currentPlayer.hand[1];
    } else {
      currentPlayer.rejected.push(currentPlayer.hand[1]);
    }

    // drop action card
    this.PlayerGetCurrent().hand.pop();

    // check for kills
    CheckForKills.bind(this)();
  }

  export function ProccesSignals(this: LoveLetterEngine) {
    // After the turn is played, the engine should prepare for the next turn.
    SignalsUtils.process.bind(this)([
      ...SignalsUtils.collectEffects.bind(this)(),
      ...SignalsUtils.collectRejected.bind(this)(),
    ]);
  }

  export function ClearProtection(this: LoveLetterEngine) {
    for (const player of this.PlayersGetAll()) {
      player.protected = false;
    }
  }

  export function DropEffectCard(this: LoveLetterEngine, player: TPlayer) {
    if (player.effect !== null) {
      player.rejected.push(player.effect);
      player.effect = null;
    }
  }

  export function ResetKnown(this: LoveLetterEngine, player: TPlayer) {
    for (const p of this.PlayersGetAll()) {
      if (p.known[player.name] !== undefined) delete p.known[player.name];
    }
  }

  export function ProccessOnStart(this: LoveLetterEngine) {}

  export function ProccessOnEnd(this: LoveLetterEngine) {
    SignalsUtils.process.bind(this)(SignalsUtils.collectEnd.bind(this)());
  }

  export function CheckWin(this: LoveLetterEngine): boolean {
    const alivePlayers = this.PlayersGetAll().filter((player) => player.alive);

    if (alivePlayers.length === 1) {
      this.winner = alivePlayers[0].name;
    }

    if (this.stack.length === 0) {
      const max = Math.max(...alivePlayers.map((player) => Cards.get(player.hand[0]).level));
      const winners = alivePlayers.filter((player) => Cards.get(player.hand[0]).level === max);

      if (winners.length === 1) {
        this.winner = winners[0].name;
      }
    }

    return this.winner !== null;
  }
}
