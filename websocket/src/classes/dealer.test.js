const STAGES = require("../constants/handCycleStage");
const HandEvaluator = require("./HandEvaluator");
const NoLimitRuleValidator = require("./NoLimitRuleValidator");
const Dealer = require("./dealer");
const Deck = require("./deck");
const GameRules = require("./gameRules");
const GameStageManager = require("./gameStageManager");
const Player = require("./player");
const PlayerManager = require("./playerManager");
const PotManager = require("./potManager");

describe("Dealer", () => {
  describe("_dealHoleCards", () => {
    it("should deal 2 cards to each active player", () => {
      const players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      const dealer = new Dealer();
      dealer.deck = new Deck();
      const originalDeck = [...dealer.deck.cards];
      dealer.playerManager = new PlayerManager();
      dealer.playerManager.activePlayers = players;

      const initialDeckLength = originalDeck.length;
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
        player.cards.forEach((card) => {
          expect(originalDeck).toContainEqual(card);
          expect(dealer.deck.cards).not.toContainEqual(card);
        });
      });
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

      dealer._handleCallCurrentBetAction(players[1]);

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

      dealer._handleRaiseCurrentBetToAction(players[1], 40);

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
      dealer.playerManager = new PlayerManager();
      dealer.playerManager.setFirstAndLastPlayerToAct = jest.fn();
      dealer._dealCommunityCard = jest.fn();
      dealer._executeShowdown = jest.fn();
    });

    it("should deal 3 community cards on FLOP stage", () => {
      dealer.gameStageManager.getState = jest
        .fn()
        .mockReturnValue({ stage: STAGES.FLOP });

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).toHaveBeenCalledWith(3);
      expect(dealer._executeShowdown).not.toHaveBeenCalled();
    });

    it("should deal 1 community card on TURN stage", () => {
      dealer.gameStageManager.getState = jest
        .fn()
        .mockReturnValue({ stage: STAGES.TURN });

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).toHaveBeenCalledWith(1);
      expect(dealer._executeShowdown).not.toHaveBeenCalled();
    });

    it("should deal 1 community card on RIVER stage", () => {
      dealer.gameStageManager.getState = jest
        .fn()
        .mockReturnValue({ stage: STAGES.RIVER });

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).toHaveBeenCalledWith(1);
      expect(dealer._executeShowdown).not.toHaveBeenCalled();
    });

    it("should determine the winner on SHOWDOWN stage", () => {
      dealer.gameStageManager.getState = jest
        .fn()
        .mockReturnValue({ stage: STAGES.SHOWDOWN });

      dealer.executeNextStage();

      expect(dealer._dealCommunityCard).not.toHaveBeenCalled();
      expect(dealer._executeShowdown).toHaveBeenCalled();
    });

    it("should throw an error for invalid game stage", () => {
      dealer.gameStageManager.getState = jest
        .fn()
        .mockReturnValue("INVALID_STAGE");

      expect(() => dealer.executeNextStage()).toThrow("Invalid game stage");
      expect(dealer._dealCommunityCard).not.toHaveBeenCalled();
      expect(dealer._executeShowdown).not.toHaveBeenCalled();
    });
  });

  describe("_executeShowdown", () => {
    let dealer;
    let playerManager;
    let potManager;
    let handEvaluator;
    let communityCards;

    beforeEach(() => {
      dealer = new Dealer();
      playerManager = new PlayerManager();
      potManager = new PotManager();
      handEvaluator = new HandEvaluator();
      communityCards = [
        { rank: "A", suit: "H" },
        { rank: "8", suit: "c" },
        { rank: "Q", suit: "H" },
        { rank: "J", suit: "c" },
        { rank: "5", suit: "H" },
      ];

      dealer.playerManager = playerManager;
      dealer.potManager = potManager;
      dealer.handEvaluator = handEvaluator;
      dealer.communityCards = communityCards;
    });

    it("should distribute the pot to the winner when there are no all-in players", () => {
      const activePlayers = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];

      dealer.playerManager.getActivePlayers = jest
        .fn()
        .mockReturnValue(activePlayers);
      dealer.playerManager.getAllInPlayers = jest.fn().mockReturnValue([]);
      dealer.handEvaluator.determineWinner = jest
        .fn()
        .mockReturnValue([activePlayers[1]]);

      dealer.potManager.getState = jest.fn().mockReturnValue({ pot: 20 });
      dealer.potManager.awardPot = jest.fn();

      dealer._executeShowdown();

      expect(dealer.handEvaluator.determineWinner).toHaveBeenCalledWith(
        activePlayers,
        communityCards
      );
      expect(dealer.potManager.awardPot).toHaveBeenCalledWith([
        activePlayers[1],
      ]);
    });
  });

  describe("betting round", () => {
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

    it("should update game state correctly on 2+ round raises", () => {
      dealer.executePreFlop(players);
      dealer.handlePlayerAction(players[0], { type: "raise", amount: 100 });
      dealer.handlePlayerAction(players[1], { type: "raise", amount: 200 });
      dealer.handlePlayerAction(players[2], { type: "raise", amount: 300 });
      dealer.handlePlayerAction(players[0], { type: "raise", amount: 400 });
      dealer.handlePlayerAction(players[1], { type: "fold" });
      dealer.handlePlayerAction(players[2], { type: "call" });

      expect(dealer.potManager.pot).toBe(1000);

      expect(dealer.gameStageManager.isWaitingForPlayerAction).toBe(false);
      expect(dealer.gameStageManager.stage).toBe("flop");

      expect(players[0].chips).toBe(600);
      expect(players[1].chips).toBe(800);
      expect(players[2].chips).toBe(600);
    });

    it("should update game state correctly on checks", () => {
      dealer.executePreFlop(players);
      dealer.handlePlayerAction(players[0], { type: "call" });
      dealer.handlePlayerAction(players[1], { type: "call" });
      dealer.handlePlayerAction(players[2], { type: "check" });

      dealer.executeNextStage();
      dealer.handlePlayerAction(players[0], { type: "check" });
      dealer.handlePlayerAction(players[1], { type: "check" });
      dealer.handlePlayerAction(players[2], { type: "check" });

      expect(dealer.potManager.pot).toBe(60);

      expect(dealer.gameStageManager.isWaitingForPlayerAction).toBe(false);
      expect(dealer.gameStageManager.stage).toBe("turn");

      expect(players[0].chips).toBe(980);
      expect(players[1].chips).toBe(980);
      expect(players[2].chips).toBe(980);
    });

    it("should update game state correctly on all-in", () => {
      dealer.executePreFlop(players);
      dealer.handlePlayerAction(players[0], { type: "allIn" });
      dealer.handlePlayerAction(players[1], { type: "call" });
      expect(players[0].chips).toBe(0);
      expect(players[1].chips).toBe(0);
      dealer.handlePlayerAction(players[2], { type: "fold" });

      expect(dealer.potManager.pot).toBe(2020);

      expect(dealer.gameStageManager.isWaitingForPlayerAction).toBe(false);
      expect(dealer.gameStageManager.stage).toBe("flop");

      expect(players[0].chips).toBe(0);
      expect(players[1].chips).toBe(0);
      expect(players[2].chips).toBe(980);
    });
  });

  describe("complete hand cycle", () => {
    let dealer;
    let players;
    let gameRules;
    let gameRuleValidator;
    let potManager;
    let playerManager;
    let deck;
    let gameStageManager;
    let handEvaluator;

    beforeEach(() => {
      players = [
        new Player("Alice", 1),
        new Player("Bob", 2),
        new Player("Charlie", 3),
      ];
      players[0].hasDealerButton = true;
      players.forEach((player) => player.setChips(1000));
      deck = new Deck();
      gameRules = new GameRules("no limit", 10, 20, 9, 4);
      potManager = new PotManager(gameRules);
      playerManager = new PlayerManager();
      handEvaluator = new HandEvaluator();
      gameStageManager = new GameStageManager();
      gameRuleValidator = new NoLimitRuleValidator(gameRules);
      dealer = new Dealer(
        gameRuleValidator,
        potManager,
        playerManager,
        deck,
        gameStageManager,
        gameRules,
        handEvaluator
      );
    });

    it("should pick the right winner and reward pot to one player", () => {
      const hand1 = [
        { rank: "A", suit: "c" },
        { rank: "J", suit: "c" },
      ];
      const hand2 = [
        { rank: "K", suit: "c" },
        { rank: "T", suit: "c" },
      ];
      const hand3 = [
        { rank: "Q", suit: "c" },
        { rank: "9", suit: "c" },
      ];

      const communityCards = [
        { rank: "7", suit: "c" },
        { rank: "6", suit: "c" },
        { rank: "5", suit: "c" },
        { rank: "3", suit: "c" },
        { rank: "A", suit: "d" },
      ];

      dealer.executePreFlop(players);
      players[0].cards = hand1;
      players[1].cards = hand3;
      players[2].cards = hand2;

      dealer.handlePlayerAction(players[0], { type: "call" }); // 20
      dealer.handlePlayerAction(players[1], { type: "call" }); // 40
      dealer.handlePlayerAction(players[2], { type: "check" }); // 60

      dealer.executeNextStage();
      dealer.handlePlayerAction(players[0], { type: "check" });
      dealer.handlePlayerAction(players[1], { type: "bet", amount: 20 }); // 80
      dealer.handlePlayerAction(players[2], { type: "call" }); // 100
      dealer.handlePlayerAction(players[0], { type: "call" }); // 120

      dealer.executeNextStage();
      dealer.handlePlayerAction(players[0], { type: "bet", amount: 20 }); // 140
      dealer.handlePlayerAction(players[1], { type: "call" }); // 160
      dealer.handlePlayerAction(players[2], { type: "raise", amount: 50 }); // 210
      dealer.handlePlayerAction(players[0], { type: "call" }); // 240
      dealer.handlePlayerAction(players[1], { type: "call" }); // 270

      dealer.executeNextStage();
      dealer.handlePlayerAction(players[0], { type: "check" });
      dealer.handlePlayerAction(players[1], { type: "check" });
      dealer.handlePlayerAction(players[2], { type: "check" });

      expect(dealer.potManager.pot).toBe(270);
      dealer.communityCards = communityCards;

      dealer.executeNextStage();
      expect(dealer.gameStageManager.stage).toBe("showdown");
      expect(players[0].chips).toBe(1180);
      expect(players[1].chips).toBe(910);
      expect(players[2].chips).toBe(910);
    });

    it("should pick the right winners and reward pot to two players", () => {
      const hand1 = [
        { rank: "A", suit: "c" },
        { rank: "J", suit: "c" },
      ];
      const hand2 = [
        { rank: "A", suit: "s" },
        { rank: "J", suit: "s" },
      ];
      const hand3 = [
        { rank: "Q", suit: "c" },
        { rank: "9", suit: "c" },
      ];

      const communityCards = [
        { rank: "7", suit: "c" },
        { rank: "6", suit: "c" },
        { rank: "5", suit: "h" },
        { rank: "3", suit: "h" },
        { rank: "A", suit: "d" },
      ];

      dealer.executePreFlop(players);
      players[0].cards = hand1;
      players[1].cards = hand3;
      players[2].cards = hand2;

      dealer.handlePlayerAction(players[0], { type: "call" }); // 20
      dealer.handlePlayerAction(players[1], { type: "call" }); // 40
      dealer.handlePlayerAction(players[2], { type: "check" }); // 60

      dealer.executeNextStage();
      dealer.handlePlayerAction(players[0], { type: "check" });
      dealer.handlePlayerAction(players[1], { type: "bet", amount: 20 }); // 80
      dealer.handlePlayerAction(players[2], { type: "call" }); // 100
      dealer.handlePlayerAction(players[0], { type: "call" }); // 120

      dealer.executeNextStage();
      dealer.handlePlayerAction(players[0], { type: "bet", amount: 20 }); // 140
      dealer.handlePlayerAction(players[1], { type: "call" }); // 160
      dealer.handlePlayerAction(players[2], { type: "raise", amount: 50 }); // 210
      dealer.handlePlayerAction(players[0], { type: "call" }); // 240
      dealer.handlePlayerAction(players[1], { type: "call" }); // 270

      dealer.executeNextStage();
      dealer.handlePlayerAction(players[0], { type: "check" });
      dealer.handlePlayerAction(players[1], { type: "check" });
      dealer.handlePlayerAction(players[2], { type: "check" });

      dealer.communityCards = communityCards;

      expect(dealer.potManager.pot).toBe(270);

      dealer.executeNextStage();
      expect(dealer.gameStageManager.stage).toBe("showdown");
      expect(players[0].chips).toBe(1045); // winner
      expect(players[1].chips).toBe(910);
      expect(players[2].chips).toBe(1045); // winner
    });
  });
});
