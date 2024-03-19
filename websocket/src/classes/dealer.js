const { DECK } = require("../constants/cards");
const { Deck } = require("./deck");
const STAGES = require("../constants/handCycleStage");
const { PlayerManager } = require("./playerManager");

class Dealer {
  constructor(gameRules) {
    this.gameRules = gameRules;
    this.deck = new Deck();
    this.playerManager = new PlayerManager();
    this.communityCards = [];

    this.isWaitingForPlayerAction = false;

    this.pot = 0;
    this.raiseCounter = 0;
    this.currentBet = 0;
    this.lastRaiseBetAmount = 0;

    this.stage = STAGES.PRE_FLOP;
  }

  executePreFlop(activePlayers) {
    // reset dealer state
    this.communityCards = [];

    this.isWaitingForPlayerAction = false;
    this.playerToAct = null;
    this.lastPlayerToAct = null;

    this.pot = 0;
    this.raiseCounter = 0;
    this.currentBet = 0;
    this.lastRaiseBetAmount = 0;

    this.stage = STAGES.PRE_FLOP;

    // Set active players
    this.playerManager.setActivePlayers(activePlayers);

    // Deduct small blind and big blind
    this._deductBlinds();

    // Deal hole cards
    this._dealHoleCards();

    // Set first and last player to act
    this.playerManager.setFirstAndLastPlayerToAct();

    // Start betting round
    this.isWaitingForPlayerAction = true;
  }

  executePlayerAction(player, action) {
    this._validatePlayerAction(player, action);

    switch (action.type) {
      case "check":
        this._executeCheckAction();
        break;
      case "call":
        this._executeCallAction(player, action.amount);
        break;
      case "raise":
        this._executeRaiseAction(player, action.amount);
        break;
      case "bet":
        this._executeBetAction(player, action.amount);
        break;
      case "fold":
        this._executeFoldAction(player);
        break;
      case "allIn":
        this._executeAllInAction(player);
        break;
      default:
        throw new Error("Invalid player action");
    }
  }
  //tested
  _validatePlayerAction(player, action) {
    // Check if the player is the one to act
    const playerToAct = this.playerManager.getNextPlayerToAct();
    if (player.id !== playerToAct.id) {
      throw new Error("Invalid player action: Not player's turn");
    }

    // Check if player able to check
    if (action.type === "check" && this.lastRaiseBetAmount !== 0) {
      throw new Error("Invalid player action: Cannot check when bet is made");
    }

    // Check if player able to raise
    if (action.type === "raise" && this.raiseCounter > 3) {
      throw new Error("Invalid player action: Raise limit reached");
    }

    // Check if the player able to bet
    if (action.type === "bet" && this.currentBet !== 0) {
      throw new Error(
        "Invalid player action: Cannot bet when bet is already made"
      );
    }

    // Check if the player able to call
    if (action.type === "call" && this.lastRaiseBetAmount === 0) {
      throw new Error("Invalid player action: Cannot call when no bet is made");
    }

    // Check if the player able to raise
    if (action.type === "raise" && this.lastRaiseBetAmount === 0) {
      throw new Error(
        "Invalid player action: Cannot raise when no bet is made"
      );
    }

    // Check the players raise amount
    if (
      action.type === "raise" &&
      action.amount + player.currentRoundBet <
        this.lastRaiseBetAmount + this.currentBet
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
      action.amount + player.currentRoundBet < this.currentBet
    ) {
      throw new Error("Invalid player action: Call amount too low");
    }
  }
  //tested
  _executeCheckAction() {
    this.playerManager.setNextPlayerToAct();
    this._checkIfBettingRoundIsOver(player);
  }
  // tested
  _executeFoldAction(player) {
    player.cleanCards();
    this.playerManager.setNextPlayerToAct();
    this.playerManager.removeActivePlayer(player);
    this._checkIfBettingRoundIsOver(player);
  }
  //tested
  _executeBetAction(player, amount) {
    player.betChips(amount);
    this.currentBet = amount;
    this.lastRaiseBetAmount = amount;
    this.pot += amount;
    this.raiseCounter = 1;
    this.playerManager.setLastPlayerToActAfterBetOrRaise(player);
    this.playerManager.setNextPlayerToAct();
  }
  //tested
  _executeCallAction(player, amount) {
    this.pot += amount - player.currentRoundBet;
    player.betChips(amount);
    this.playerManager.setNextPlayerToAct();
    this._checkIfBettingRoundIsOver(player);
  }
  //tested
  _executeRaiseAction(player, amount) {
    this.lastRaiseBetAmount = amount - this.currentBet;
    this.currentBet = amount;
    this.pot += amount - player.currentRoundBet;
    player.betChips(amount);
    this.raiseCounter++;
    this.playerManager.setLastPlayerToActAfterBetOrRaise(player);
    this.playerManager.setNextPlayerToAct();
  }
  //tested
  _executeAllInAction(player) {
    this.playerManager.addAllInPlayer(player);
    this.playerManager.removeActivePlayer(player);

    if (player.chips > this.currentBet) {
      this.currentBet = player.chips;
      this.lastRaiseBetAmount = player.chips;
      this.raiseCounter++;
      this.playerManager.setLastPlayerToActAfterBetOrRaise(player);
    }
    this.pot += player.chips;
    player.betChips(player.chips);

    this.playerManager.setNextPlayerToAct();
    this._checkIfBettingRoundIsOver(player);
  }
  //tested
  _checkIfBettingRoundIsOver(player) {
    const lastPlayerToAct = this.playerManager.getLastPlayerToAct();
    if (lastPlayerToAct.id === player.id) {
      this.isWaitingForPlayerAction = false;
      this.raiseCounter = 0;
      this.currentBet = 0;
      this.lastRaiseBetAmount = 0;

      const activePlayers = this.playerManager.getActivePlayers();

      activePlayers.forEach((player) => {
        player.resetCurrentRoundBet();
      });

      this._moveToNextStage();
    }
  }
  _moveToNextStage() {
    const stages = Object.values(STAGES);
    const currentStageIndex = stages.findIndex((s) => s === this.stage);
    this.stage = stages[currentStageIndex + 1];
  }
  //tested
  _deductBlinds() {
    const activePlayers = this.playerManager.getActivePlayers();

    const dealerButtonIndex = activePlayers.findIndex((p) => p.hasDealerButton);

    const playersAfterDealer = activePlayers.slice(dealerButtonIndex + 1);
    const playersBeforeDealer = activePlayers.slice(0, dealerButtonIndex + 1);

    const reArrangedPlayers = [...playersAfterDealer, ...playersBeforeDealer];

    const { smallBlind, bigBlind } = this.gameRules.getRules();

    reArrangedPlayers[0].betChips(smallBlind);
    reArrangedPlayers[1].betChips(bigBlind);

    this.pot += smallBlind + bigBlind;
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

module.exports = {
  Dealer,
};
