const STAGES = require("../constants/handCycleStage");
const GameStageManager = require("./gameStageManager");

describe("GameStageManager", () => {
  let gameStageManager;

  beforeEach(() => {
    gameStageManager = new GameStageManager();
  });

  it("should initialize with correct initial values", () => {
    const { isWaitingForPlayerAction, stage } = gameStageManager.getState();
    expect(isWaitingForPlayerAction).toBe(false);
    expect(stage).toBe(STAGES.PRE_FLOP);
  });

  it("should set the isWaitingForPlayerAction from true to false", () => {
    gameStageManager.isWaitingForPlayerAction = true;
    gameStageManager.toggleWaitingForPlayerAction();
    const { isWaitingForPlayerAction } = gameStageManager.getState();
    expect(isWaitingForPlayerAction).toBe(false);
  });

  it("should set the isWaitingForPlayerAction from false to true", () => {
    gameStageManager.toggleWaitingForPlayerAction();
    const { isWaitingForPlayerAction } = gameStageManager.getState();
    expect(isWaitingForPlayerAction).toBe(true);
  });

  it("should set the next stage from pre flop to flop", () => {
    gameStageManager.setNextStage();
    const { stage } = gameStageManager.getState();
    expect(stage).toBe(STAGES.FLOP);
  });

  it("should set the next stage from flop to turn", () => {
    gameStageManager.stage = STAGES.FLOP;
    gameStageManager.setNextStage();
    const { stage } = gameStageManager.getState();
    expect(stage).toBe(STAGES.TURN);
  });

  it("should set the next stage from turn to river", () => {
    gameStageManager.stage = STAGES.TURN;
    gameStageManager.setNextStage();
    const { stage } = gameStageManager.getState();
    expect(stage).toBe(STAGES.RIVER);
  });

  it("should set the next stage from river to showdown", () => {
    gameStageManager.stage = STAGES.RIVER;
    gameStageManager.setNextStage();
    const { stage } = gameStageManager.getState();
    expect(stage).toBe(STAGES.SHOWDOWN);
  });

  it("should initialize the stage correctly", () => {
    gameStageManager.isWaitingFirPlayerAction = true;
    gameStageManager.stage = STAGES.SHOWDOWN;
    gameStageManager.resetState();

    const { isWaitingForPlayerAction, stage } = gameStageManager.getState();

    expect(isWaitingForPlayerAction).toBe(false);
    expect(stage).toBe(STAGES.PRE_FLOP);
  });
});
