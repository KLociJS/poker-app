class GlobalRuleValidator {
  constructor(gameRules) {
    this.gameRules = gameRules;
  }
  validateGlobalRules(
    player,
    nextPlayerToAct,
    action,
    currentBet,
    isWaitingForPlayerAction,
    raiseCounter
  ) {
    const { raiseCountLimit, bigBlind } = this.gameRules.getRules();
    // Check if the raise limit count reached
    if (action.type === "raise" && raiseCounter >= raiseCountLimit) {
      throw new Error("Invalid player action: Raise limit reached");
    }

    // Check if the player able to raise
    if (action.type === "raise" && currentBet === 0) {
      throw new Error(
        "Invalid player action: Cannot raise when no bet is made"
      );
    }

    // Check if betting round is in progress
    if (!isWaitingForPlayerAction) {
      throw new Error("Invalid player action: Not waiting for player action");
    }

    // Check if the player is the one to act
    if (player.id !== nextPlayerToAct.id) {
      throw new Error("Invalid player action: Not player's turn");
    }

    // Check if player able to check
    if (action.type === "check" && currentBet !== 0) {
      throw new Error("Invalid player action: Cannot check when bet is made");
    }

    // Check if the player able to bet
    if (action.type === "bet" && currentBet !== 0) {
      throw new Error(
        "Invalid player action: Cannot bet when bet is already made"
      );
    }

    // check if the player bets less than the minimum bet
    if (action.type === "bet" && action.amount < bigBlind) {
      throw new Error("Invalid player action: Bet amount too low");
    }

    // Check if the player wants to call when no bet is placed
    if (action.type === "call" && currentBet === 0) {
      throw new Error("Invalid player action: Cannot call when no bet is made");
    }

    // Check if the player has enough chips to call, raise or bet the amount they wants
    if (player.chips < action.amount) {
      throw new Error(
        "Invalid player action: Invalid amount of chips, differs from game state"
      );
    }

    // Check if the user wants to bet, call or raise instead of all in
    if (player.chips === action.amount && action.type !== "allIn") {
      throw new Error("Invalid player action: Use all in instead");
    }

    // Check if the player is calling less than they should
    if (
      action.type === "call" &&
      action.amount + player.currentRoundBet < currentBet
    ) {
      throw new Error("Invalid player action: Call amount too low");
    }
  }
}

module.exports = GlobalRuleValidator;
