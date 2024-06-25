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

      if (this.players.find((p) => p.name === name)) throw new Error(Errors.PLAYER_ALREADY_EXISTS);

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

  get = (name: string) => {
    const player = this.players.find((player) => player.name === name);
    if (!player) throw new Error(Errors.PLAYER_NOT_FOUND);

    return player;
  };

  getAll = () => this.players;

  getOnline = () => this.players.filter((player) => player.online);

  getAlive = () => this.players.filter((player) => player.alive);

  getCurrent = () => {
    if (this.pointer >= this.players.length || this.pointer < 0)
      throw new Error(Errors.CURRENT_PLAYER_FAULT);

    const player = this.players[this.pointer];
    if (player.hand.length != 0) throw new Error(Errors.CURRENT_PLAYER_FAULT);

    return player;
  };

  getEffect = (name: string) => {
    const player = this.get(name);
    return player.rejected[0];
  };

  chooseNext = () => {
    if (this.players.length === 0) throw new Error(Errors.NO_PLAYERS);

    while (true) {
      this.pointer = (this.pointer + 1) % this.players.length;
      let player = this.getCurrent();

      if (player.online && player.alive) break;
      if (!player.online && this.options.autoPlay) break;
    }
  };

  authorize = (name: string) => {
    if (this.getCurrent().name !== name) throw new Error(Errors.NOT_PLAYER_TURN);

    return true;
  };
}
