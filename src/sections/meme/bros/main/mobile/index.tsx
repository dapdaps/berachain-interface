import Title from "../../components/title";
import PageBack from "@/components/back";
import Total from "../total";
import Panel from "../panel";
import Tokens from "../tokens";
import Actions from "./actions";
import Withdrawal from "./withdrawal";

export default function Mobile({
  loading,
  info,
  onOpenModal,
  tokens,
  rewardTokens,
  withdrawList,
  userData,
  balancesLoading,
  balances,
  fetchingClaim,
  claimData,
  onRefreshTokens
}: any) {
  return (
    <div className="h-full w-full overflow-x-hidden relative pt-[18px]">
      <div className="absolute left-[18px] top-[18px]">
        <PageBack />
      </div>
      {!!withdrawList?.length && (
        <Withdrawal num={withdrawList.length} onOpenModal={onOpenModal} />
      )}
      <Title onOpenModal={onOpenModal} />
      <Total onOpenModal={onOpenModal} info={info} />
      <Tokens tokens={tokens} loading={loading} />
      <Panel
        onOpenModal={onOpenModal}
        tokens={tokens}
        rewardTokens={rewardTokens}
        onSuccess={onRefreshTokens}
        userData={userData}
        balances={balances}
        balancesLoading={balancesLoading}
        fetchingClaim={fetchingClaim}
        claimData={claimData}
      />
      <Actions />
    </div>
  );
}
