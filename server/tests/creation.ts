import { describe, it } from "node:test";
import { deepStrictEqual, notDeepStrictEqual, strictEqual, throws } from "node:assert";

import { LoveLetterEngine } from "../Engine/index";

export function creationTest() {
  describe("Game creation", (t) => {
    const game = new LoveLetterEngine(["p1", "p2", "p3"]);

    it("should have 3 players", () => {
      strictEqual(game.players.length, 3);
    });

    it("first player should be p1", () => {
      strictEqual(game.PlayerGetCurrent().name, "p1");
    });

    it("should choose next player", () => {
      game.PlayerChooseNext();
      strictEqual(game.PlayerGetCurrent().name, "p2");
    });

    it("should choose next player again", () => {
      game.PlayerChooseNext();
      strictEqual(game.PlayerGetCurrent().name, "p3");
    });

    it("should loop to next player", () => {
      game.PlayerChooseNext();
      strictEqual(game.PlayerGetCurrent().name, "p1");
    });

    it("should throw error if players are not unique", () => {
      throws(() => new LoveLetterEngine(["p1", "p2", "p2"]));
    });

    it("should throw error if players are less than 2", () => {
      throws(() => new LoveLetterEngine(["p1"]));
    });

    it("should throw error if players are more than 4", () => {
      throws(() => new LoveLetterEngine(["p1", "p2", "p3", "p4", "p5"]));
    });
  });

  describe("Game start", async () => {
    it("Current player should have 2 cards", () => {
      const game = new LoveLetterEngine(["p1", "p2", "p3"]);
      strictEqual(game.PlayerGetCurrent().hand.length, 2);
    });

    it("Other players should have 1 card", () => {
      const game = new LoveLetterEngine(["p1", "p2", "p3"]);
      for (const player of game
        .PlayersGetAll()
        .filter((player) => player.name !== game.PlayerGetCurrent().name)) {
        strictEqual(player.hand.length, 1);
      }
    });
  });
}
