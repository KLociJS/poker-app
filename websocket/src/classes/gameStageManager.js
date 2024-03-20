const STAGES = require("../constants/handCycleStage");

class GameStageManager {
  constructor() {
    this.isWaitingForPlayerAction = false;
    this.stage = STAGES.PRE_FLOP;
  }

  getIsWaitingForPlayerAction() {
    return this.isWaitingForPlayerAction;
  }

  setIsWaitingForPlayerAction(value) {
    this.isWaitingForPlayerAction = value;
  }

  getStage() {
    return this.stage;
  }

  setNextStage() {
    const stages = Object.values(STAGES);
    const currentStageIndex = stages.findIndex((s) => s === this.stage);
    this.stage = stages[currentStageIndex + 1];
  }

  initStage() {
    this.isWaitingForPlayerAction = false;
    this.stage = STAGES.PRE_FLOP;
  }
}

module.exports = GameStageManager;
