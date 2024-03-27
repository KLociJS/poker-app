const Hand = require("pokersolver").Hand;

class HandEvaluator {
  determineWinner(players, communityCards) {
    const libraryCompatibleCommunityCards = communityCards.map(
      (card) => card.rank + card.suit
    );
    const playerHands = players.map((player) => {
      const libraryCompatibleFirstCard =
        player.cards[0].rank + player.cards[0].suit;
      const libraryCompatibleSecondCard =
        player.cards[1].rank + player.cards[1].suit;

      const hand = Hand.solve([
        libraryCompatibleFirstCard,
        libraryCompatibleSecondCard,
        ...libraryCompatibleCommunityCards,
      ]);

      return {
        player,
        hand,
      };
    });

    const winner = Hand.winners(
      playerHands.map((playerHand) => playerHand.hand)
    );

    if (winner.length === 1) {
      const indexOfWinner = playerHands.findIndex(
        (playerHand) => playerHand.hand === winner[0]
      );
      return [playerHands[indexOfWinner].player];
    } else {
      return winner
        .map((winningHand) =>
          playerHands.find((playerHand) => playerHand.hand === winningHand)
        )
        .map((playerHand) => playerHand.player);
    }
  }
}

module.exports = HandEvaluator;
