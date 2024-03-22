const NoLimitRuleValidator = require("./NoLimitRuleValidator");
const GameRules = require("./gameRules");
const Player = require("./player");

describe("NoLimitRuleValidator", () => {
  let validator;
  let gameRules;
  let player;
  let action;
  let currentBet;
  let lastRaiseBetAmount;
  let raiseCounter;

  beforeEach(() => {
    gameRules = new GameRules("no limit", 10, 20, 9, 4);
    validator = new NoLimitRuleValidator(gameRules);
    player = new Player("Alice", 1);
    nextPlayerToAct = new Player("Alice", 1);
    action = { type: "check" };
    currentBet = 0;
    lastRaiseBetAmount = 0;
    raiseCounter = 0;
  });

  it("should throw an error if player tries to raise when no bet is made", () => {
    action.type = "raise";
    lastRaiseBetAmount = 0;
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter
      )
    ).toThrow("Invalid player action: Cannot raise when no bet is made");
  });

  it("should throw an error if raise amount is too low", () => {
    action.type = "raise";
    action.amount = 99;
    player.currentRoundBet = 50;
    lastRaiseBetAmount = 50;
    currentBet = 100;
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        currentBet,
        lastRaiseBetAmount,
        raiseCounter
      )
    ).toThrow("Invalid player action: Raise amount too low");
  });
});
