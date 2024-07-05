import { GameEngine } from "../GameEngine";
import { roles, TRole } from "../Classes/Card";
import { Errors } from "../utils/Errors";
import { Cards } from "./CardsUtils";
import { SignalsUtils } from "./SignalsUtils";

export namespace Gameplay {
  export function ProccesActionCard(this: GameEngine, hand: string, params: string[]): boolean {
    // Check if the card is in the roles
    const role = roles.find((key) => key === hand) as TRole | undefined;
    if (role === undefined) throw new Error(Errors.CARD_NOT_FOUND);

    const player = this.players.current();
    const signals = player.forUseCard(role, (card) => {
      if (!Cards.canRequirementsBeMet.bind(this)(card)) return [];

      const parsed = Cards.parseParams.bind(this)(card, params);

      return card.callUse(player, parsed);
    });

    SignalsUtils.process.bind(this)(signals);

    return CheckWin.bind(this)();
  }

  export function ProccesEffectsAndRejected(this: GameEngine): boolean {
    // After the turn is played, the engine should prepare for the next turn.

    const allPlayers = this.players.getAll();

    SignalsUtils.process.bind(this)([
      ...allPlayers.flatMap((player) => player.forEffect((card) => card.callEffect(player))),
      ...allPlayers.flatMap((player) => player.forRejected((card) => card.callRejected(player))),
    ]);

    return CheckWin.bind(this)();
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
