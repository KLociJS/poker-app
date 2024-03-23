const RANK = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const SUIT = ["s", "h", "d", "c"];
const DECK = [];

SUIT.forEach((suit) => {
  RANK.forEach((rank) => {
    DECK.push({ rank, suit });
  });
});

module.exports = {
  DECK,
};
