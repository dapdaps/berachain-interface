import Title from "../../components/title";
import Tokens from "../tokens";
import Panel from "../panel";
import Total from "../total";
import WithdrawalPanel from "../../components/withdrawal-panel";

export default function Laptop({
  onOpenModal,
  tokens,
  totalStaked,
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
      <Total totalStaked={totalStaked} />
      <Tokens tokens={tokens} />
      <Panel
        onOpenModal={onOpenModal}
        tokens={tokens}
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
