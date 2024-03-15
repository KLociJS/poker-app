const RANK = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUIT = ["spade", "heart", "diamond", "club"];
const DECK = [];

SUIT.forEach((suit) => {
  RANK.forEach((rank) => {
    DECK.push({ rank, suit });
  });
});

module.exports = {
  DECK,
};
