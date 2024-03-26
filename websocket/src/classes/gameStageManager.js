const STAGES = require("../constants/handCycleStage");

class GameStageManager {
  constructor() {
    this.isWaitingForPlayerAction = false;
    this.stage = STAGES.PRE_FLOP;
  }

  getState() {
    return {
      isWaitingForPlayerAction: this.isWaitingForPlayerAction,
      stage: this.stage,
    };
  }

  toggleWaitingForPlayerAction() {
    this.isWaitingForPlayerAction = !this.isWaitingForPlayerAction;
  }

  setNextStage() {
    const stages = Object.values(STAGES);
    const currentStageIndex = stages.findIndex((s) => s === this.stage);
    this.stage = stages[currentStageIndex + 1];
  }

  resetState() {
    this.isWaitingForPlayerAction = false;
    this.stage = STAGES.PRE_FLOP;
  }
}

module.exports = GameStageManager;
