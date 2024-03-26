const GAME_MODE = require("../constants/gameMode");
const GameRules = require("./gameRules");

describe("GameRules", () => {
  let gameRules;

  beforeEach(() => {
    gameRules = new GameRules(
      GAME_MODE.LIMIT.FIX_LIMIT,
      GAME_MODE.STAKE.MEDIUM.SMALL_BLIND,
      GAME_MODE.STAKE.MEDIUM.BIG_BLIND,
      6,
      4
    );
  });

  it("should return the correct rules", () => {
    const expectedRules = {
      limit: GAME_MODE.LIMIT.FIX_LIMIT,
      smallBlind: GAME_MODE.STAKE.MEDIUM.SMALL_BLIND,
      bigBlind: GAME_MODE.STAKE.MEDIUM.BIG_BLIND,
      maxPlayers: 6,
      raiseCountLimit: 4,
    };
    expect(gameRules.getRules()).toEqual(expectedRules);
  });
});
