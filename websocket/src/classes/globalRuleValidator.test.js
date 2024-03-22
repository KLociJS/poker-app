const GlobalRuleValidator = require("./globalRuleValidator");
const Player = require("./player");

describe("GlobalRuleValidator", () => {
  let globalRuleValidator;
  let gameRules;
  let nextPlayerToAct;
  let player;
  let action;
  let currentBet;
  let isWaitingForPlayerAction;
  let raiseCounter;

  beforeEach(() => {
    gameRules = {
      getRules: jest.fn().mockReturnValue({ raiseCountLimit: 4 }),
    };
    globalRuleValidator = new GlobalRuleValidator(gameRules);
    nextPlayerToAct = new Player("Alice", 1);
    player = new Player("Alice", 1);
    player.chips = 100;
    action = { type: "check" };
    currentBet = 0;
    isWaitingForPlayerAction = true;
    raiseCounter = 0;
  });

  it("should throw an error if not waiting for player action", () => {
    isWaitingForPlayerAction = false;

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Not waiting for player action");
  });

  it("should throw an error if it's not the player's turn", () => {
    player.id = 3;

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Not player's turn");
  });

  it("should throw an error if player tries to check when a bet is made", () => {
    currentBet = 10;

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Cannot check when bet is made");
  });

  it("should throw an error if player tries to bet when a bet is already made", () => {
    action = { type: "bet", amount: 10 };
    currentBet = 10;

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Cannot bet when bet is already made");
  });

  it("should throw an error if player tries to call when no bet is made", () => {
    action = { type: "call" };

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Cannot call when no bet is made");
  });

  it("should throw an error if player has insufficient chips", () => {
    action = { type: "bet", amount: 200 };

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow(
      "Invalid player action: Invalid amount of chips, differs from game state"
    );
  });

  it("should throw an error if player doesn't use 'allIn' when having the same amount of chips", () => {
    action = { type: "bet", amount: 100 };
    player.chips = 100;

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Use all in instead");
  });

  it("should throw an error if player's call amount is too low", () => {
    action = { type: "call", amount: 10 };
    player.currentRoundBet = 0;
    currentBet = 20;

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Call amount too low");
  });

  it("should throw an error if player tries to raise when no bet is made", () => {
    action = { type: "raise" };

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction
      )
    ).toThrow("Invalid player action: Cannot raise when no bet is made");
  });

  it("should throw an error if the raise counter is higher than the raise counter limit", () => {
    action = { type: "raise" };
    player.currentRoundBet = 10;
    currentBet = 10;
    player.chips = 20;
    raiseCounter = 4;

    expect(() =>
      globalRuleValidator.validateGlobalRules(
        player,
        nextPlayerToAct,
        action,
        currentBet,
        isWaitingForPlayerAction,
        raiseCounter
      )
    ).toThrow("Invalid player action: Raise limit reached");
  });
});
