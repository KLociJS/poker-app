class TableState {
  constructor(
    id,
    buttonPosition,
    players,
    stake,
    maxPlayers,
    limit,
    handCycleState
  ) {
    this.buttonPosition = buttonPosition;
    this.players = players;
    this.id = id;
    this.stake = stake;
    this.maxPlayers = maxPlayers;
    this.limit = limit;
    this.handCycleState = handCycleState;
  }
}

class handCycleState {
  constructor(
    dealer,
    communityCards,
    playerActionCounter,
    pot,
    currentBet,
    stage,
    isWaitingForPlayerAction
  ) {
    this.dealer = dealer;
    this.communityCards = communityCards;
    this.playerActionCounter = playerActionCounter;
    this.pot = pot;
    this.currentBet = currentBet;
    this.stage = stage;
    this.isWaitingForPlayerAction = isWaitingForPlayerAction;
  }
}

const initTableState = (table) => {
  const handCycle = table.currentHandCycle;
  const currentHandCycleState = new handCycleState(
    handCycle.dealer,
    handCycle.communityCards,
    handCycle.playerActionCounter,
    handCycle.pot,
    handCycle.currentBet,
    handCycle.stage,
    handCycle.isWaitingForPlayerAction
  );
  return new TableState(
    table.id,
    table.buttonPosition,
    table.players,
    table.stakes,
    table.maxPlayers,
    table.limit,
    currentHandCycleState
  );
};

module.exports = {
  initTableState,
};
