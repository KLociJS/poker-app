import { fireEvent, render, screen } from "@testing-library/react";
import PokerTables from "./PokerTables";

describe("PokerTables", () => {
  const tables = [
    {
      id: 1,
      limit: "No Limit",
      stakes: "$5/$10",
      players: [],
      maxPlayers: 6,
    },
    {
      id: 2,
      limit: "Pot Limit",
      stakes: "$2/$4",
      players: [
        { id: 1, name: "Player 1", chips: 100 },
        { id: 2, name: "Player 2", chips: 200 },
      ],
      maxPlayers: 4,
    },
  ];

  const selectedTable = tables[0];
  const selectTable = jest.fn();
  const joinTable = jest.fn();

  beforeEach(() => {
    render(
      <PokerTables
        tables={tables}
        selectedTable={selectedTable}
        selectTable={selectTable}
        joinTable={joinTable}
      />
    );
  });

  test("renders table rows for each table", () => {
    const tableRows = screen.getAllByRole("row");
    expect(tableRows).toHaveLength(tables.length + 1); // +1 for the table header row
  });

  test("calls selectTable when a table row is clicked", () => {
    const tableRow = screen.getByText(selectedTable.id.toString());
    fireEvent.click(tableRow);
    expect(selectTable).toHaveBeenCalledWith(selectedTable.id);
  });

  test("renders player rows for selected table", () => {
    const playerRows = screen.getAllByRole("row");
    expect(playerRows).toHaveLength(selectedTable.players.length + 1); // +1 for the table header row
  });

  test("calls joinTable when Join Game button is clicked", () => {
    const joinButton = screen.getByText("Join Game");
    fireEvent.click(joinButton);
    expect(joinTable).toHaveBeenCalledWith(selectedTable.id);
  });
});
