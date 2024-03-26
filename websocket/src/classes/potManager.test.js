const PotManager = require("./potManager");
const GameRules = require("./gameRules");
const Player = require("./player");

describe("PotManager", () => {
  let potManager;
  let gameRules;
  let activePlayers;

  beforeEach(() => {
    gameRules = new GameRules();
    potManager = new PotManager(gameRules);
    activePlayers = [
      new Player("Alice", 1),
      new Player("Bob", 2),
      new Player("Charlie", 3),
    ];
    activePlayers[0].hasDealerButton = true;
  });

  afterEach(() => {
    potManager.resetState();
  });

  it("should initialize with correct initial state", () => {
    const state = potManager.getState();
    expect(state.pot).toBe(0);
    expect(state.raiseCounter).toBe(0);
    expect(state.currentBet).toBe(0);
    expect(state.lastRaiseBetAmount).toBe(0);
  });

  it("should add amount to the pot", () => {
    potManager.addToPot(100);
    const { pot } = potManager.getState();
    expect(pot).toBe(100);
  });

  it("should increment the raise counter", () => {
    potManager.incrementRaiseCounter();
    const { raiseCounter } = potManager.getState();
    expect(raiseCounter).toBe(1);
  });

  it("should set the current bet", () => {
    potManager.setCurrentBet(50);
    const { currentBet } = potManager.getState();
    expect(currentBet).toBe(50);
  });

  it("should set the last raise bet amount", () => {
    potManager.setLastRaiseBetAmount(100);
    const { lastRaiseBetAmount } = potManager.getState();
    expect(lastRaiseBetAmount).toBe(100);
  });

  it("should reset the state to initial values", () => {
    potManager.addToPot(100);
    potManager.incrementRaiseCounter();
    potManager.setCurrentBet(50);
    potManager.setLastRaiseBetAmount(100);

    potManager.resetState();

    const { pot, raiseCounter, currentBet, lastRaiseBetAmount } =
      potManager.getState();
    expect(pot).toBe(0);
    expect(raiseCounter).toBe(0);
    expect(currentBet).toBe(0);
    expect(lastRaiseBetAmount).toBe(0);
  });

  describe("deductBlinds", () => {
    it("should deduct blinds from 3 active players (1st and 2nd)", () => {
      const bigBlind = 20;
      const smallBlind = 10;
      gameRules.smallBlind = smallBlind;
      gameRules.bigBlind = bigBlind;
      activePlayers[0].chips = 1000;
      activePlayers[0].hasDealerButton = false;
      activePlayers[1].chips = 1000;
      activePlayers[2].hasDealerButton = true;

      potManager.deductBlinds(activePlayers);

      expect(activePlayers[0].chips).toBe(990);
      expect(activePlayers[1].chips).toBe(980);
      const { currentBet, lastRaiseBetAmount, pot } = potManager.getState();
      expect(currentBet).toBe(bigBlind);
      expect(lastRaiseBetAmount).toBe(bigBlind);
      expect(pot).toBe(smallBlind + bigBlind);
    });

    it("should deduct blinds from 3 active players (2nd and 3rd)", () => {
      const bigBlind = 20;
      const smallBlind = 10;
      gameRules.smallBlind = smallBlind;
      gameRules.bigBlind = bigBlind;
      activePlayers[1].chips = 1000;
      activePlayers[2].chips = 1000;

      potManager.deductBlinds(activePlayers);

      expect(activePlayers[1].chips).toBe(990);
      expect(activePlayers[2].chips).toBe(980);
      const { currentBet, lastRaiseBetAmount, pot } = potManager.getState();
      expect(currentBet).toBe(bigBlind);
      expect(lastRaiseBetAmount).toBe(bigBlind);
      expect(pot).toBe(smallBlind + bigBlind);
    });

    it("should deduct blinds from 3 active players (3rd and 1st)", () => {
      const bigBlind = 20;
      const smallBlind = 10;
      gameRules.smallBlind = smallBlind;
      gameRules.bigBlind = bigBlind;
      activePlayers[0].hasDealerButton = false;
      activePlayers[0].chips = 1000;
      activePlayers[1].hasDealerButton = true;
      activePlayers[2].chips = 1000;

      potManager.deductBlinds(activePlayers);

      expect(activePlayers[2].chips).toBe(990);
      expect(activePlayers[0].chips).toBe(980);
      const { currentBet, lastRaiseBetAmount, pot } = potManager.getState();
      expect(currentBet).toBe(bigBlind);
      expect(lastRaiseBetAmount).toBe(bigBlind);
      expect(pot).toBe(smallBlind + bigBlind);
    });

    it("should deduct blinds from 2 active players (1st and 2nd)", () => {
      activePlayers = [new Player("Alice", 1), new Player("Bob", 2)];
      activePlayers[0].hasDealerButton = true;
      const bigBlind = 20;
      const smallBlind = 10;
      gameRules.smallBlind = smallBlind;
      gameRules.bigBlind = bigBlind;
      activePlayers[0].chips = 1000;
      activePlayers[0].hasDealerButton = false;
      activePlayers[1].chips = 1000;

      potManager.deductBlinds(activePlayers);

      expect(activePlayers[0].chips).toBe(990);
      expect(activePlayers[1].chips).toBe(980);
      const { currentBet, lastRaiseBetAmount, pot } = potManager.getState();
      expect(currentBet).toBe(bigBlind);
      expect(lastRaiseBetAmount).toBe(bigBlind);
      expect(pot).toBe(smallBlind + bigBlind);
    });

    it("should deduct blinds from 2 active players (2nd and 1st)", () => {
      activePlayers = [new Player("Alice", 1), new Player("Bob", 2)];
      activePlayers[1].hasDealerButton = true;
      const bigBlind = 20;
      const smallBlind = 10;
      gameRules.smallBlind = smallBlind;
      gameRules.bigBlind = bigBlind;
      activePlayers[0].chips = 1000;
      activePlayers[1].chips = 1000;
      activePlayers[1].hasDealerButton = false;

      potManager.deductBlinds(activePlayers);

      expect(activePlayers[1].chips).toBe(980);
      expect(activePlayers[0].chips).toBe(990);
      const { currentBet, lastRaiseBetAmount, pot } = potManager.getState();
      expect(currentBet).toBe(bigBlind);
      expect(lastRaiseBetAmount).toBe(bigBlind);
      expect(pot).toBe(smallBlind + bigBlind);
    });
  });

  it("should award the pot to the winner(s)", () => {
    const winner = [activePlayers[0], activePlayers[1]];
    potManager.addToPot(1000);

    potManager.awardPot(winner);

    expect(activePlayers[0].chips).toBe(500);
    expect(activePlayers[1].chips).toBe(500);
    const { pot } = potManager.getState();
    expect(pot).toBe(0);
  });

  it("should check if all players are betting equally", () => {
    activePlayers[0].totalHandCycleBet = 100;
    activePlayers[1].totalHandCycleBet = 100;
    activePlayers[2].totalHandCycleBet = 100;

    const allInPlayer = new Player("Frank", 6);
    allInPlayer.totalHandCycleBet = 100;

    expect(potManager.areAllPlayersBettingEqually(activePlayers, [])).toBe(
      true
    );
    expect(
      potManager.areAllPlayersBettingEqually(activePlayers, [allInPlayer])
    ).toBe(true);

    activePlayers[1].totalHandCycleBet = 200;

    expect(potManager.areAllPlayersBettingEqually(activePlayers, [])).toBe(
      false
    );
    expect(
      potManager.areAllPlayersBettingEqually(activePlayers, [allInPlayer])
    ).toBe(false);
  });

  it("should calculate side pots", () => {
    activePlayers[0].totalHandCycleBet = 300;
    activePlayers[1].totalHandCycleBet = 300;
    activePlayers[2].totalHandCycleBet = 300;

    const allInPlayer = new Player("Frank", 6);
    allInPlayer.totalHandCycleBet = 200;

    const sidePots = potManager.calculateSidePots(activePlayers, [allInPlayer]);

    expect(sidePots).toEqual([200, 100]);
  });
});
