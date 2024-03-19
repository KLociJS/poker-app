const { DECK } = require("../constants/cards");
const { Dealer } = require("./dealer");
const { GameRules } = require("./gameRules");
const { Player } = require("./player");

describe("Dealer", () => {
  describe("_deductBlinds", () => {
    describe("2 players, big blind, small blind", () => {
      let dealer;
      let players;
      let gameRules;

      beforeEach(() => {
        gameRules = new GameRules("fix", 10, 20, 9);
        dealer = new Dealer(gameRules);
        players = [{ betChips: jest.fn() }, { betChips: jest.fn() }];
        dealer.activePlayers = players;
      });

      it("should deduct blinds from the 2nd and 1st player in the activePlayers array", () => {
        players[0].hasDealerButton = true;
        dealer._deductBlinds();
        expect(dealer.activePlayers[1].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[0].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });

      it("should deduct blinds from the 1st and 2nd player in the activePlayers array", () => {
        players[1].hasDealerButton = true;
        dealer._deductBlinds();
        expect(dealer.activePlayers[0].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[1].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });
    });

    describe("3 players, big blind, small blind", () => {
      let dealer;
      let players;
      let gameRules;

      beforeEach(() => {
        gameRules = new GameRules("fix", 10, 20, 9);
        dealer = new Dealer(gameRules);
        players = [
          { betChips: jest.fn() },
          { betChips: jest.fn() },
          { betChips: jest.fn() },
        ];
        dealer.activePlayers = players;
      });

      it("should deduct blinds from the 2nd and 3rd player in the activePlayers array", () => {
        players[0].hasDealerButton = true;
        dealer._deductBlinds();
        expect(dealer.activePlayers[1].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[2].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });

      it("should deduct blinds from the 3rd and 1st player in the activePlayers array", () => {
        players[1].hasDealerButton = true;

        dealer._deductBlinds();
        expect(dealer.activePlayers[2].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[0].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });

      it("should deduct blinds from the 1st and 2nd player in the activePlayers array", () => {
        players[2].hasDealerButton = true;

        dealer._deductBlinds();
        expect(dealer.activePlayers[0].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[1].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });
    });
  });

  describe("_dealHoleCards", () => {
    it("should deal 2 cards to each active player", () => {
      const players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      const dealer = new Dealer();
      dealer.activePlayers = players;

      const initialDeckLength = DECK.length;
      const initialPlayerCardCounts = players.map(
        (player) => player.cards.length
      );

      dealer._dealHoleCards();

      const remainingDeckLength = dealer.deck.cards.length;
      const finalPlayerCardCounts = players.map(
        (player) => player.cards.length
      );

      expect(remainingDeckLength).toBe(initialDeckLength - players.length * 2);
      expect(finalPlayerCardCounts).toEqual([2, 2, 2]);
      expect(initialPlayerCardCounts).toEqual([0, 0, 0]);

      players.forEach((player) => {
        expect(player.cards.every((card) => DECK.includes(card))).toBe(true);
        expect(
          player.cards.every((card) => dealer.deck.cards.includes(card))
        ).toBe(false);
      });

      expect(dealer.deck.cards.every((card) => DECK.includes(card))).toBe(true);
    });
  });

  describe("_setFirstAndLastPlayerToAct", () => {
    describe("should work with 2 players", () => {
      let dealer;
      let players;

      beforeEach(() => {
        dealer = new Dealer();
        players = [new Player("Alice", 1), new Player("Bob", 2)];
        dealer.activePlayers = players;
      });

      it("should set the first and last players to act", () => {
        players[0].hasDealerButton = true;
        dealer._setFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[1]);
        expect(dealer.lastPlayerToAct).toBe(players[0]);
      });

      it("should set the first and last players to act", () => {
        players[1].hasDealerButton = true;
        dealer._setFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[0]);
        expect(dealer.lastPlayerToAct).toBe(players[1]);
      });
    });

    describe("should work with 2+ players", () => {
      let dealer;
      let players;

      beforeEach(() => {
        dealer = new Dealer();
        players = [
          new Player("Alice", 1),
          new Player("Bob", 2),
          new Player("Charlie", 3),
        ];
        dealer.activePlayers = players;
      });

      it("should set the first and last players to act", () => {
        players[0].hasDealerButton = true;
        dealer._setFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[0]);
        expect(dealer.lastPlayerToAct).toBe(players[2]);
      });

      it("should set the first and last players to act", () => {
        players[1].hasDealerButton = true;
        dealer._setFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[1]);
        expect(dealer.lastPlayerToAct).toBe(players[0]);
      });

      it("should set the first and last players to act", () => {
        players[2].hasDealerButton = true;
        dealer._setFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[2]);
        expect(dealer.lastPlayerToAct).toBe(players[1]);
      });
    });
  });

  describe("_validatePlayerAction", () => {
    let dealer;
    let player;

    beforeEach(() => {
      dealer = new Dealer();
      player = new Player("Alice", 1);
      dealer.playerToAct = player;
      dealer.lastRaiseBetAmount = 10;
      dealer.raiseCounter = 3;
      dealer.currentBet = 20;
    });

    it("should throw an error if the player is not the one to act", () => {
      const otherPlayer = new Player("Bob", 2);
      expect(() =>
        dealer._validatePlayerAction(otherPlayer, { type: "check" })
      ).toThrowError("Invalid player action: Not Bob's id:2 turn");
    });

    it("should throw an error if the player tries to check when a bet is made", () => {
      expect(() =>
        dealer._validatePlayerAction(player, { type: "check" })
      ).toThrowError("Invalid player action: Cannot check when bet is made");
    });

    it("should throw an error if the player tries to raise when the raise limit is reached", () => {
      dealer.raiseCounter = 4;
      expect(() =>
        dealer._validatePlayerAction(player, { type: "raise" })
      ).toThrowError("Invalid player action: Raise limit reached");
    });

    it("should throw an error if the player tries to bet when a bet is already made", () => {
      expect(() =>
        dealer._validatePlayerAction(player, { type: "bet" })
      ).toThrowError(
        "Invalid player action: Cannot bet when bet is already made"
      );
    });

    it("should throw an error if the player tries to call when no bet is made", () => {
      dealer.lastRaiseBetAmount = 0;
      expect(() =>
        dealer._validatePlayerAction(player, { type: "call" })
      ).toThrowError("Invalid player action: Cannot call when no bet is made");
    });

    it("should throw an error if the player tries to raise when no bet is made", () => {
      dealer.lastRaiseBetAmount = 0;
      expect(() =>
        dealer._validatePlayerAction(player, { type: "raise" })
      ).toThrowError("Invalid player action: Cannot raise when no bet is made");
    });

    it("should throw an error if the player tries to raise with a low amount", () => {
      const action = { type: "raise", amount: 25 };
      expect(() => dealer._validatePlayerAction(player, action)).toThrowError(
        "Invalid player action: Raise amount too low"
      );
    });

    it("should throw an error if the player does not have enough chips for the action", () => {
      player.chips = 15;
      const action = { type: "raise", amount: 30 };
      expect(() => dealer._validatePlayerAction(player, action)).toThrowError(
        "Invalid player action: Invalid amount of chips, differs from game state"
      );
    });

    it("should throw an error if the player does not use 'allIn' when having the same amount of chips as the action", () => {
      player.chips = 30;
      const action = { type: "call", amount: 30 };
      expect(() => dealer._validatePlayerAction(player, action)).toThrowError(
        "Invalid player action: Use all in instead"
      );
    });

    it("should throw an error if the player calls with a low amount", () => {
      player.currentRoundBet = 5;
      const action = { type: "call", amount: 15 };
      expect(() => dealer._validatePlayerAction(player, action)).toThrowError(
        "Invalid player action: Invalid amount of chips, differs from game state"
      );
    });
  });

  describe("_setNextPlayerToAct", () => {
    let dealer;
    let players;

    beforeEach(() => {
      dealer = new Dealer();
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      dealer.activePlayers = players;
    });

    it("should work when current player to act is not last", () => {
      dealer.playerToAct = players[0];
      dealer._setNextPlayerToAct();
      expect(dealer.playerToAct).toBe(players[1]);
    });

    it("should work when current player to act is the last", () => {
      dealer.playerToAct = players[2];
      dealer._setNextPlayerToAct();
      expect(dealer.playerToAct).toBe(players[0]);
    });
  });

  describe("_checkIfBettingRoundIsOver", () => {
    let dealer;
    let players;

    beforeEach(() => {
      dealer = new Dealer();
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      players.forEach((player) => (player.currentRoundBet = 20));
      dealer.activePlayers = players;

      dealer.isWaitingForPlayerAction = true;
      dealer.raiseCounter = 2;
      dealer.currentBet = 60;
      dealer.lastRaiseBetAmount = 20;
    });

    it("should work when the betting round is over, resetting state", () => {
      dealer.lastPlayerToAct = players[0];

      dealer._checkIfBettingRoundIsOver(players[0]);

      expect(dealer.isWaitingForPlayerAction).toBe(false);
      expect(dealer.raiseCounter).toBe(0);
      expect(dealer.currentBet).toBe(0);
      expect(dealer.lastRaiseBetAmount).toBe(0);
      players.forEach((player) => {
        expect(player.currentRoundBet).toBe(0);
      });
    });

    it("should work when the betting round is not over", () => {
      dealer.playerToAct = players[0];
      dealer.lastPlayerToAct = players[1];

      dealer._checkIfBettingRoundIsOver(players[0]);

      expect(dealer.isWaitingForPlayerAction).toBe(true);
      expect(dealer.raiseCounter).toBe(2);
      expect(dealer.currentBet).toBe(60);
      expect(dealer.lastRaiseBetAmount).toBe(20);
      players.forEach((player) => {
        expect(player.currentRoundBet).toBe(20);
      });
    });
  });

  describe("_removeActivePlayer", () => {
    it("should remove the player from the active players", () => {
      const dealer = new Dealer();
      const player = new Player("Alice", 1);
      dealer.activePlayers = [
        player,
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      dealer._removeActivePlayer(player);
      expect(dealer.activePlayers).not.toContain(player);
    });
  });

  describe("_setLastPlayerToActAfterBetOrRaise", () => {
    let dealer;
    let players;

    beforeEach(() => {
      dealer = new Dealer();
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      dealer.activePlayers = players;
    });

    it("should return the last player if the first one bets or raises", () => {
      dealer._setLastPlayerToActAfterBetOrRaise(players[0]);

      expect(dealer.lastPlayerToAct).toBe(players[2]);
    });

    it("should return the first player if the second one bets or raises", () => {
      dealer._setLastPlayerToActAfterBetOrRaise(players[1]);

      expect(dealer.lastPlayerToAct).toBe(players[0]);
    });

    it("should return the second player if the third one bets or raises", () => {
      dealer._setLastPlayerToActAfterBetOrRaise(players[2]);

      expect(dealer.lastPlayerToAct).toBe(players[1]);
    });
  });

  describe("_clearPlayerCards", () => {
    it("should remove all cards from the players", () => {
      const dealer = new Dealer();
      const players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      players.forEach((player) => player.addCard("card"));
      dealer.activePlayers = players;
      dealer._clearPlayerCards();

      players.forEach((player) => {
        expect(player.cards).toHaveLength(0);
      });
    });
  });

  describe("_executeBetAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      dealer.activePlayers = players;
      dealer.playerToAct = players[0];

      dealer._executeBetAction(players[0], 20);

      expect(dealer.currentBet).toBe(20);
      expect(dealer.lastRaiseBetAmount).toBe(20);
      expect(dealer.raiseCounter).toBe(1);
    });
  });

  describe("_executeCallAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      dealer.activePlayers = players;
      dealer.playerToAct = players[1];
      dealer.lastPlayerToAct = players[2];
      dealer.currentBet = 20;
      dealer.pot = 20;
      dealer.raiseCounter = 1;

      dealer._executeCallAction(players[1], 20);

      expect(dealer.pot).toBe(40);
    });
  });

  describe("_executeRaiseAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      dealer.activePlayers = players;
      dealer.playerToAct = players[1];
      dealer.lastPlayerToAct = players[2];
      dealer.currentBet = 20;
      dealer.lastRaiseBetAmount = 20;
      dealer.pot = 20;
      dealer.raiseCounter = 1;

      dealer._executeRaiseAction(players[1], 40);

      expect(dealer.currentBet).toBe(40);
      expect(dealer.lastRaiseBetAmount).toBe(20);
      expect(dealer.raiseCounter).toBe(2);
      expect(dealer.pot).toBe(60);
    });
  });

  describe("_executeAllInAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      players[1].chips = 20;

      dealer.activePlayers = players;
      dealer.playerToAct = players[1];
      dealer.lastPlayerToAct = players[2];
      dealer.currentBet = 20;
      dealer.pot = 20;

      dealer._executeAllInAction(players[1]);

      expect(dealer.pot).toBe(40);
      expect(dealer.activePlayers).not.toContain(players[1]);
      expect(dealer.playersAllIn).toContain(players[1]);
    });
  });

  describe("Betting round", () => {
    let dealer;
    let players;
    let gameRules;

    beforeEach(() => {
      gameRules = new GameRules("fix", 10, 20, 9);
      dealer = new Dealer(gameRules);
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      players[0].hasDealerButton = true;
      players.forEach((player) => player.setChips(1000));
    });

    it("should update game state correctly", () => {
      dealer.executePreFlop(players);
      expect(dealer.stage).toBe("preFlop");

      expect(dealer.playerToAct).toBe(players[0]);
      expect(dealer.lastPlayerToAct).toBe(players[2]);

      expect(dealer.pot).toBe(30);
      expect(players[1].chips).toBe(990);
      expect(players[2].chips).toBe(980);

      dealer.executePlayerAction(players[0], { type: "bet", amount: 100 });

      expect(dealer.currentBet).toBe(100);
      expect(dealer.lastRaiseBetAmount).toBe(100);
      expect(dealer.raiseCounter).toBe(1);
      expect(dealer.pot).toBe(130);

      expect(dealer.playerToAct).toBe(players[1]);
      expect(dealer.lastPlayerToAct).toBe(players[2]);

      dealer.executePlayerAction(players[1], { type: "raise", amount: 200 });

      expect(dealer.currentBet).toBe(200);
      expect(dealer.lastRaiseBetAmount).toBe(100);
      expect(dealer.raiseCounter).toBe(2);
      expect(dealer.pot).toBe(320);

      expect(dealer.playerToAct).toBe(players[2]);
      expect(dealer.lastPlayerToAct).toBe(players[0]);

      dealer.executePlayerAction(players[2], { type: "raise", amount: 300 });
      expect(dealer.currentBet).toBe(300);
      expect(dealer.lastRaiseBetAmount).toBe(100);
      expect(dealer.raiseCounter).toBe(3);
      expect(dealer.pot).toBe(600);

      expect(dealer.playerToAct).toBe(players[0]);
      expect(dealer.lastPlayerToAct).toBe(players[1]);

      dealer.executePlayerAction(players[0], { type: "raise", amount: 400 });
      expect(dealer.currentBet).toBe(400);
      expect(dealer.lastRaiseBetAmount).toBe(100);
      expect(dealer.raiseCounter).toBe(4);
      expect(dealer.pot).toBe(900);

      expect(dealer.playerToAct).toBe(players[1]);
      expect(dealer.lastPlayerToAct).toBe(players[2]);

      dealer.executePlayerAction(players[1], { type: "fold" });
      expect(dealer.activePlayers).not.toContain(players[1]);

      expect(dealer.playerToAct).toBe(players[2]);
      expect(dealer.lastPlayerToAct).toBe(players[2]);

      dealer.executePlayerAction(players[2], { type: "call", amount: 400 });
      expect(dealer.pot).toBe(1000);

      expect(dealer.isWaitingForPlayerAction).toBe(false);
      expect(dealer.stage).toBe("flop");

      expect(players[0].chips).toBe(600);
      expect(players[1].chips).toBe(800);
      expect(players[2].chips).toBe(600);
    });
  });
});
