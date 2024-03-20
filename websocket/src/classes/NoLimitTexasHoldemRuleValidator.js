class NoLimitTexasHoldemRuleValidator {
  validatePlayerAction(
    player,
    nextPlayerToAct,
    action,
    currentBet,
    lastRaiseBetAmount,
    raiseCounter,
    isWaitingForPlayerAction
  ) {
    if (!isWaitingForPlayerAction) {
      throw new Error("Invalid player action: Not waiting for player action");
    }
    // Check if the player is the one to act
    if (player.id !== nextPlayerToAct.id) {
      throw new Error("Invalid player action: Not player's turn");
    }

    // Check if player able to check
    if (action.type === "check" && lastRaiseBetAmount !== 0) {
      throw new Error("Invalid player action: Cannot check when bet is made");
    }

    // Check if player able to raise
    if (action.type === "raise" && raiseCounter > 3) {
      throw new Error("Invalid player action: Raise limit reached");
    }

    // Check if the player able to bet
    if (action.type === "bet" && currentBet !== 0) {
      throw new Error(
        "Invalid player action: Cannot bet when bet is already made"
      );
    }

    // Check if the player able to call
    if (action.type === "call" && lastRaiseBetAmount === 0) {
      throw new Error("Invalid player action: Cannot call when no bet is made");
    }

    // Check if the player able to raise
    if (action.type === "raise" && lastRaiseBetAmount === 0) {
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

    // Check if the player has enough chips to call or raise the amount they wants
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

module.exports = NoLimitTexasHoldemRuleValidator;
