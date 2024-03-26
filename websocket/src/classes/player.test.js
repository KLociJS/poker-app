const Player = require("./player");

describe("Player", () => {
  let player;

  beforeEach(() => {
    player = new Player("John", 1);
  });

  it("should initialize with correct initial values", () => {
    expect(player.name).toBe("John");
    expect(player.id).toBe(1);
    expect(player.hasDealerButton).toBe(false);
    expect(player.totalHandCycleBet).toBe(0);
    expect(player.currentRoundBet).toBe(0);
    expect(player.chips).toBeNull();
    expect(player.cards).toEqual([]);
    expect(player.hasSitOut).toBe(false);
  });

  it("should add a card correctly", () => {
    player.addCard({ value: "A", suit: "spade" });
    expect(player.cards).toStrictEqual([{ value: "A", suit: "spade" }]);

    player.addCard({ value: "K", suit: "spade" });
    expect(player.cards).toStrictEqual([
      { value: "A", suit: "spade" },
      { value: "K", suit: "spade" },
    ]);
  });

  it("should clean cards correctly", () => {
    player.addCard({ value: "A", suit: "spade" });
    player.addCard({ value: "K", suit: "spade" });

    player.cleanCards();
    expect(player.cards).toEqual([]);
  });

  it("should set chips correctly", () => {
    player.setChips(100);
    expect(player.chips).toBe(100);

    player.setChips(200);
    expect(player.chips).toBe(200);
  });

  it("should bet chips correctly", () => {
    player.setChips(100);
    player.betChips(50);
    expect(player.chips).toBe(50);
    expect(player.totalHandCycleBet).toBe(50);
    expect(player.currentRoundBet).toBe(50);
  });

  it("should raise correctly", () => {
    player.setChips(100);
    player.betChips(50);
    player.betChips(75);
    expect(player.chips).toBe(25);
    expect(player.totalHandCycleBet).toBe(75);
    expect(player.currentRoundBet).toBe(75);
  });

  it("should reset current round bet correctly", () => {
    player.betChips(50);
    player.resetCurrentRoundBet();
    expect(player.currentRoundBet).toBe(0);
  });

  it("should award chips correctly", () => {
    player.setChips(100);
    player.awardChips(50);
    expect(player.chips).toBe(150);
  });

  it("should deduct total hand cycle bet correctly", () => {
    player.totalHandCycleBet = 100;
    player.deductTotalHandCycleBet(50);
    expect(player.totalHandCycleBet).toBe(50);
  });

  it("should return hasSitOut correctly", () => {
    expect(player.hasSitOut).toBe(false);

    player.hasSitOut = true;
    expect(player.hasSitOut).toBe(true);
  });
});
