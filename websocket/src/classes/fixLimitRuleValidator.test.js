const FixLimitRuleValidator = require("./fixLimitRuleValidator");

describe("FixLimitRuleValidator", () => {
  let validator;
  let player;
  let action;
  let handCycleStage;
  let lastRaiseBetAmount;
  let currentBet;
  let raiseCounter;
  let gameRules;

  beforeEach(() => {
    player = { currentRoundBet: 0 };
    action = { type: "bet", amount: 10 };
    handCycleStage = "preFlop";
    lastRaiseBetAmount = 0;
    currentBet = 0;
    raiseCounter = 0;
    gameRules = {
      getRules: jest.fn().mockReturnValue({
        smallBlind: 10,
        bigBlind: 20,
        raiseLimit: 4,
      }),
    };

    validator = new FixLimitRuleValidator(gameRules);
  });

  it("should throw an error when player's bet amount in pre flop and flop exceeds the small blind", () => {
    action.amount = 11;
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        handCycleStage,
        lastRaiseBetAmount,
        currentBet,
        raiseCounter
      )
    ).toThrow("Invalid player action: Bet amount too high");

    handCycleStage = "flop";
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        handCycleStage,
        lastRaiseBetAmount,
        currentBet,
        raiseCounter
      )
    ).toThrow("Invalid player action: Bet amount too high");
  });

  it("should throw an error when player's bet amount in turn and river exceeds the big blind", () => {
    handCycleStage = "turn";
    action.amount = 21;
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        handCycleStage,
        lastRaiseBetAmount,
        currentBet,
        raiseCounter
      )
    ).toThrow("Invalid player action: Bet amount too high");

    handCycleStage = "river";
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        handCycleStage,
        lastRaiseBetAmount,
        currentBet,
        raiseCounter
      )
    ).toThrow("Invalid player action: Bet amount too high");
  });

  it("should throw an error when raise amount is too high", () => {
    action.type = "raise";
    action.amount = 21;
    player.currentRoundBet = 10;
    lastRaiseBetAmount = 10;
    currentBet = 20;
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        handCycleStage,
        lastRaiseBetAmount,
        currentBet,
        raiseCounter
      )
    ).toThrow("Invalid player action: Invalid raise amount");
  });

  it("should throw an error when raise amount is too low", () => {
    action.type = "raise";
    action.amount = 19;
    player.currentRoundBet = 10;
    lastRaiseBetAmount = 10;
    currentBet = 20;
    expect(() =>
      validator.validateGameSpecificRules(
        player,
        action,
        handCycleStage,
        lastRaiseBetAmount,
        currentBet,
        raiseCounter
      )
    ).toThrow("Invalid player action: Invalid raise amount");
  });
});
