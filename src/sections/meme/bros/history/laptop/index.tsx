import Title from "../../components/title";
import Materials from "../../components/materials";
import Loading from "@/components/loading";
import Round from "../round";
import WithdrawalPanel from "../../components/withdrawal-panel";
import PageBack from "@/components/back";

export default function Laptop({
  loading,
  rounds,
  fetchingUserStakingData,
  userStakeData,
  claimData,
  withdrawList,
  onRefreshWithdrawData,
  onOpenModal
}: any) {
  return (
    <div className="relative w-full overflow-x-hidden relative">
      <div className="absolute left-[18px] top-[18px]">
        <PageBack />
      </div>
      <Title onOpenModal={onOpenModal} />
      <div
        className="text-[36px] font-SquaredPixel text-center text-white"
        style={{
          textShadow: "2px 0px #000, -2px 0px #000, 0px -2px #000, 0px 2px #000"
        }}
      >
        History
      </div>
      <div className="w-[1000px] mx-auto relative z-[10] pb-[20px] min-h-[100px]">
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
              userStakeData={userStakeData?.[round.round]}
              claimData={claimData?.[round.round]}
              onOpenModal={onOpenModal}
            />
          ))
        )}
      </div>
      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[240px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
      {!!withdrawList?.length && (
        <WithdrawalPanel
          list={withdrawList}
          onSuccess={onRefreshWithdrawData}
        />
      )}
    </div>
  );
}
