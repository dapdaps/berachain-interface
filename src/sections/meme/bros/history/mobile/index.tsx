import PageBack from "@/components/back";
import Materials from "../../components/materials";
import Round from "../round";
import Loading from "@/components/loading";
import Withdrawal from "../../main/mobile/withdrawal";

export default function Mobile({
  loading,
  rounds,
  fetchingUserStakingData,
  userStakeData,
  claimData,
  withdrawList,
  onOpenModal
}: any) {
  return (
    <div className="h-full w-full overflow-x-hidden relative pt-[18px]">
      <div className="absolute left-[18px] top-[18px]">
        <PageBack />
      </div>
      {!!withdrawList?.length && (
        <Withdrawal num={withdrawList.length} onOpenModal={onOpenModal} />
      )}
      <div className="text-[24px] font-CherryBomb text-center">History</div>
      <div className="w-full mx-auto relative z-[10] pb-[20px]">
        {loading ? (
          <div className="pt-[50px] flex items-center justify-center">
            <Loading size={40} />
          </div>
        ) : (
          rounds.map((round: any) => (
            <Round
              key={round.round}
              round={round}
              fetchingUserStakingData={fetchingUserStakingData}
              userStakeData={userStakeData[round.round]}
              claimData={claimData?.[round.round]}
              onOpenModal={onOpenModal}
            />
          ))
        )}
      </div>
      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[200px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
    </div>
  );
}
