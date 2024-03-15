import { useEffect, useState } from "react";
import { Table } from "../_types/type";

function useFilterTables(tables: Table[]) {
  const [filteredTables, setFilteredTables] = useState<Table[]>(tables);

  const [stakes, setStakes] = useState<string>("all");
  const [limit, setLimit] = useState<string>("all");
  const [maxPlayers, setMaxPlayers] = useState<string>("all");

  useEffect(() => {
    const filteredTables = tables.filter((table) => {
      if (stakes !== "all" && table.stakes !== stakes) return false;
      if (limit !== "all" && table.limit !== limit) return false;
      if (maxPlayers !== "all" && table.maxPlayers.toString() !== maxPlayers)
        return false;
      return true;
    });

    setFilteredTables(filteredTables);
  }, [tables, stakes, limit, maxPlayers]);

  return {
    filteredTables,
    setStakes,
    stakes,
    setLimit,
    limit,
    setMaxPlayers,
    maxPlayers,
  };
}

export default useFilterTables;
