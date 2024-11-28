import Title from "../../components/title";
import Tokens from "../tokens";
import Panel from "../panel";
import Total from "../total";
import WithdrawalPanel from "../../components/withdrawal-panel";

export default function Laptop({
  loading,
  info,
  onOpenModal,
  tokens,
  rewardTokens,
  withdrawList,
  userData,
  balancesLoading,
  balances,
  onRefreshTokens,
  onRefreshWithdrawData
}: any) {
  return (
    <div className="w-full overflow-x-hidden relative">
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
      />
      {!!withdrawList?.length && (
        <WithdrawalPanel
          list={withdrawList}
          onSuccess={onRefreshWithdrawData}
        />
      )}
    </div>
  );
}
