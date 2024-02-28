import { GAME_MODE } from "@/app/_constants/constants";
import Styles from "./dashboard.module.css";

type PokerTableFilterProps = {
  limit: string;
  setLimit: (limit: string) => void;
  stakes: string;
  setStakes: (stakes: string) => void;
  maxPlayers: string;
  setMaxPlayers: (maxPlayers: string) => void;
};

function PokerTableFilter({
  limit,
  setLimit,
  stakes,
  setStakes,
  maxPlayers,
  setMaxPlayers,
}: PokerTableFilterProps) {
  return (
    <div className={Styles.search_container}>
      <div className={Styles.input_container}>
        <label className={Styles.label} htmlFor='limit'>
          Limit
        </label>
        <select
          className={Styles.select}
          name='limit'
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          {GAME_MODE.LIMIT.map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
      </div>

      <div className={Styles.input_container}>
        <label className={Styles.label} htmlFor='stakes'>
          Stakes
        </label>
        <select
          className={Styles.select}
          name='stakes'
          value={stakes}
          onChange={(e) => setStakes(e.target.value)}
        >
          {GAME_MODE.STAKES.map((stakes) => (
            <option key={stakes} value={stakes}>
              {stakes}
            </option>
          ))}
        </select>
      </div>

      <div className={Styles.input_container}>
        <label className={Styles.label} htmlFor='max players'>
          Max players
        </label>
        <select
          className={Styles.select}
          name='max players'
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
        >
          {GAME_MODE.MAX_PLAYERS.map((maxPlayers) => (
            <option key={maxPlayers} value={maxPlayers}>
              {maxPlayers}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default PokerTableFilter;
