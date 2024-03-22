class PotManager {
  constructor(gameRules) {
    this.gameRules = gameRules;
    this.pot = 0;
    this.raiseCounter = 0;
    this.currentBet = 0;
    this.lastRaiseBetAmount = 0;
  }

  resetState() {
    this.pot = 0;
    this.raiseCounter = 0;
    this.currentBet = 0;
    this.lastRaiseBetAmount = 0;
  }

  resetBettingRoundState() {
    this.raiseCounter = 0;
    this.currentBet = 0;
    this.lastRaiseBetAmount = 0;
  }

  getState() {
    return {
      pot: this.pot,
      raiseCounter: this.raiseCounter,
      currentBet: this.currentBet,
      lastRaiseBetAmount: this.lastRaiseBetAmount,
    };
  }

  increasePot(amount) {
    this.pot += amount;
  }

  incrementRaiseCounter() {
    this.raiseCounter++;
  }

  setCurrentBet(amount) {
    this.currentBet = amount;
  }

  setLastRaiseBetAmount(amount) {
    this.lastRaiseBetAmount = amount;
  }

  deductBlinds(activePlayers) {
    const { smallBlind, bigBlind } = this.gameRules.getRules();
    const dealerButtonIndex = activePlayers.findIndex((p) => p.hasDealerButton);

    const playersAfterDealer = activePlayers.slice(dealerButtonIndex + 1);
    const playersBeforeDealer = activePlayers.slice(0, dealerButtonIndex + 1);

    const reArrangedPlayers = [...playersAfterDealer, ...playersBeforeDealer];

    reArrangedPlayers[0].betChips(smallBlind);
    reArrangedPlayers[1].betChips(bigBlind);

    this.setCurrentBet(bigBlind);
    this.setLastRaiseBetAmount(bigBlind);
    this.increasePot(smallBlind + bigBlind);
  }
}

module.exports = PotManager;
