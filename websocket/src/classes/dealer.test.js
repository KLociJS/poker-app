const { DECK } = require("../constants/cards");
const { Dealer } = require("./dealer");
const { Player } = require("./player");

describe("Dealer", () => {
  describe("_shuffleCards", () => {
    it("should shuffle the deck of cards", () => {
      const dealer = new Dealer();
      const originalDeck = [...dealer.deck];
      dealer._shuffleCards();

      expect(dealer.deck).toHaveLength(originalDeck.length);
      expect(dealer.deck).toEqual(expect.arrayContaining(originalDeck));
    });
  });

  describe("_dealCard", () => {
    it("should deal a card from the deck", () => {
      const dealer = new Dealer();
      const originalDeck = [...dealer.deck];
      const card = dealer._dealCard();

      expect(dealer.deck).toHaveLength(originalDeck.length - 1);
      expect(originalDeck).toContain(card);
      expect(dealer.deck).not.toContain(card);
    });
  });

  describe("_deductBlinds", () => {
    describe("2 players, big blind, small blind", () => {
      let dealer;
      let players;

      beforeEach(() => {
        dealer = new Dealer();
        players = [{ betChips: jest.fn() }, { betChips: jest.fn() }];
        dealer.activePlayers = players;
      });

      it("should deduct blinds from the 2nd and 1st player in the activePlayers array", () => {
        dealer.dealerButtonPosition = 0;
        dealer._deductBlinds();
        expect(dealer.activePlayers[1].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[0].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });

      it("should deduct blinds from the 1st and 2nd player in the activePlayers array", () => {
        dealer.dealerButtonPosition = 1;
        dealer._deductBlinds();
        expect(dealer.activePlayers[0].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[1].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });
    });

    describe("3 players, big blind, small blind", () => {
      let dealer;
      let players;

      beforeEach(() => {
        dealer = new Dealer();
        players = [
          { betChips: jest.fn() },
          { betChips: jest.fn() },
          { betChips: jest.fn() },
        ];
        dealer.activePlayers = players;
      });

      it("should deduct blinds from the 2nd and 3rd player in the activePlayers array", () => {
        dealer.dealerButtonPosition = 0;
        dealer._deductBlinds();
        expect(dealer.activePlayers[1].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[2].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });

      it("should deduct blinds from the 3rd and 1st player in the activePlayers array", () => {
        dealer.dealerButtonPosition = 1;

        dealer._deductBlinds();
        expect(dealer.activePlayers[2].betChips).toHaveBeenCalledWith(10);
        expect(dealer.activePlayers[0].betChips).toHaveBeenCalledWith(20);
        expect(dealer.pot).toBe(30);
      });

      it("should deduct blinds from the 1st and 2nd player in the activePlayers array", () => {
        dealer.dealerButtonPosition = 2;

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

      const remainingDeckLength = dealer.deck.length;
      const finalPlayerCardCounts = players.map(
        (player) => player.cards.length
      );

      expect(remainingDeckLength).toBe(initialDeckLength - players.length * 2);
      expect(finalPlayerCardCounts).toEqual([2, 2, 2]);
      expect(initialPlayerCardCounts).toEqual([0, 0, 0]);

      players.forEach((player) => {
        expect(player.cards.every((card) => DECK.includes(card))).toBe(true);
        expect(player.cards.every((card) => dealer.deck.includes(card))).toBe(
          false
        );
      });

      expect(dealer.deck.every((card) => DECK.includes(card))).toBe(true);
    });
  });

  describe("_initFirstAndLastPlayerToAct", () => {
    describe("2 players", () => {
      let dealer;
      let players;

      beforeEach(() => {
        dealer = new Dealer();
        players = [new Player("Alice", 1), new Player("Bob", 2)];
        dealer.activePlayers = players;
      });

      it("should set the first and last players to act", () => {
        dealer.dealerButtonPosition = 0;
        dealer._initFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[1]);
        expect(dealer.lastPlayerToAct).toBe(players[0]);
      });

      it("should set the first and last players to act", () => {
        dealer.dealerButtonPosition = 1;
        dealer._initFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[0]);
        expect(dealer.lastPlayerToAct).toBe(players[1]);
      });
    });

    describe("3 players", () => {
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
        dealer.dealerButtonPosition = 0;
        dealer._initFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[0]);
        expect(dealer.lastPlayerToAct).toBe(players[2]);
      });

      it("should set the first and last players to act", () => {
        dealer.dealerButtonPosition = 1;
        dealer._initFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[1]);
        expect(dealer.lastPlayerToAct).toBe(players[0]);
      });

      it("should set the first and last players to act", () => {
        dealer.dealerButtonPosition = 2;
        dealer._initFirstAndLastPlayerToAct();
        expect(dealer.playerToAct).toBe(players[2]);
        expect(dealer.lastPlayerToAct).toBe(players[1]);
      });
    });
  });
});
