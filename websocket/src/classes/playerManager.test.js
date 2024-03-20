const Player = require("./player");
const PlayerManager = require("./playerManager");

describe("PlayerManager", () => {
  describe("setFirstAndLastPlayerToAct", () => {
    describe("should work with 2 players", () => {
      let manager;
      let players;

      beforeEach(() => {
        manager = new PlayerManager();
        players = [new Player("Alice", 1), new Player("Bob", 2)];
        manager.setActivePlayers(players);
      });

      it("should set the first and last players to act", () => {
        players[0].hasDealerButton = true;
        manager.setFirstAndLastPlayerToAct();
        expect(manager.playerToAct).toBe(players[1]);
        expect(manager.lastPlayerToAct).toBe(players[0]);
      });

      it("should set the first and last players to act", () => {
        players[1].hasDealerButton = true;
        manager.setFirstAndLastPlayerToAct();
        expect(manager.playerToAct).toBe(players[0]);
        expect(manager.lastPlayerToAct).toBe(players[1]);
      });
    });

    describe("should work with 2+ players", () => {
      let manager;
      let players;

      beforeEach(() => {
        manager = new PlayerManager();
        players = [
          new Player("Alice", 1),
          new Player("Bob", 2),
          new Player("Charlie", 3),
        ];
        manager.setActivePlayers(players);
      });

      it("should set the first and last players to act", () => {
        players[0].hasDealerButton = true;
        manager.setFirstAndLastPlayerToAct();
        expect(manager.playerToAct).toBe(players[0]);
        expect(manager.lastPlayerToAct).toBe(players[2]);
      });

      it("should set the first and last players to act", () => {
        players[1].hasDealerButton = true;
        manager.setFirstAndLastPlayerToAct();
        expect(manager.playerToAct).toBe(players[1]);
        expect(manager.lastPlayerToAct).toBe(players[0]);
      });

      it("should set the first and last players to act", () => {
        players[2].hasDealerButton = true;
        manager.setFirstAndLastPlayerToAct();
        expect(manager.playerToAct).toBe(players[2]);
        expect(manager.lastPlayerToAct).toBe(players[1]);
      });
    });
  });

  describe("setNextPlayerToAct", () => {
    let manager;
    let players;

    beforeEach(() => {
      manager = new PlayerManager();
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      manager.setActivePlayers(players);
    });

    it("should work when current player to act is not last", () => {
      manager.playerToAct = players[0];
      manager.setNextPlayerToAct();
      expect(manager.playerToAct).toBe(players[1]);
    });

    it("should work when current player to act is the last", () => {
      manager.playerToAct = players[2];
      manager.setNextPlayerToAct();
      expect(manager.playerToAct).toBe(players[0]);
    });
  });

  describe("removeActivePlayer", () => {
    it("should remove the player from the active players", () => {
      manager = new PlayerManager();
      const player = new Player("Alice", 1);
      manager.setActivePlayers([
        player,
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ]);
      manager.removeActivePlayer(player);
      expect(manager.activePlayers).not.toContain(player);
    });
  });

  describe("setLastPlayerToActAfterBetOrRaise", () => {
    let manager;
    let players;

    beforeEach(() => {
      manager = new PlayerManager();
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      manager.setActivePlayers(players);
    });

    it("should return the last player if the first one bets or raises", () => {
      manager.setLastPlayerToActAfterBetOrRaise(players[0]);

      expect(manager.lastPlayerToAct).toBe(players[2]);
    });

    it("should return the first player if the second one bets or raises", () => {
      manager.setLastPlayerToActAfterBetOrRaise(players[1]);

      expect(manager.lastPlayerToAct).toBe(players[0]);
    });

    it("should return the second player if the third one bets or raises", () => {
      manager.setLastPlayerToActAfterBetOrRaise(players[2]);

      expect(manager.lastPlayerToAct).toBe(players[1]);
    });
  });
});
