const Deck = require("./deck");
const PlayerManager = require("./playerManager");
const PotManager = require("./potManager");
const GameStageManager = require("./gameStageManager");

class Dealer {
  constructor(gameRules, gameRuleValidator) {
    this.gameRules = gameRules;
    this.deck = new Deck();
    this.playerManager = new PlayerManager();
    this.potManager = new PotManager();
    this.gameRuleValidator = gameRuleValidator;

    this.communityCards = [];
    this.gameStageManager = new GameStageManager();
  }

  executePreFlop(activePlayers) {
    this.communityCards = [];
    this.gameStageManager.initStage();
    this.potManager.resetState();

    // Set active players
    this.playerManager.setActivePlayers(activePlayers);

    // Deduct small blind and big blind
    const { smallBlind, bigBlind } = this.gameRules.getRules();
    this.potManager.deductBlinds(smallBlind, bigBlind, activePlayers);

    // Deal hole cards
    this._dealHoleCards();

    // Set first and last player to act
    this.playerManager.setFirstAndLastPlayerToAct();

    // Start betting round
    this.gameStageManager.setIsWaitingForPlayerAction(true);
  }

  handlePlayerAction(player, action) {
    // Validate player action
    const { currentBet, lastRaiseBetAmount, raiseCounter } =
      this.potManager.getState();
    const playerToAct = this.playerManager.getNextPlayerToAct();
    const isWaitingForPlayerAction =
      this.gameStageManager.getIsWaitingForPlayerAction();

    this.gameRuleValidator.validatePlayerAction(
      player,
      playerToAct,
      action,
      currentBet,
      lastRaiseBetAmount,
      raiseCounter,
      isWaitingForPlayerAction
    );

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
