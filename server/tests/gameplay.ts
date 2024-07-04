import { deepEqual, strictEqual, throws } from "node:assert";
import { GameEngine } from "../Engine/GameEngine";

import { it, describe, after } from "node:test";
import { TRole } from "../Engine/types/Cards";

export function cardsTests() {
  describe("Guard", () => {
    const stack: TRole[] = [
      "guard",
      "handmaid",
      "priest",
      "guard",
      "guard",
      "guard",
      "guard",
    ].reverse() as TRole[];
    let game = new GameEngine(["p1", "p2", "p3"], true, stack);

    it("p1 should have 2 guards", () => {
      const hand = game.players.current().hand;
      strictEqual(hand[0], "guard");
      strictEqual(hand[1], "guard");
    });

    it("should throw error on other player play", () => {
      for (const player of game.players.getAll().filter((p) => p.name !== "p1")) {
        throws(() => game.playTurn(player.name, 0, ["p2", "2"]));
      }
    });

    it("should throw error on wrong target", () => {
      throws(() => game.playTurn("p1", 0, ["p4", "4"]));
    });

    it("should throw error on wrong level", () => {
      throws(() => game.playTurn("p1", 0, ["p3", "-1"]));
      throws(() => game.playTurn("p1", 0, ["p3", "10"]));
    });

    it("Should be able to play and not eliminate", () => {
      game.playTurn("p1", 0, ["p2", "2"]);
      strictEqual(game.players.get("p2").alive, true);
    });

    it("should not be able to kill handmaid", () => {
      game.playTurn("p2", 0, []); // using handmaid
      strictEqual(game.players.get("p2").effect, "handmaid");
      strictEqual(game.players.get("p2").protected, true);
      game.playTurn("p3", 0, ["p1"]);

      throws(() => game.playTurn("p1", 0, ["p2", "2"]));
    });

    it("should not be able to guess another guard", () => {
      throws(() => game.playTurn("p1", 0, ["p3"]));
    });
  });

  describe("Priest", () => {
    let game = new GameEngine(
      ["p1", "p2", "p3"],
      true,
      ["priest", "guard", "guard", "guard", "guard"].reverse() as TRole[]
    );

    // 1 because cards are sorted in hand

    it("p1 should has priest in hand", () => {
      strictEqual(game.players.get("p1").hand[1], "priest");
    });

    it("should requires target param", () => {
      throws(() => game.playTurn("p1", 1, []));
      throws(() => game.playTurn("p1", 1, ["2"]));
      throws(() => game.playTurn("p1", 1, ["p4"]));

      // here comes error because cards was swapped because of playTurn
      // and priest is in the other hand
      strictEqual(game.players.get("p1").hand[1], "priest");
    });

    it("should not be able to target themself", () => {
      strictEqual(game.players.get("p1").hand[1], "priest");
      throws(() => game.playTurn("p1", 1, ["p1"]));
    });

    it("should be able to target other player", () => {
      strictEqual(game.players.get("p1").hand[1], "priest");
      game.playTurn("p1", 1, ["p2"]);
      strictEqual(game.players.get("p1").known["p2"], "guard");
    });
  });
}
