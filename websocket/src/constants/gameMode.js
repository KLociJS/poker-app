const GAME_MODE = {
  LIMIT: {
    FIX_LIMIT: "fix limit",
    NO_LIMIT: "no limit",
    POT_LIMIT: "pot limit",
  },
  STAKE: {
    LOW: {
      SMALL_BLIND: 1,
      BIG_BLIND: 2,
    },
    MEDIUM: {
      SMALL_BLIND: 5,
      BIG_BLIND: 10,
    },
    HIGH: {
      SMALL_BLIND: 10,
      BIG_BLIND: 20,
    },
  },
};

module.exports = GAME_MODE;
