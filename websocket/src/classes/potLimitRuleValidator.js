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
    // Check if the players raised valid amount
    if (
      action.type === "raise" &&
      action.amount + player.currentRoundBet < lastRaiseBetAmount + currentBet
    ) {
      throw new Error("Invalid player action: Raise amount too low");
    }

    // Check if player exceeds the raise amount limit
    if (
      action.type === "raise" &&
      action.amount + player.currentRoundBet >= pot
    ) {
      throw new Error("Invalid player action: Raise amount too high");
    }
  }
}

module.exports = PotLimitRuleValidator;
