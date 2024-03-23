const { DECK } = require("../constants/cards");
const Deck = require("./deck");

describe("Deck", () => {
  let deck;

  beforeEach(() => {
    deck = new Deck();
  });

  it("should initialize with an empty array of cards", () => {
    expect(deck.cards).toEqual([]);
  });

  it("should draw a card from the deck", () => {
    deck.cards = [...DECK];
    const drawnCard = deck.drawCard();
    expect(drawnCard).toStrictEqual({ rank: "A", suit: "c" });
    expect(deck.cards).toEqual([...DECK].slice(0, -1));
  });

  it("should burn a card from the deck", () => {
    deck.cards = [...DECK];
    deck.burnCard();
    expect(deck.cards).toEqual([...DECK].slice(0, -1));
  });

  it("should shuffle the deck", () => {
    const originalCards = [...DECK];
    deck.shuffle();
    expect(deck.cards.length).toBe(originalCards.length);
    originalCards.forEach((card) => {
      expect(deck.cards).toContain(card);
    });
  });
});
