const { DECK } = require("../constants/cards");
const Deck = require("./deck");

describe("Deck", () => {
  let deck;
  let originalDeck;

  beforeEach(() => {
    deck = new Deck();
    originalDeck = [...deck.cards];
  });

  it("should draw a card from the deck", () => {
    const drawnCard = deck.drawCard();
    expect(drawnCard).toStrictEqual({ rank: "A", suit: "c" });
    expect(deck.cards).toEqual(originalDeck.slice(0, -1));
  });

  it("should burn a card from the deck", () => {
    deck.burnCard();
    expect(deck.cards).toEqual(originalDeck.slice(0, -1));
  });

  it("should shuffle the deck", () => {
    deck.shuffle();
    expect(deck.cards.length).toBe(originalDeck.length);
    originalDeck.forEach((card) => {
      expect(deck.cards).toContainEqual(card);
    });
  });
});
