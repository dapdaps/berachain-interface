import AllowancePanel from "../allowance-panel";
import Button from "@/components/button";
import ModalLoading from "../loading";
import useApprove from "@/hooks/use-approve";
import { useEffect, useMemo } from "react";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function ApprovePanel({ data, amount, onSuccess }: any) {
  const token = useMemo(
    () => ({
      address: data.id,
      symbol: data.symbol,
      chainId: DEFAULT_CHAIN_ID,
      decimals: 18,
      icon: ""
    }),
    [data]
  );

  const { approved, approve, approving, checking, allowance } = useApprove({
    token,
    amount,
    isMax: true,
    spender: data.farmAddress,
    onSuccess() {}
  });

  useEffect(() => {
    if (approved) onSuccess();
  }, [approved]);

  return checking ? (
    <ModalLoading title="Checking Allowance" />
  ) : (
    <>
      <AllowancePanel amount={amount} allowance={allowance} token={token} />
      <Button
        loading={approving}
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={approve}
      >
        Approve {token.symbol}
      </Button>
    </>
  );
}
