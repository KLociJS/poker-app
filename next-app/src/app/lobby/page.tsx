"use client";

import Styles from "@/app/_components/lobby/dashboard.module.css";
import PokerTables from "@/app/_components/lobby/PokerTables";
import RegisterUser from "@/app/_components/lobby/RegisterUser";
import PokerTableFilter from "@/app/_components/lobby/TableFilter";
import useFilterTables from "@/app/_hooks/useFilterTables";
import useLobby from "@/app/_hooks/useLobby";
import useRegisterPlayer from "@/app/_hooks/useRegisterPlayer";

const Lobby = () => {
  const {
    handleJoinLobby,
    handleUserNameChange,
    userNameError,
    userName,
    isRegistrationSuccessful,
  } = useRegisterPlayer();

  const { tables, selectedTable, selectTable, joinTable } = useLobby(
    isRegistrationSuccessful,
    userName
  );

  const {
    filteredTables,
    setStakes,
    stakes,
    setLimit,
    limit,
    setMaxPlayers,
    maxPlayers,
  } = useFilterTables(tables);

  return isRegistrationSuccessful ? (
    <main className={Styles.main_container}>
      <PokerTableFilter
        limit={limit}
        setLimit={setLimit}
        stakes={stakes}
        setStakes={setStakes}
        maxPlayers={maxPlayers}
        setMaxPlayers={setMaxPlayers}
      />
      <PokerTables
        tables={filteredTables}
        selectedTable={selectedTable}
        selectTable={selectTable}
        joinTable={joinTable}
      />
    </main>
  ) : (
    <RegisterUser
      userName={userName}
      userNameError={userNameError}
      handleUserNameChange={handleUserNameChange}
      handleJoinDashboard={handleJoinLobby}
    />
  );
};
export default Lobby;
