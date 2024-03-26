const GlobalRuleValidator = require("./globalRuleValidator");

class FixLimitRuleValidator extends GlobalRuleValidator {
  constructor(gameRules) {
    super(gameRules);
  }

  validateGameSpecificRules(
    player,
    action,
    handCycleStage,
    lastRaiseBetAmount,
    currentBet
  ) {
    const { smallBlind, bigBlind } = this.gameRules.getRules();

    // Check if the player raised amount is correct
    if (
      action.type === "raise" &&
      action.amount + player.currentRoundBet !== lastRaiseBetAmount + currentBet
    ) {
      throw new Error("Invalid player action: Invalid raise amount");
    }

    // Check if the players bet amount in pre flop and flop exceeds the small blind
    if (
      action.type === "bet" &&
      action.amount > smallBlind &&
      (handCycleStage === "preFlop" || handCycleStage === "flop")
    ) {
      throw new Error("Invalid player action: Bet amount too high");
    }

    // Check if the players bet amount in turn and river exceeds the big blind
    if (
      (action.type === "bet" && handCycleStage === "turn") ||
      (handCycleStage === "river" && action.amount > bigBlind)
    ) {
      throw new Error("Invalid player action: Bet amount too high");
    }
  }
}

module.exports = FixLimitRuleValidator;
