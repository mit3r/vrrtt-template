import { deepEqual, strictEqual, throws, ok } from "node:assert";
import { GameEngine } from "../Engine/GameEngine";

import { it, describe, after, before } from "node:test";
import { TRole } from "../Engine/Classes/Card";

export function cardsTests() {
  describe("Guard", () => {
    const stack: TRole[] = ["guard", "handmaid", "priest", "guard", "guard", "guard", "guard"];
    let game = new GameEngine(["p1", "p2", "p3"], true, stack);

    it("p1 should have 2 guards", () => {
      const hand = game.players.current().hand;
      strictEqual(hand[0], "guard");
      strictEqual(hand[1], "guard");
    });

    it("should throw error on other player play", () => {
      for (const player of game.players.getAll().filter((p) => p.name !== "p1")) {
        throws(() => game.playTurn(player.name, "guard", ["p2", "2"]));
      }
    });

    it("should throw error on wrong target", () => {
      throws(() => game.playTurn("p1", "guard", ["p4", "4"]));
    });

    it("should throw error on wrong level", () => {
      throws(() => game.playTurn("p1", "guard", ["p3", "-1"]));
      throws(() => game.playTurn("p1", "guard", ["p3", "10"]));
    });

    it("Should be able to play and not eliminate", () => {
      game.playTurn("p1", "guard", ["p2", "2"]);
      strictEqual(game.players.get("p2").alive, true);
    });

    it("should not be able to kill handmaid", () => {
      game.playTurn("p2", "handmaid", []); // using handmaid
      strictEqual(game.players.get("p2").effect, "handmaid");
      strictEqual(game.players.get("p2").protected, true);
      game.playTurn("p3", "priest", ["p1"]);

      throws(() => game.playTurn("p1", "guard", ["p2", "2"]));
    });

    it("should not be able to guess another guard", () => {
      throws(() => game.playTurn("p1", "guard", ["p3"]));
    });
  });

  describe("Priest", () => {
    let game = new GameEngine(["p1", "p2", "p3"], true, [
      "priest",
      "guard",
      "guard",
      "guard",
      "guard",
    ]);

    // 1 because cards are sorted in hand

    it("p1 should has priest in hand", () => {
      ok(game.players.get("p1").has("priest"));
    });

    it("should requires target param", () => {
      throws(() => game.playTurn("p1", "priest", []));
      throws(() => game.playTurn("p1", "priest", ["2"]));
      throws(() => game.playTurn("p1", "priest", ["p4"]));

      // here comes error because cards was swapped because of playTurn
      // and priest is in the other hand
      strictEqual(game.players.get("p1").hand[1], "priest");
    });

    it("should not be able to target themself", () => {
      strictEqual(game.players.get("p1").hand[1], "priest");
      throws(() => game.playTurn("p1", "priest", ["p1"]));
    });

    it("should not be able to target dead player", () => {
      game.players.get("p3").kill();
      throws(() => game.playTurn("p1", "priest", ["p3"]));
    });

    it("should be able to target other player", () => {
      strictEqual(game.players.get("p1").hand[1], "priest");
      game.playTurn("p1", "priest", ["p2"]);
      strictEqual(game.players.get("p1").known["p2"], "guard");
    });

    it("should not be able to target protected player", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "handmaid",
          "priest",
          "guard",
          "guard",
          "guard",
        ]);
      });

      game.playTurn("p1", "handmaid", []);
      throws(() => game.playTurn("p2", "priest", ["p1"]));
    });
  });

  describe("Baron", () => {
    let game: GameEngine;

    it("should requires target param", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "baron",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });

      throws(() => game.playTurn("p1", "baron", []));
      throws(() => game.playTurn("p1", "baron", ["2"]));
      throws(() => game.playTurn("p1", "baron", ["p4"]));
    });

    it("should not be able to target themself", () => {
      ok(game.players.get("p1").has("baron"));
      throws(() => game.playTurn("p1", "baron", ["p1"]));
    });

    it("should not be able to target dead player", () => {
      before(() => {
        game = new GameEngine(["p1", "p2", "p3"], true, [
          "baron",
          "guard",
          "guard",
          "guard",
          "guard",
        ]);
      });
      game.players.get("p3").kill();
      throws(() => game.playTurn("p1", "baron", ["p3"]));
    });
  });
}
