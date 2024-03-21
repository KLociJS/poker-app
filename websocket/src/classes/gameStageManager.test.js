const STAGES = require("../constants/handCycleStage");
const GameStageManager = require("./gameStageManager");

describe("GameStageManager", () => {
  let gameStageManager;

  beforeEach(() => {
    gameStageManager = new GameStageManager();
  });

  it("should initialize with correct initial values", () => {
    expect(gameStageManager.getIsWaitingForPlayerAction()).toBe(false);
    expect(gameStageManager.getStage()).toBe(STAGES.PRE_FLOP);
  });

  it("should set and get the 'isWaitingForPlayerAction' value correctly", () => {
    gameStageManager.setIsWaitingForPlayerAction(true);
    expect(gameStageManager.getIsWaitingForPlayerAction()).toBe(true);

    gameStageManager.setIsWaitingForPlayerAction(false);
    expect(gameStageManager.getIsWaitingForPlayerAction()).toBe(false);
  });

  it("should set the next stage correctly", () => {
    gameStageManager.setNextStage();
    expect(gameStageManager.getStage()).toBe(STAGES.FLOP);

    gameStageManager.setNextStage();
    expect(gameStageManager.getStage()).toBe(STAGES.TURN);

    gameStageManager.setNextStage();
    expect(gameStageManager.getStage()).toBe(STAGES.RIVER);

    gameStageManager.setNextStage();
    expect(gameStageManager.getStage()).toBe(STAGES.SHOWDOWN);
  });

  it("should initialize the stage correctly", () => {
    gameStageManager.setIsWaitingForPlayerAction(true);
    gameStageManager.setNextStage();
    gameStageManager.initStage();

    expect(gameStageManager.getIsWaitingForPlayerAction()).toBe(false);
    expect(gameStageManager.getStage()).toBe(STAGES.PRE_FLOP);
  });
});
