import AllowancePanel from "../allowance-panel";
import Button from "@/components/button";
import ModalLoading from "../loading";
import useApprove from "@/hooks/use-approve";
import { useEffect, useMemo } from "react";

export default function ApprovePanel({ data, amount, onSuccess }: any) {
  const token = useMemo(
    () => ({
      address: data.tokenLp.id,
      symbol: data.tokenLp.symbol,
      chainId: 80094,
      decimals: data.tokenLp.decimals,
      icon: data.icon
    }),
    [data]
  );

  const { approved, approve, approving, checking, allowance } = useApprove({
    token,
    amount,
    isMax: true,
    spender: data.farm?.id,
    onSuccess() {}
  });

  useEffect(() => {
    if (approved) onSuccess();
  }, [approved]);

  return checking ? (
    <ModalLoading title="Checking Allowance" />
  ) : (
    <>
      <AllowancePanel
        amount={amount}
        allowance={allowance}
        token={data.tokenLp}
      />
      <Button
        loading={approving}
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={approve}
      >
        Approve {data.tokenLp.symbol}
      </Button>
    </>
  );
}
