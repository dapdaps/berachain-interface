import useRounds from "./hooks/use-rounds";
import MemeContext from "./context";
import Loading from "@/components/loading";
import Vote from "./vote";
import Main from "./main";
import { useParams } from "next/navigation";

export default function Bros() {
  const { loading, historyRounds, currentRound, nextRound } = useRounds();
  const urlParams = useParams();

  if (loading)
    return (
      <div className="pt-[40dvh] flex justify-center items-center">
        <Loading size={40} />
      </div>
    );
  return (
    <MemeContext.Provider value={{ historyRounds, currentRound, nextRound }}>
      {(currentRound?.status === "un_start" || urlParams.sub === "vote") && (
        <Vote
          round={currentRound?.status === "un_start" ? currentRound : nextRound}
        />
      )}
      {!urlParams.sub &&
        !!currentRound &&
        currentRound.status !== "un_start" && <Main round={currentRound} />}
    </MemeContext.Provider>
  );
}
