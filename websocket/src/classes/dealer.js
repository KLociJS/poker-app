class Dealer {
  constructor(
    playerActionValidator,
    potManager,
    playerManager,
    deck,
    gameStageManager,
    gameRules
  ) {
    this.gameRules = gameRules;
    this.deck = deck;
    this.playerManager = playerManager;
    this.potManager = potManager;

    this.playerActionValidator = playerActionValidator;

    this.communityCards = [];
    this.gameStageManager = gameStageManager;
  }

  executePreFlop(activePlayers) {
    this.communityCards = [];
    this.gameStageManager.initStage();
    this.potManager.resetState();

    // Set active players
    this.playerManager.setActivePlayers(activePlayers);

    // Deduct small blind and big blind
    this.potManager.deductBlinds(activePlayers);

    // Deal hole cards
    this._dealHoleCards();

    // Set first and last player to act
    this.playerManager.setFirstAndLastPlayerToAct();

    // Start betting round
    this.gameStageManager.setIsWaitingForPlayerAction(true);
  }

  handlePlayerAction(player, action) {
    // Validate player action
    this._validatePlayerAction(player, action);

    // Execute player action
    switch (action.type) {
      case "check":
        this._handleCheckAction();
        this._checkIfBettingRoundIsOver(player);
        break;
      case "call":
        this._handleCallAction(player, action.amount);
        this._checkIfBettingRoundIsOver(player);
        break;
      case "raise":
        this._handleRaiseAction(player, action.amount);
        break;
      case "bet":
        this._handleBetAction(player, action.amount);
        break;
      case "fold":
        this._handleFoldAction(player);
        this._checkIfBettingRoundIsOver(player);
        break;
      case "allIn":
        this._handleAllInAction(player);
        this._checkIfBettingRoundIsOver(player);
        break;
      default:
        throw new Error("Invalid player action");
    }
  }
  _validatePlayerAction(player, action) {
    const { currentBet, lastRaiseBetAmount, raiseCounter } =
      this.potManager.getState();
    const playerToAct = this.playerManager.getNextPlayerToAct();
    const isWaitingForPlayerAction =
      this.gameStageManager.getIsWaitingForPlayerAction();
    const { limit } = this.gameRules.getRules();

    this.playerActionValidator.validateGlobalRules(
      player,
      playerToAct,
      action,
      currentBet,
      isWaitingForPlayerAction
    );

    switch (limit) {
      case "no limit":
        this.playerActionValidator.validateGameSpecificRules(
          player,
          action,
          currentBet,
          lastRaiseBetAmount,
          raiseCounter
        );
        break;
      case "fixed limit":
        this.playerActionValidator.validateGameSpecificRules(
          player,
          action,
          currentBet,
          lastRaiseBetAmount,
          raiseCounter
        );
        break;
      case "pot limit":
        this.playerActionValidator.validateGameSpecificRules(
          player,
          action,
          currentBet,
          lastRaiseBetAmount,
          raiseCounter
        );
        break;

      default:
        throw new Error("Invalid game limit");
    }

    this.playerActionValidator.validateGlobalRules(
      player,
      playerToAct,
      action,
      currentBet,
      isWaitingForPlayerAction
    );

    this.playerActionValidator.validateGameSpecificRules(
      player,
      action,
      currentBet,
      lastRaiseBetAmount,
      raiseCounter
    );
  }
  //tested
  _handleCheckAction() {
    this.playerManager.setNextPlayerToAct();
  }
  // tested
  _handleFoldAction(player) {
    player.cleanCards();
    this.playerManager.setNextPlayerToAct();
    this.playerManager.removeActivePlayer(player);
  }
  //tested
  _handleBetAction(player, amount) {
    player.betChips(amount);
    this.potManager.setCurrentBet(amount);
    this.potManager.setLastRaiseBetAmount(amount);
    this.potManager.increasePot(amount);
    this.potManager.incrementRaiseCounter();
    this.playerManager.setLastPlayerToActAfterBetOrRaise(player);
    this.playerManager.setNextPlayerToAct();
  }
  //tested
  _handleCallAction(player, amount) {
    this.potManager.increasePot(amount - player.currentRoundBet);
    player.betChips(amount);
    this.playerManager.setNextPlayerToAct();
  }
  //tested
  _handleRaiseAction(player, amount) {
    const { currentBet } = this.potManager.getState();
    this.potManager.setLastRaiseBetAmount(amount - currentBet);
    this.potManager.setCurrentBet(amount);
    this.potManager.increasePot(amount - player.currentRoundBet);
    this.potManager.incrementRaiseCounter();
    player.betChips(amount);
    this.playerManager.setLastPlayerToActAfterBetOrRaise(player);
    this.playerManager.setNextPlayerToAct();
  }
  //tested
  _handleAllInAction(player) {
    this.playerManager.addAllInPlayer(player);
    this.playerManager.removeActivePlayer(player);

    if (player.chips > this.currentBet) {
      this.potManager.setCurrentBet(player.chips);
      this.potManager.setLastRaiseBetAmount(player.chips);
      this.potManager.incrementRaiseCounter();
      this.playerManager.setLastPlayerToActAfterBetOrRaise(player);
    }
    this.potManager.increasePot(player.chips);
    player.betChips(player.chips);
    this.playerManager.setNextPlayerToAct();
  }
  //tested
  _checkIfBettingRoundIsOver(player) {
    const lastPlayerToAct = this.playerManager.getLastPlayerToAct();
    if (lastPlayerToAct.id === player.id) {
      this.gameStageManager.setIsWaitingForPlayerAction(false);
      this.potManager.resetBettingRoundState();
      const activePlayers = this.playerManager.getActivePlayers();

      activePlayers.forEach((player) => {
        player.resetCurrentRoundBet();
      });

      this.gameStageManager.setNextStage();
    }
  }
  //tested
  _dealHoleCards() {
    this._clearPlayerCards();
    this.deck.shuffle();

    const activePlayers = this.playerManager.getActivePlayers();

    for (let i = 0; i < activePlayers.length * 2; i++) {
      const player = activePlayers[i % activePlayers.length];
      const card = this.deck.drawCard();
      player.addCard(card);
    }
  }
  //tested
  _clearPlayerCards() {
    const activePlayers = this.playerManager.getActivePlayers();
    activePlayers.forEach((player) => {
      player.cleanCards();
    });
  }

  determineWinner() {
    throw new Error("Not implemented");
  }
}

module.exports = Dealer;
