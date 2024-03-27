const GlobalRuleValidator = require("./globalRuleValidator");

class PotLimitRuleValidator extends GlobalRuleValidator {
  constructor(gameRules) {
    super(gameRules);
  }

  validateGameSpecificRules(
    player,
    action,
    currentBet,
    lastRaiseBetAmount,
    pot
  ) {
    // Check if player is able to raise
    if (action.type === "raise" && currentBet === 0) {
      throw new Error(
        "Invalid player action: Cannot raise when no bet is made"
      );
    }

    // Check if the players raised at least the minimum raise amount
    if (
      action.type === "raise" &&
      action.amount + player.currentRoundBet < lastRaiseBetAmount + currentBet
    ) {
      throw new Error("Invalid player action: Raise amount too low");
    }

    // Check if player exceeds the raise amount limit
    if (
      action.type === "raise" &&
      action.amount + player.currentRoundBet > pot
    ) {
      throw new Error("Invalid player action: Raise amount too high");
    }
  }
}

module.exports = PotLimitRuleValidator;
