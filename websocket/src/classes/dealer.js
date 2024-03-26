const STAGES = require("../constants/handCycleStage");

class Dealer {
  constructor(
    playerActionValidator,
    potManager,
    playerManager,
    deck,
    gameStageManager,
    gameRules,
    handEvaluator
  ) {
    this.gameRules = gameRules;
    this.deck = deck;
    this.playerManager = playerManager;
    this.potManager = potManager;
    this.playerActionValidator = playerActionValidator;
    this.communityCards = [];
    this.gameStageManager = gameStageManager;
    this.handEvaluator = handEvaluator;
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

  executeNextStage() {
    const stage = this.gameStageManager.getStage();

    switch (stage) {
      case STAGES.FLOP:
        this._dealCommunityCard(3);
        break;
      case STAGES.TURN:
        this._dealCommunityCard(1);
        break;
      case STAGES.RIVER:
        this._dealCommunityCard(1);
        break;
      case STAGES.SHOWDOWN:
        this._executeShowdown();
        break;
      default:
        throw new Error("Invalid game stage");
    }
  }

  _dealCommunityCard(numberOfCards) {
    const cards = [];
    this.deck.burnCard();
    for (let i = 0; i < numberOfCards; i++) {
      cards.push(this.deck.drawCard());
    }
    this.communityCards.push(...cards);
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

  _executeShowdown() {
    const activePlayers = this.playerManager.getActivePlayers();
    const allInPlayers = this.playerManager.getAllInPlayers();

    if (allInPlayers.length === 0) {
      const winner = this.handEvaluator.determineWinner(
        activePlayers,
        this.communityCards
      );
      const winnerCount = winner.length;
      const distributedPot = this.potManager.getState().pot / winnerCount;
      winner.forEach((player) => {
        this.potManager.awardPot(player, distributedPot);
      });
      this.potManager.resetState();
    } else {
      let pots = [
        ...allInPlayers.map((p) => p.totalHandCycleBet),
        activePlayers[0].totalHandCycleBet,
      ];
      pots.sort((a, b) => a - b);
      pots = pots
        .map((p, i) => {
          return i === 0 ? p : p - pots[i - 1];
        })
        .filter((p) => p === 0);

      pots.forEach((pot) => {
        const playersEligibleForPot = [
          ...allInPlayers.filter((p) => p.totalHandCycleBet >= pot),
          ...activePlayers,
        ];
        const winner = this.handEvaluator.determineWinner(
          playersEligibleForPot,
          this.communityCards
        );
        const winnerCount = winner.length;
        const distributedPot = pot / winnerCount;
        winner.forEach((player) => {
          this.potManager.awardPot(player, distributedPot);
          player.deductTotalHandCycleBet(distributedPot);
        });
      });
    }
  }
}

module.exports = Dealer;
