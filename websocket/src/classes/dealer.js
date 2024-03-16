const { DECK } = require("../constants/cards");
const STAGES = require("../constants/handCycleStage");

class Dealer {
  constructor() {
    this.deck = [...DECK];
    this.communityCards = [];

    this.activePlayers = [];
    this.playersAllIn = [];

    this.isWaitingForPlayerAction = false;
    this.playerToAct = null;
    this.lastPlayerToAct = null;

    this.pot = 0;
    this.raiseCounter = 0;
    this.currentBet = 0;
    this.lastRaiseBetAmount = 0;

    this.dealerButtonPosition = 0;
    this.stage = "preFlop";
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
    this.activePlayers = activePlayers;

    // Deduct small blind and big blind
    this._deductBlinds();

    // Deal hole cards
    this._dealHoleCards(activePlayers);

    // Set first and last player to act
    this._initFirstAndLastPlayerToAct();

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
    if (player.id !== this.playerToAct.id) {
      throw new Error(
        `Invalid player action: Not ${player.name}'s id:${player.id} turn`
      );
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
      action.amount < this.lastRaiseBetAmount + this.currentBet
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
      action.amount < this.currentBet - player.currentRoundBet
    ) {
      throw new Error("Invalid player action: Call amount too low");
    }
  }
  //tested
  _executeCheckAction() {
    this.playerToAct = this._getNextPlayerToAct();
    this._checkIfBettingRoundIsOver(player);
  }
  // tested
  _executeFoldAction(player) {
    player.cleanCards();
    this.playerToAct = this._getNextPlayerToAct();
    this._removeActivePlayer(player);
    this._checkIfBettingRoundIsOver(player);
  }
  //tested
  _executeBetAction(player, amount) {
    player.betChips(amount);
    this.currentBet = amount;
    this.lastRaiseBetAmount = amount;
    this.pot = amount;
    this.raiseCounter = 1;
    this.lastPlayerToAct = this._getLastPlayerToActAfterBetOrRaise(player);
    this.playerToAct = this._getNextPlayerToAct();
  }
  //tested
  _executeCallAction(player, amount) {
    player.betChips(amount);
    this.pot += amount;
    this.playerToAct = this._getNextPlayerToAct();
    this._checkIfBettingRoundIsOver(player);
  }
  //tested
  _executeRaiseAction(player, amount) {
    player.betChips(amount);
    this.lastRaiseBetAmount = amount - this.currentBet;
    this.currentBet = amount;
    this.pot += amount;
    this.raiseCounter++;
    this.lastPlayerToAct = this._getLastPlayerToActAfterBetOrRaise(player);
    this.playerToAct = this._getNextPlayerToAct();
  }
  //tested
  _executeAllInAction(player) {
    this.playersAllIn.push(player);
    this._removeActivePlayer(player);

    if (player.chips > this.currentBet) {
      this.currentBet = player.chips;
      this.lastRaiseBetAmount = player.chips;
      this.raiseCounter++;
    }
    this.pot += player.chips;
    player.betChips(player.chips);

    this.playerToAct = this._getNextPlayerToAct();
    this._checkIfBettingRoundIsOver(player);
  }
  //tested
  _getLastPlayerToActAfterBetOrRaise(bettingPlayer) {
    const bettingPlayerIndex = this.activePlayers.findIndex(
      (p) => p.id === bettingPlayer.id
    );

    if (bettingPlayerIndex === 0) {
      return this.activePlayers[this.activePlayers.length - 1];
    } else {
      return this.activePlayers[bettingPlayerIndex - 1];
    }
  }
  //tested
  _getNextPlayerToAct() {
    const playerIndex = this.activePlayers.findIndex(
      (p) => p.id === this.playerToAct.id
    );

    if (playerIndex === this.activePlayers.length - 1) {
      return this.activePlayers[0];
    } else {
      return this.activePlayers[playerIndex + 1];
    }
  }
  //tested
  _removeActivePlayer(player) {
    this.activePlayers = this.activePlayers.filter((p) => p.id !== player.id);
  }
  //tested
  _checkIfBettingRoundIsOver(player) {
    if (this.lastPlayerToAct.id === player.id) {
      this.isWaitingForPlayerAction = false;
      this.raiseCounter = 0;
      this.currentBet = 0;
      this.lastRaiseBetAmount = 0;

      this.activePlayers.forEach((player) => {
        player.resetCurrentRoundBet();
      });
    }
  }
  //tested
  _deductBlinds() {
    const playersAfterDealer = this.activePlayers.slice(
      this.dealerButtonPosition + 1
    );
    const playersBeforeDealer = this.activePlayers.slice(
      0,
      this.dealerButtonPosition + 1
    );

    const playersInOrder = [...playersAfterDealer, ...playersBeforeDealer];

    playersInOrder[0].betChips(10);
    playersInOrder[1].betChips(20);

    this.pot += 30;
  }
  //tested
  _initFirstAndLastPlayerToAct() {
    const playersAfterDealer = this.activePlayers.slice(
      this.dealerButtonPosition + 1
    );
    const playersBeforeDealer = this.activePlayers.slice(
      0,
      this.dealerButtonPosition + 1
    );

    const playersInOrder = [...playersAfterDealer, ...playersBeforeDealer];
    this.lastPlayerToAct = playersInOrder[1];

    if (playersInOrder.length === 2) {
      this.playerToAct = playersInOrder[0];
    } else {
      this.playerToAct = playersInOrder[2];
    }
  }
  //tested
  _dealCard() {
    const card = this.deck.pop();
    return card;
  }
  //tested
  _dealHoleCards() {
    this._clearPlayerCards();
    this._shuffleCards();

    for (let i = 0; i < this.activePlayers.length * 2; i++) {
      const player = this.activePlayers[i % this.activePlayers.length];
      const card = this._dealCard();
      player.addCard(card);
    }
  }
  //tested
  _clearPlayerCards() {
    this.activePlayers.forEach((player) => {
      player.cleanCards();
    });
  }
  //tested
  _shuffleCards() {
    this.deck = [...DECK];

    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  determineWinner() {
    throw new Error("Not implemented");
  }
}

module.exports = {
  Dealer,
};
