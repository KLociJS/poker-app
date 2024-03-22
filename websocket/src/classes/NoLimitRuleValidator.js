const GlobalRuleValidator = require("./globalRuleValidator");

class NoLimitRuleValidator extends GlobalRuleValidator {
  constructor(gameRules) {
    super(gameRules);
  }

  validateGameSpecificRules(player, action, currentBet, lastRaiseBetAmount) {
    // Check if the player able to raise
    if (action.type === "raise" && currentBet === 0) {
      throw new Error(
        "Invalid player action: Cannot raise when no bet is made"
      );
    }

    // Check the players raise amount
    if (
      action.type === "raise" &&
      action.amount + player.currentRoundBet < lastRaiseBetAmount + currentBet
    ) {
      throw new Error("Invalid player action: Raise amount too low");
    }
  }
}

module.exports = NoLimitRuleValidator;
