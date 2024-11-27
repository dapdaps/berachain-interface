import Title from "../../components/title";
import PageBack from "@/components/back";
import Total from "../total";
import Panel from "../panel";
import Tokens from "../tokens";
import Actions from "./actions";
import Withdrawal from "./withdrawal";

export default function Mobile({
  loading,
  onOpenModal,
  tokens,
  totalStaked,
  withdrawList,
  userData,
  balancesLoading,
  balances,
  onRefreshTokens
}: any) {
  return (
    <div className="h-full w-full overflow-x-hidden relative pt-[18px]">
      <div className="absolute left-[18px] top-[18px]">
        <PageBack />
      </div>
      {!!withdrawList?.length && <Withdrawal num={withdrawList.length} />}
      <Title onOpenModal={onOpenModal} />
      <Total totalStaked={totalStaked} />
      <Tokens tokens={tokens} loading={loading} />
      <Panel
        onOpenModal={onOpenModal}
        tokens={tokens}
        onSuccess={onRefreshTokens}
        userData={userData}
        balances={balances}
        balancesLoading={balancesLoading}
      />
      <Actions />
    </div>
  );
}
