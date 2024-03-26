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
    this.resetBettingRoundState();
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

  addToPot(amount) {
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
    this.addToPot(smallBlind + bigBlind);
  }

  awardPot(winner) {
    const distributedPot = this.pot / winner.length;

    winner.forEach((player) => {
      player.awardChips(distributedPot);
      player.deductTotalHandCycleBet(distributedPot);
      this.pot -= distributedPot;
    });
  }

  areAllPlayersBettingEqually(activePlayers, allInPlayers) {
    return [...activePlayers, ...allInPlayers].every(
      (player) =>
        player.totalHandCycleBet === activePlayers[0].totalHandCycleBet
    );
  }

  calculateSidePots(activePlayers, allInPlayers) {
    return [
      ...allInPlayers.map((p) => p.totalHandCycleBet),
      activePlayers[0].totalHandCycleBet,
    ]
      .sort((a, b) => a - b)
      .map((p, i, arr) => {
        return i === 0 ? p : p - arr[i - 1];
      })
      .filter((p) => p !== 0);
  }
}

module.exports = PotManager;
