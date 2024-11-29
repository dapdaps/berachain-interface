import { createContext } from "react";

export default createContext<any>({
  historyRounds: [],
  currentRound: null
});
