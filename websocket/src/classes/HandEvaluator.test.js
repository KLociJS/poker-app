const HandEvaluator = require("./HandEvaluator");

describe("HandEvaluator", () => {
  describe("determineWinner", () => {
    it("should return the player with the best hand when there is a single winner", () => {
      const evaluator = new HandEvaluator();
      const players = [
        {
          cards: [
            { rank: "A", suit: "s" },
            { rank: "K", suit: "h" },
          ],
        },
        {
          cards: [
            { rank: "Q", suit: "d" },
            { rank: "J", suit: "c" },
          ],
        },
        {
          cards: [
            { rank: "T", suit: "s" },
            { rank: "9", suit: "h" },
          ],
        },
      ];
      const communityCards = [
        { rank: "A", suit: "h" },
        { rank: "K", suit: "d" },
        { rank: "Q", suit: "s" },
        { rank: "J", suit: "h" },
        { rank: "T", suit: "d" },
      ];

      const winner = evaluator.determineWinner(players, communityCards);

      expect(winner[0]).toEqual(players[0]);
    });

    it("should return an array of players when there are multiple winners", () => {
      const evaluator = new HandEvaluator();
      const players = [
        {
          cards: [
            { rank: "A", suit: "S" },
            { rank: "K", suit: "H" },
          ],
        },
        {
          cards: [
            { rank: "A", suit: "D" },
            { rank: "K", suit: "C" },
          ],
        },
        {
          cards: [
            { rank: "A", suit: "H" },
            { rank: "K", suit: "D" },
          ],
        },
      ];
      const communityCards = [
        { rank: "Q", suit: "S" },
        { rank: "J", suit: "H" },
        { rank: "10", suit: "D" },
        { rank: "9", suit: "C" },
        { rank: "8", suit: "S" },
      ];

      const winners = evaluator.determineWinner(players, communityCards);

      expect(winners).toEqual(players);
    });
  });
});
