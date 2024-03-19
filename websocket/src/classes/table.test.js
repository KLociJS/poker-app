const { Table } = require("./table");

describe("Table", () => {
  describe("_moveDealerButton", () => {
    it("should move the dealer button (end of the list) to the next player", () => {
      const table = new Table();
      const players = [
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: true, hasSitOut: false },
      ];
      table.players = players;

      table._moveDealerButton();

      expect(players[3].hasDealerButton).toBe(false);
      expect(players[0].hasDealerButton).toBe(true);
    });

    it("should move the dealer button (beginning of the list) to the next player", () => {
      const table = new Table();
      const players = [
        { hasDealerButton: true, hasSitOut: false },
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: false, hasSitOut: false },
      ];
      table.players = players;

      table._moveDealerButton();

      expect(players[0].hasDealerButton).toBe(false);
      expect(players[1].hasDealerButton).toBe(true);
    });

    it("should move the dealer button skipping players that are sitting out", () => {
      const table = new Table();
      const players = [
        { hasDealerButton: false, hasSitOut: true },
        { hasDealerButton: false, hasSitOut: true },
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: true, hasSitOut: false },
      ];
      table.players = players;

      table._moveDealerButton();

      expect(players[3].hasDealerButton).toBe(false);
      expect(players[2].hasDealerButton).toBe(true);
    });

    it("should throw an error if the dealer position is not set", () => {
      const table = new Table();
      const players = [
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: false, hasSitOut: false },
        { hasDealerButton: false, hasSitOut: false },
      ];
      table.players = players;

      expect(() => table._moveDealerButton()).toThrowError(
        "Dealer position not set. Cannot move dealer button."
      );
    });
  });
  describe("_getActivePlayers", () => {
    it("should return an array of active players", () => {
      const table = new Table();
      const players = [
        { hasSitOut: false },
        { hasSitOut: true },
        { hasSitOut: false },
        { hasSitOut: true },
      ];
      table.players = players;

      const activePlayers = table._getActivePlayers();

      expect(activePlayers).toEqual([
        { hasSitOut: false },
        { hasSitOut: false },
      ]);
    });

    it("should return an empty array if there are no active players", () => {
      const table = new Table();
      const players = [
        { hasSitOut: true },
        { hasSitOut: true },
        { hasSitOut: true },
      ];
      table.players = players;

      const activePlayers = table._getActivePlayers();

      expect(activePlayers).toEqual([]);
    });
  });
});
