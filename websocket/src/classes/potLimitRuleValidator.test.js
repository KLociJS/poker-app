const PotLimitRuleValidator = require("./potLimitRuleValidator");

describe("PotLimitRuleValidator", () => {
  let validator;
  let player;
  let action;
  let currentBet;
  let lastRaiseBetAmount;
  let pot;

  beforeEach(() => {
    validator = new PotLimitRuleValidator();
    player = {
      currentRoundBet: 100,
    };
    action = {
      type: "raise",
    };
    currentBet = 200;
    lastRaiseBetAmount = 100;
    pot = 1000;
  });

  describe("validateGameSpecificRules", () => {
    it("should throw an error if player tries to raise when no bet is made", () => {
      currentBet = 0;

      expect(() =>
        validator.validateGameSpecificRules(
          player,
          action,
          currentBet,
          lastRaiseBetAmount,
          pot
        )
      ).toThrowError("Invalid player action: Cannot raise when no bet is made");
    });

    it("should throw an error if the raise amount is too low", () => {
      player.currentRoundBet = 100;
      action.amount = 199;

      expect(() =>
        validator.validateGameSpecificRules(
          player,
          action,
          currentBet,
          lastRaiseBetAmount,
          pot
        )
      ).toThrowError("Invalid player action: Raise amount too low");
    });

    it("should throw an error if the raise amount is too high", () => {
      action.amount = 901;
      const currentBet = 200;

      expect(() =>
        validator.validateGameSpecificRules(
          player,
          action,
          currentBet,
          lastRaiseBetAmount,
          pot
        )
      ).toThrowError("Invalid player action: Raise amount too high");
    });

    it("should not throw an error if the raise amount is valid", () => {
      action.amount = 300;

      expect(() =>
        validator.validateGameSpecificRules(
          player,
          action,
          currentBet,
          lastRaiseBetAmount,
          pot
        )
      ).not.toThrowError();
    });
  });
});
