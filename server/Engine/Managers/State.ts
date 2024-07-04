import { GameEngine } from "../GameEngine";
import { TOtherPlayer, TPersonalState, TState } from "../types/State";
import { Player } from "./PlayerManager";

export namespace State {
  export function get(this: GameEngine): TState {
    const players = this.players.getAll();

    return players.reduce((acc, player) => {
      acc[player.name] = getPersonal.bind(this)(
        player,
        players.filter((p) => p.name !== player.name)
      );

      return acc;
    }, {} as Record<string, TPersonalState>);
  }

  function getPersonal(this: GameEngine, me: Player, others: Player[]): TPersonalState {
    const player = me;
    const otherPlayers: TOtherPlayer[] = others.map((p) => ({
      name: p.name,
      alive: p.alive,
      level: p.level,
      online: p.online,
      effect: p.effect,
      protected: p.protected,
      rejected: p.rejected,
      points: p.points,
      flattery_pointer: p.flattery_pointer,
      joke_pointer: p.joke_pointer,
      known: me.known[p.name] || null,
    }));

    return {
      you: player,
      others: otherPlayers,
      round: 0,
      winner: this.winner,
    };
  }
}
