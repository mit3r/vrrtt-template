import { TPlayer, TPlayersOptions } from "./types";
import { Errors } from "./utils/Errors";

const initOptions = {
  maxPlayers: 4,
  minPlayers: 2,
  queuing: "random",
  autoPlay: false,
} as TPlayersOptions;

export default class PlayersEngine {
  private players: TPlayer[] = [];
  private pointer: number = 0;

  private options: TPlayersOptions = initOptions;

  setOptions = (options: Partial<TPlayersOptions>) => {
    this.options = { ...initOptions, ...options };
  };

  add = (names: string[]) => {
    this.players = names.map((name) => {
      if (this.players.length >= this.options.maxPlayers)
        throw new Error(Errors.MAX_PLAYERS_REACHED);

      if (this.players.find((p) => p.name === name))
        throw new Error(Errors.PLAYER_ALREADY_EXISTS);

      return {
        name,
        online: true,
        alive: true,
        hand: [],
        rejected: [null], // [0] - effect card / null, [1:] - rejected cards
        points: 0,
        known: {},
      } as TPlayer;
    });
  };

  setOnline = (name: string, online: boolean) => {
    const p = this.players.find((player) => player.name === name);
    if (!p) throw new Error(Errors.PLAYER_NOT_FOUND);

    p.online = online;
  };

  queue = (method: TPlayersOptions["queuing"]) => {
    switch (method) {
      case "abc":
        this.players.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "cba":
        this.players.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "random":
        this.players.sort(() => Math.random() - 0.5);
        break;
      case "fifo":
        break;
      case "lifo":
        this.players.reverse();
        break;
      default:
        throw new Error(Errors.INVALID_QUEUING_METHOD);
    }
  };

  getOnline = () => this.players.filter((player) => player.online);

  getCurrent = () => {
    if (this.pointer >= this.players.length || this.pointer < 0)
      throw new Error(Errors.CURRENT_PLAYER_FAULT);

    return this.players[this.pointer];
  };

  chooseNext = () => {
    if (this.players.length === 0) throw new Error(Errors.NO_PLAYERS);

    this.pointer = (this.pointer + 1) % this.players.length;

    do {
      this.pointer = (this.pointer + 1) % this.players.length;
    } while (!this.getCurrent().online && this.options.autoPlay);
  };
}
