import { Table } from "@/app/_types/type";
import PrimaryButton from "../button/PrimaryButton";
import SecondaryButton from "../button/SecondaryButton";
import Styles from "./dashboard.module.css";

type PokerTablesProps = {
  tables: Table[];
  selectedTable: Table | null;
  selectTable: (tableId: string) => void;
  joinTable: (tableId: string | undefined) => void;
};

function PokerTables({
  tables,
  selectedTable,
  selectTable,
  joinTable,
}: PokerTablesProps) {
  return (
    <div className={Styles.tables_container}>
      <div className={Styles.table_wrapper}>
        <table className={Styles.rooms_table}>
          <thead>
            <tr>
              <th>Table Id</th>
              <th>Limit</th>
              <th>Stakes</th>
              <th>Players</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr
                key={table.id}
                onClick={() => selectTable(table.id)}
                className={selectedTable?.id === table.id ? Styles.active : ""}
              >
                <td>{table.id}</td>
                <td>{table.limit}</td>
                <td>{`${table.stakes[0]}$ / ${table.stakes[1]}$`}</td>
                <td>{`${table.players.length} / ${table.maxPlayers}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={Styles.table_wrapper}>
        {selectedTable === null ? null : (
          <div className={Styles.game_details_wrapper}>
            <table className={Styles.rooms_table}>
              <thead>
                <tr>
                  <th>Player name</th>
                  <th>Chips</th>
                </tr>
              </thead>
              <tbody>
                {selectedTable.players.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.chips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={Styles.game_details_container}>
              <h3>Table Id: {selectedTable.id}</h3>
              <h3>Limit: {selectedTable.limit}</h3>
              <h3>
                Stakes:{" "}
                {`${selectedTable.stakes[0]}$ / ${selectedTable.stakes[1]}$`}
              </h3>
              <h3>Max players: {selectedTable.maxPlayers}</h3>
            </div>
            <div className={Styles.table_button_container}>
              <SecondaryButton
                buttonText='Observe Table'
                clickHandler={() => console.log("Observe Table")}
              />
              {parseInt(selectedTable.maxPlayers) >
              selectedTable.players.length ? (
                <PrimaryButton
                  buttonText='Join Game'
                  clickHandler={() => joinTable(selectedTable.id)}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PokerTables;
