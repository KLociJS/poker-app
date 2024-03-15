const { DECK } = require("../constants/cards");
const STAGES = require("../constants/handCycleStage");

class Dealer {
  constructor() {
    this.deck = [...DECK];
    this.communityCards = [];

    this.activePlayers = [];

    this.isWaitingForPlayerAction = false;
    this.playerToAct = null;
    this.lastPlayerToAct = null;

    this.pot = 0;
    this.raiseCounter = 0;
    this.currentBet = 0;
    this.lastBet = 0;

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
    this.lastBet = 0;

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

  _validatePlayerAction(player, action) {
    // Check if the player is the one to act
    if (player.id !== this.playerToAct.id) {
      throw new Error("Invalid player action: Not your turn");
    }

    // Check if player able to check
    if (action.type === "check" && this.lastBet !== 0) {
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
    if (action.type === "call" && this.lastBet === 0) {
      throw new Error("Invalid player action: Cannot call when no bet is made");
    }

    // Check if the player able to raise
    if (
      (action.type === "raise" && this.lastBet === 0) ||
      action.amount < this.lastBet * 2 + this.currentBet
    ) {
      throw new Error("Invalid player action: Raise amount too low");
    }

    // Check if the player has enough chips to call or raise the amount they wants
    if (
      action.type === "call" ||
      action.type === "raise" ||
      (action.type === "bet" && player.chips < action.amount)
    ) {
      throw new Error("Player does not have enough chips");
    }
  }

  _executeCheckAction() {
    this.playerToAct = this._getNextPlayerToAct();
    this._checkIfBettingRoundEnded();
  }

  _executeFoldAction(player) {
    player.cleanCards();
    this.playerToAct = this._getNextPlayerToAct();
    this.activePlayers = this.activePlayers.filter((p) => p.id !== player.id);
    this._checkIfBettingRoundEnded();
  }

  //Itt hagytam abba
  _executeBetAction(player, amount) {
    player.betChips(amount);
    this.currentBet += amount;
    this.lastBet = amount;
    this.pot += amount;
    this.raiseCounter = 0;
    this.lastPlayerToAct = player;
    this.playerToAct = this._getNextPlayerToAct();
    this._checkIfBettingRoundEnded();
  }

  _getNextPlayerToAct() {
    if (
      this.playerToAct.id ===
      this.activePlayers[this.activePlayers.length - 1].id
    ) {
      return this.activePlayers[0];
    } else {
      const currentPlayerIndex = this.activePlayers.findIndex(
        (p) => p.id === this.playerToAct.id
      );
      return this.activePlayers[currentPlayerIndex + 1];
    }
  }

  _checkIfBettingRoundEnded() {
    if (this.lastPlayerToAct.id === this.playerToAct.id) {
      this.isWaitingForPlayerAction = false;
      this.raiseCounter = 0;
      this.currentBet = 0;
      this.lastBet = 0;
    }
  }

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

  _dealCard() {
    const card = this.deck.pop();
    return card;
  }

  _dealHoleCards() {
    this._clearPlayerCards();
    this._shuffleCards();

    for (let i = 0; i < this.activePlayers.length * 2; i++) {
      const player = this.activePlayers[i % this.activePlayers.length];
      const card = this._dealCard();
      player.addCard(card);
    }
  }

  _clearPlayerCards() {
    this.activePlayers.forEach((player) => {
      player.cleanCards();
    });
  }

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
