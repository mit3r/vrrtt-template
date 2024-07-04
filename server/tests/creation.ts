import { describe, it } from "node:test";
import { deepStrictEqual, notDeepStrictEqual, strictEqual, throws } from "node:assert";
import { GameEngine } from "../Engine/GameEngine";

export function creationTest() {
  describe("Game creation", (t) => {
    const game = new GameEngine(["p1", "p2", "p3"]);

    it("should have 3 players", () => {
      strictEqual(game.players.getAll().length, 3);
    });

    it("first player should be p1", () => {
      strictEqual(game.players.current().name, "p1");
    });

    it("should choose next player", () => {
      game.players.chooseNext();
      strictEqual(game.players.current().name, "p2");
    });

    it("should choose next player again", () => {
      game.players.chooseNext();
      strictEqual(game.players.current().name, "p3");
    });

    it("should loop to next player", () => {
      game.players.chooseNext();
      strictEqual(game.players.current().name, "p1");
    });

    it("should throw error if players are not unique", () => {
      throws(() => new GameEngine(["p1", "p2", "p2"]));
    });

    it("should throw error if players are less than 2", () => {
      throws(() => new GameEngine(["p1"]));
    });

    it("should throw error if players are more than 4", () => {
      throws(() => new GameEngine(["p1", "p2", "p3", "p4", "p5"]));
    });
  });

  describe("Game start", async () => {
    it("Current player should have 2 cards", () => {
      const game = new GameEngine(["p1", "p2", "p3"]);
      strictEqual(game.players.current().hand.length, 2);
    });

    it("Other players should have 1 card", () => {
      const game = new GameEngine(["p1", "p2", "p3"]);
      for (const player of game.players
        .getAll()
        .filter((player) => player.name !== game.players.current().name)) {
        strictEqual(player.hand.length, 1);
      }
    });
  });
}
