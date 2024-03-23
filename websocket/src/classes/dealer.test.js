const { DECK } = require("../constants/cards");
const STAGES = require("../constants/handCycleStage");
const NoLimitRuleValidator = require("./NoLimitRuleValidator");
const Dealer = require("./dealer");
const Deck = require("./deck");
const GameRules = require("./gameRules");
const GameStageManager = require("./gameStageManager");
const Player = require("./player");
const PlayerManager = require("./playerManager");
const PotManager = require("./potManager");

describe("Dealer", () => {
  // describe("_deductBlinds", () => {
  //   describe("2 players, big blind, small blind", () => {
  //     let dealer;
  //     let players;
  //     let gameRules;

  //     beforeEach(() => {
  //       gameRules = new GameRules("fix", 10, 20, 9);
  //       dealer = new Dealer(gameRules);
  //       players = [{ betChips: jest.fn() }, { betChips: jest.fn() }];
  //       dealer.playerManager.activePlayers = players;
  //     });

  //     it("should deduct blinds from the 2nd and 1st player in the activePlayers array", () => {
  //       players[0].hasDealerButton = true;
  //       dealer._deductBlinds();
  //       expect(
  //         dealer.playerManager.activePlayers[1].betChips
  //       ).toHaveBeenCalledWith(10);
  //       expect(
  //         dealer.playerManager.activePlayers[0].betChips
  //       ).toHaveBeenCalledWith(20);
  //       expect(dealer.potManager.pot).toBe(30);
  //     });

  //     it("should deduct blinds from the 1st and 2nd player in the activePlayers array", () => {
  //       players[1].hasDealerButton = true;
  //       dealer._deductBlinds();
  //       expect(
  //         dealer.playerManager.activePlayers[0].betChips
  //       ).toHaveBeenCalledWith(10);
  //       expect(
  //         dealer.playerManager.activePlayers[1].betChips
  //       ).toHaveBeenCalledWith(20);
  //       expect(dealer.potManager.pot).toBe(30);
  //     });
  //   });

  //   describe("3 players, big blind, small blind", () => {
  //     let dealer;
  //     let players;
  //     let gameRules;

  //     beforeEach(() => {
  //       gameRules = new GameRules("fix", 10, 20, 9);
  //       dealer = new Dealer(gameRules);
  //       players = [
  //         { betChips: jest.fn() },
  //         { betChips: jest.fn() },
  //         { betChips: jest.fn() },
  //       ];
  //       dealer.playerManager.activePlayers = players;
  //     });

  //     it("should deduct blinds from the 2nd and 3rd player in the activePlayers array", () => {
  //       players[0].hasDealerButton = true;
  //       dealer._deductBlinds();
  //       expect(
  //         dealer.playerManager.activePlayers[1].betChips
  //       ).toHaveBeenCalledWith(10);
  //       expect(
  //         dealer.playerManager.activePlayers[2].betChips
  //       ).toHaveBeenCalledWith(20);
  //       expect(dealer.potManager.pot).toBe(30);
  //     });

  //     it("should deduct blinds from the 3rd and 1st player in the activePlayers array", () => {
  //       players[1].hasDealerButton = true;

  //       dealer._deductBlinds();
  //       expect(
  //         dealer.playerManager.activePlayers[2].betChips
  //       ).toHaveBeenCalledWith(10);
  //       expect(
  //         dealer.playerManager.activePlayers[0].betChips
  //       ).toHaveBeenCalledWith(20);
  //       expect(dealer.potManager.pot).toBe(30);
  //     });

  //     it("should deduct blinds from the 1st and 2nd player in the activePlayers array", () => {
  //       players[2].hasDealerButton = true;

  //       dealer._deductBlinds();
  //       expect(
  //         dealer.playerManager.activePlayers[0].betChips
  //       ).toHaveBeenCalledWith(10);
  //       expect(
  //         dealer.playerManager.activePlayers[1].betChips
  //       ).toHaveBeenCalledWith(20);
  //       expect(dealer.potManager.pot).toBe(30);
  //     });
  //   });
  // });

  describe("_dealHoleCards", () => {
    it("should deal 2 cards to each active player", () => {
      const players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      const dealer = new Dealer();
      dealer.deck = new Deck();
      dealer.playerManager = new PlayerManager();
      dealer.playerManager.activePlayers = players;

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

  describe("_checkIfBettingRoundIsOver", () => {
    let dealer;
    let players;

    beforeEach(() => {
      dealer = new Dealer();
      dealer.potManager = new PotManager();
      dealer.playerManager = new PlayerManager();
      dealer.gameStageManager = new GameStageManager();
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      players.forEach((player) => (player.currentRoundBet = 20));
      dealer.playerManager.activePlayers = players;

      dealer.gameStageManager.isWaitingForPlayerAction = true;
      dealer.potManager.raiseCounter = 2;
      dealer.potManager.currentBet = 60;
      dealer.potManager.lastRaiseBetAmount = 20;
    });

    it("should work when the betting round is over, resetting state", () => {
      dealer.playerManager.lastPlayerToAct = players[0];

      dealer._checkIfBettingRoundIsOver(players[0]);

      expect(dealer.gameStageManager.isWaitingForPlayerAction).toBe(false);
      expect(dealer.potManager.raiseCounter).toBe(0);
      expect(dealer.potManager.currentBet).toBe(0);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(0);
      players.forEach((player) => {
        expect(player.currentRoundBet).toBe(0);
      });
    });

    it("should work when the betting round is not over", () => {
      dealer.playerManager.playerToAct = players[0];
      dealer.playerManager.lastPlayerToAct = players[1];

      dealer._checkIfBettingRoundIsOver(players[0]);

      expect(dealer.gameStageManager.isWaitingForPlayerAction).toBe(true);
      expect(dealer.potManager.raiseCounter).toBe(2);
      expect(dealer.potManager.currentBet).toBe(60);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(20);
      players.forEach((player) => {
        expect(player.currentRoundBet).toBe(20);
      });
    });
  });

  describe("_clearPlayerCards", () => {
    it("should remove all cards from the players", () => {
      const dealer = new Dealer();
      dealer.playerManager = new PlayerManager();
      const players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      players.forEach((player) => player.addCard("card"));
      dealer.playerManager.activePlayers = players;
      dealer._clearPlayerCards();

      players.forEach((player) => {
        expect(player.cards).toHaveLength(0);
      });
    });
  });

  describe("_handleBetAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      dealer.potManager = new PotManager();
      dealer.playerManager = new PlayerManager();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      dealer.playerManager.activePlayers = players;
      dealer.playerManager.playerToAct = players[0];

      dealer._handleBetAction(players[0], 20);

      expect(dealer.potManager.currentBet).toBe(20);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(20);
      expect(dealer.potManager.raiseCounter).toBe(1);
    });
  });

  describe("_handleCallAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      dealer.potManager = new PotManager();
      dealer.playerManager = new PlayerManager();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      dealer.playerManager.activePlayers = players;
      dealer.playerManager.playerToAct = players[1];
      dealer.playerManager.lastPlayerToAct = players[2];
      dealer.potManager.currentBet = 20;
      dealer.potManager.pot = 20;
      dealer.potManager.raiseCounter = 1;

      dealer._handleCallAction(players[1], 20);

      expect(dealer.potManager.pot).toBe(40);
    });
  });

  describe("_handleRaiseAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      dealer.potManager = new PotManager();
      dealer.playerManager = new PlayerManager();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      dealer.playerManager.activePlayers = players;
      dealer.playerManager.playerToAct = players[1];
      dealer.playerManager.lastPlayerToAct = players[2];
      dealer.potManager.currentBet = 20;
      dealer.potManager.lastRaiseBetAmount = 20;
      dealer.potManager.pot = 20;
      dealer.potManager.raiseCounter = 1;

      dealer._handleRaiseAction(players[1], 40);

      expect(dealer.potManager.currentBet).toBe(40);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(20);
      expect(dealer.potManager.raiseCounter).toBe(2);
      expect(dealer.potManager.pot).toBe(60);
    });
  });

  describe("_handleAllInAction", () => {
    it("should update the state correctly", () => {
      let dealer = new Dealer();
      dealer.potManager = new PotManager();
      dealer.playerManager = new PlayerManager();
      let players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      players[1].chips = 20;

      dealer.playerManager.activePlayers = players;
      dealer.playerManager.playerToAct = players[1];
      dealer.playerManager.lastPlayerToAct = players[2];
      dealer.potManager.currentBet = 20;
      dealer.potManager.pot = 20;

      dealer._handleAllInAction(players[1]);

      expect(dealer.potManager.pot).toBe(40);
      expect(dealer.playerManager.activePlayers).not.toContain(players[1]);
      expect(dealer.playerManager.playersAllIn).toContain(players[1]);
    });
  });

  describe("_dealCommunityCard", () => {
    let dealer;

    beforeEach(() => {
      dealer = new Dealer();
      dealer.deck = new Deck();
      dealer.deck.shuffle();
      dealer.communityCards = [];
    });

    it("should deal 1 community card", () => {
      const initialDeckLength = dealer.deck.cards.length;
      const initialCommunityCardsLength = dealer.communityCards.length;

      dealer._dealCommunityCard(1);

      const remainingDeckLength = dealer.deck.cards.length;
      const finalCommunityCardsLength = dealer.communityCards.length;

      expect(remainingDeckLength).toBe(initialDeckLength - 2);
      expect(finalCommunityCardsLength).toBe(initialCommunityCardsLength + 1);
    });

    it("should deal 3 community cards", () => {
      const initialDeckLength = dealer.deck.cards.length;
      const initialCommunityCardsLength = dealer.communityCards.length;

      dealer._dealCommunityCard(3);

      const remainingDeckLength = dealer.deck.cards.length;
      const finalCommunityCardsLength = dealer.communityCards.length;

      expect(remainingDeckLength).toBe(initialDeckLength - 4);
      expect(finalCommunityCardsLength).toBe(initialCommunityCardsLength + 3);
    });
  });

  describe("executeNextStage", () => {
    let dealer;

    beforeEach(() => {
      dealer = new Dealer();
      dealer.gameStageManager = new GameStageManager();
      dealer._dealCommunityCard = jest.fn();
      dealer._determineWinner = jest.fn();
    });

    it("should deal 3 community cards on FLOP stage", () => {
      dealer.gameStageManager.getStage = jest.fn().mockReturnValue(STAGES.FLOP);

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).toHaveBeenCalledWith(3);
      expect(dealer._determineWinner).not.toHaveBeenCalled();
    });

    it("should deal 1 community card on TURN stage", () => {
      dealer.gameStageManager.getStage = jest.fn().mockReturnValue(STAGES.TURN);

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).toHaveBeenCalledWith(1);
      expect(dealer._determineWinner).not.toHaveBeenCalled();
    });

    it("should deal 1 community card on RIVER stage", () => {
      dealer.gameStageManager.getStage = jest
        .fn()
        .mockReturnValue(STAGES.RIVER);

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).toHaveBeenCalledWith(1);
      expect(dealer._determineWinner).not.toHaveBeenCalled();
    });

    it("should determine the winner on SHOWDOWN stage", () => {
      dealer.gameStageManager.getStage = jest
        .fn()
        .mockReturnValue(STAGES.SHOWDOWN);

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).not.toHaveBeenCalled();
      expect(dealer._determineWinner).toHaveBeenCalled();
    });

    it("should throw an error for invalid game stage", () => {
      dealer.gameStageManager.getStage = jest
        .fn()
        .mockReturnValue("INVALID_STAGE");

      expect(() => dealer.executeNextStage()).toThrow("Invalid game stage");
      expect(dealer._dealCommunityCard).not.toHaveBeenCalled();
      expect(dealer._determineWinner).not.toHaveBeenCalled();
    });
  });

  describe("Betting round", () => {
    let dealer;
    let players;
    let gameRules;
    let gameRuleValidator;
    let potManager;
    let playerManager;
    let deck;
    let gameStageManager;

    beforeEach(() => {
      deck = new Deck();
      gameRules = new GameRules("no limit", 10, 20, 9, 4);
      potManager = new PotManager(gameRules);
      playerManager = new PlayerManager();
      gameStageManager = new GameStageManager();
      gameRuleValidator = new NoLimitRuleValidator(gameRules);
      dealer = new Dealer(
        gameRuleValidator,
        potManager,
        playerManager,
        deck,
        gameStageManager,
        gameRules
      );
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
      expect(dealer.gameStageManager.stage).toBe("preFlop");

      expect(dealer.playerManager.playerToAct).toBe(players[0]);
      expect(dealer.playerManager.lastPlayerToAct).toBe(players[2]);

      expect(dealer.potManager.pot).toBe(30);
      expect(players[1].chips).toBe(990);
      expect(players[2].chips).toBe(980);

      dealer.handlePlayerAction(players[0], { type: "raise", amount: 100 });

      expect(dealer.potManager.currentBet).toBe(100);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(80);
      expect(dealer.potManager.raiseCounter).toBe(1);
      expect(dealer.potManager.pot).toBe(130);

      expect(dealer.playerManager.playerToAct).toBe(players[1]);
      expect(dealer.playerManager.lastPlayerToAct).toBe(players[2]);

      dealer.handlePlayerAction(players[1], { type: "raise", amount: 200 });

      expect(dealer.potManager.currentBet).toBe(200);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(100);
      expect(dealer.potManager.raiseCounter).toBe(2);
      expect(dealer.potManager.pot).toBe(320);

      expect(dealer.playerManager.playerToAct).toBe(players[2]);
      expect(dealer.playerManager.lastPlayerToAct).toBe(players[0]);

      dealer.handlePlayerAction(players[2], { type: "raise", amount: 300 });
      expect(dealer.potManager.currentBet).toBe(300);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(100);
      expect(dealer.potManager.raiseCounter).toBe(3);
      expect(dealer.potManager.pot).toBe(600);

      expect(dealer.playerManager.playerToAct).toBe(players[0]);
      expect(dealer.playerManager.lastPlayerToAct).toBe(players[1]);

      dealer.handlePlayerAction(players[0], { type: "raise", amount: 400 });
      expect(dealer.potManager.currentBet).toBe(400);
      expect(dealer.potManager.lastRaiseBetAmount).toBe(100);
      expect(dealer.potManager.raiseCounter).toBe(4);
      expect(dealer.potManager.pot).toBe(900);

      expect(dealer.playerManager.playerToAct).toBe(players[1]);
      expect(dealer.playerManager.lastPlayerToAct).toBe(players[2]);

      dealer.handlePlayerAction(players[1], { type: "fold" });
      expect(dealer.playerManager.activePlayers).not.toContain(players[1]);

      expect(dealer.playerManager.playerToAct).toBe(players[2]);
      expect(dealer.playerManager.lastPlayerToAct).toBe(players[2]);

      dealer.handlePlayerAction(players[2], { type: "call", amount: 400 });
      expect(dealer.potManager.pot).toBe(1000);

      expect(dealer.gameStageManager.isWaitingForPlayerAction).toBe(false);
      expect(dealer.gameStageManager.stage).toBe("flop");

      expect(players[0].chips).toBe(600);
      expect(players[1].chips).toBe(800);
      expect(players[2].chips).toBe(600);
    });
  });
});
