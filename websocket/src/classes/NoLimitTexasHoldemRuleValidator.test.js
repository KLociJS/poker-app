const NoLimitTexasHoldemRuleValidator = require("./NoLimitTexasHoldemRuleValidator");
const Player = require("./player");

describe("NoLimitTexasHoldemRuleValidator", () => {
  let validator;
  let player;
  let nextPlayerToAct;
  let action;
  let currentBet;
  let lastRaiseBetAmount;
  let raiseCounter;

  beforeEach(() => {
    validator = new NoLimitTexasHoldemRuleValidator();
    player = new Player("Alice", 1);
    nextPlayerToAct = new Player("Alice", 1);
    action = { type: "check" };
    currentBet = 0;
    lastRaiseBetAmount = 0;
    raiseCounter = 0;
  });

  it("should throw an error if a player tries to act when its not a betting round", () => {
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        false
      )
    ).toThrow("Invalid player action: Not waiting for player action");
  });

  it("should throw an error if it's not the player's turn", () => {
    player.id = 3;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Not player's turn");
  });

  it("should throw an error if player tries to check when a bet is made", () => {
    action.type = "check";
    lastRaiseBetAmount = 100;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Cannot check when bet is made");
  });

  it("should throw an error if raise limit is reached", () => {
    action.type = "raise";
    raiseCounter = 4;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Raise limit reached");
  });

  it("should throw an error if player tries to bet when a bet is already made", () => {
    action.type = "bet";
    currentBet = 100;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Cannot bet when bet is already made");
  });

  it("should throw an error if player tries to call when no bet is made", () => {
    action.type = "call";
    lastRaiseBetAmount = 0;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Cannot call when no bet is made");
  });

  it("should throw an error if player tries to raise when no bet is made", () => {
    action.type = "raise";
    lastRaiseBetAmount = 0;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Cannot raise when no bet is made");
  });

  it("should throw an error if raise amount is too low", () => {
    action.type = "raise";
    action.amount = 50;
    player.currentRoundBet = 0;
    lastRaiseBetAmount = 100;
    currentBet = 0;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Raise amount too low");
  });

  it("should throw an error if player doesn't have enough chips", () => {
    action.amount = 100;
    player.chips = 50;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow(
      "Invalid player action: Invalid amount of chips, differs from game state"
    );
  });

  it("should throw an error if player doesn't use 'allIn' when having the same amount of chips", () => {
    action.amount = 100;
    player.chips = 100;
    action.type = "bet";
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Use all in instead");
  });

  it("should throw an error if player calls less than they should", () => {
    action.type = "call";
    action.amount = 50;
    player.chips = 100;
    player.currentRoundBet = 0;
    currentBet = 100;
    lastRaiseBetAmount = 100;
    expect(() =>
      validator.validatePlayerAction(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter,
        true
      )
    ).toThrow("Invalid player action: Call amount too low");
  });
});
