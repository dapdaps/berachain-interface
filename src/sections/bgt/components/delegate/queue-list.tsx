import CircleLoading from "@/components/circle-loading";
import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import { BGT_ADDRESS } from "@/hooks/use-bgt";
import useExecutionContract from "@/hooks/use-execution-contract";
import { useMultiState } from "@/hooks/use-multi-state";
import useToast from "@/hooks/use-toast";
import { formatValueDecimal } from "@/utils/balance";
import { formatLongText } from "@/utils/utils";
import Big from "big.js";
import clsx from "clsx";
import { ethers } from "ethers";
import { memo } from "react";
import { BGT_ABI } from "../../abi";
import { QueueType } from "./hooks/use-delegation-queue";
import Empty from '@/components/empty';

export default memo(function QueueList({
  empty,
  loading,
  className,
  delegationQueue,
  onSuccess
}: {
  loading: boolean
  className?: string
  delegationQueue: any
  onSuccess: VoidFunction
}) {
  const toast = useToast();
  const { provider, account } = useCustomAccount();
  const { addAction } = useAddAction("bgt");
  const { executionContract } = useExecutionContract()
  const [state, updateState] = useMultiState({
    confirmAndCancelLoadingPosition: [],
  });
  const handleClickConfirmAndCancel = async (
    queue: QueueType,
    position: any
  ) => {
    const [type, index] = position;
    const toastId = toast?.loading({
      title: type === "confirm" ? "Confirming..." : "Canceling..."
    });

    updateState({
      confirmAndCancelLoadingPosition: position
    });
    const contract = new ethers.Contract(
      BGT_ADDRESS,
      BGT_ABI,
      provider?.getSigner()
    );
    const wei = ethers.utils.parseUnits(Big(queue?.balance).toFixed(18), 18);
    executionContract({
      contract,
      method: type === "confirm" ? "activateBoost" : "cancelBoost",
      params: type === "confirm" ? [account, queue?.pubkey] : [queue?.pubkey, wei]
    })
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        updateState({
          confirmAndCancelLoadingPosition: []
        });
        addAction?.({
          type: "Delegate",
          action: "Deposit",
          symbol: "BGT",
          name: validator?.name,
          amount: queue?.balance,
          template: "BGTStation",
          transactionHash,
          chain_id: DEFAULT_CHAIN_ID,
          sub_type: type === "confirm" ? "Confirm" : "Cancel",
          extra_data: JSON.stringify({
            validator: validator?.address?.toLocaleLowerCase()
          })
        });
        onSuccess();
        toast?.dismiss(toastId);
        toast?.success({
          title:
            type === "confirm" ? "Confirm Successful!" : "Cancel Successful!"
        });
      })
      .catch((error: any) => {
        updateState({
          confirmAndCancelLoadingPosition: []
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: type === "confirm" ? "Confirm Failed!" : "Cancel Failed!",
          text: error?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : ""
        });
      });
  };

  return loading ? (
    <div className="flex justify-center">
      <CircleLoading size={28} />
    </div>
  ) : delegationQueue?.length > 0 ? (
    <div className={clsx("flex flex-col gap-3", className)}>
      {
        delegationQueue?.map((queue: QueueType, index: number) => (
          <div className="flex flex-col" key={index}>
            <div className="w-full rounded-md border border-border p-4">
              <div className="flex w-full justify-between">
                <div className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="relative shrink-0 overflow-hidden aspect-square flex items-center justify-center rounded-full text-foreground bg-background border border-border text-[8px] h-8 w-8">
                      <img
                        className="aspect-square h-full w-full rounded-full"
                        src={queue?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"}
                      />
                    </div>
                    <div>{queue?.metadata?.name || formatLongText(queue?.pubkey, 4, 4)}</div>
                  </div>
                  <div className="ml-8 text-muted-foreground">
                    <span className="relative inline-flex flex-row items-center text-nowrap">
                      {formatValueDecimal(queue?.balance, "", 2)}
                    </span>{" "}
                    BGT
                  </div>
                </div>
                <div>
                  <button
                    className={clsx(
                      "inline-flex h-fit items-center justify-center transition-duration-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none ring-offset-background text-muted-foreground hover:bg-muted px-4 py-2 rounded-md text-lg font-semibold leading-7",
                      queue?.canConfirm
                        ? ""
                        : "opacity-30 !cursor-not-allowed"
                    )}
                    disabled={!queue?.canConfirm}
                    onClick={() => {
                      handleClickConfirmAndCancel(queue, [
                        "confirm",
                        index
                      ]);
                    }}
                  >
                    {state?.confirmAndCancelLoadingPosition[0] ===
                      "confirm" &&
                      state?.confirmAndCancelLoadingPosition[1] ===
                      index ? (
                      <CircleLoading size={14} />
                    ) : (
                      "Confirm"
                    )}
                  </button>
                  <button
                    className="inline-flex h-fit items-center justify-center transition-duration-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none ring-offset-background text-muted-foreground hover:bg-muted px-4 py-2 rounded-md text-lg font-semibold leading-7"
                    onClick={() => {
                      handleClickConfirmAndCancel(queue, [
                        "cancel",
                        index
                      ]);
                    }}
                  >
                    {state?.confirmAndCancelLoadingPosition[0] ===
                      "cancel" &&
                      state?.confirmAndCancelLoadingPosition[1] ===
                      index ? (
                      <CircleLoading size={14} />
                    ) : (
                      "Cancel"
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-6 pl-8 pr-4">
                <div className="h-[9px] overflow-hidden rounded border border-border">
                  <div
                    className={clsx(
                      queue?.canConfirm ? "bg-[#079467]" : "bg-[#0084c5]",
                      "h-full"
                    )}
                    style={{ width: queue?.remainingPercentage }}
                  ></div>
                </div>
                {queue?.canConfirm ? (
                  <div className="text-[#079467]">
                    Ready for confirmation
                  </div>
                ) : (
                  <div className="flex justify-between pt-2 text-sm font-medium leading-6">
                    <div>Confirmation Wait Duration</div>
                    <div>
                      <span className="text-info-foreground">
                        {queue?.remainingBlockNumber} blocks remaining
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  ) : (empty ? empty : (
    <div className="text-center text-[#3D405A] font-Montserrat text-[14px] font-medium mt-[15px]">
      <Empty desc="No validators in queue" />
    </div>
  ))
})
