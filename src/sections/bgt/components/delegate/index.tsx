// @ts-nocheck
import CircleLoading from "@/components/circle-loading";
import Modal from "@/components/modal";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import { useMultiState } from "@/hooks/use-multi-state";
import useToast from "@/hooks/use-toast";
import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import { ethers } from "ethers";
import React, { memo, useEffect } from "react";
import { BGT_ABI } from "../../abi";
import { BGT_ADDRESS, VALIDATORS } from "../../config";
import { OperationTypeType, ValidatorType } from "../../types";
import Button from "./button";
import useDelegationQueue, { QueueType } from "./hooks/use-delegation-queue";
import Select from "./select";
import Range from "@/components/range";
import Back from "@/sections/bgt/validator/components/back";
import useIsMobile from "@/hooks/use-isMobile";
import useValidators from "./hooks/use-validators";
import { formatLongText } from "@/utils/utils";
import { useBgtStore } from "@/stores/bgt";
import QueueList from "./queue-list";
import { useSearchParams } from 'next/navigation';
import CustomImage from "@/components/custom-image";
const TABS = [
  {
    value: "Deposit",
    label: "Deposit",
    disabled: false
  },
  {
    value: "Withdraw",
    label: "Withdraw",
    disabled: false
  }
];

interface IProps {
  visible: boolean;
  validator: ValidatorType;
  operationType: OperationTypeType;
  onClose: VoidFunction;
  onValidatorSelect?(value: any): any;
}
export default memo(function Delegate(props: IProps) {
  const { visible, validator, operationType, onClose, onValidatorSelect } = props;

  const store = useBgtStore()
  const { provider, account } = useCustomAccount();
  const isMobile = useIsMobile();

  const toast = useToast();
  const searchParams = useSearchParams();
  const searchParamFrom = searchParams.get("from");
  const { addAction } = useAddAction(searchParamFrom === "vaults" ? "vaults" : "bgt");
  const { loading, delegationQueue, getDelegationQueue } = useDelegationQueue();

  // const validators = store.validators

  const [state, updateState] = useMultiState({
    balance: "",
    inAmount: "",
    rangeIndex: -1,
    percentage: 0,
    updater: 0,
    isLoading: false,
    confirmAndCancelLoadingPosition: [],
    selectVisible: false
  });
  const RangeList = [0.25, 0.5, 0.75, 1];

  const getBalance = async () => {
    const contract = new ethers.Contract(BGT_ADDRESS, BGT_ABI, provider);
    try {
      const response =
        operationType === "delegate"
          ? await contract?.unboostedBalanceOf(account)
          : await contract?.boosted(account, validator?.pubkey);
      updateState({
        balance: ethers.utils.formatUnits(response)
      });
    } catch (error) {
      console.error(error);
    }
  };
  const getPercentage = (_amount: string) => {
    _amount = Big(_amount).gt(state?.balance) ? state?.balance : _amount;
    return Big(state?.balance).eq(0)
      ? 0
      : Big(_amount)
        .div(state?.balance ?? 1)
        .times(100)
        .toFixed();
  };
  const handleAmountChange = (_amount: string) => {
    const amount = _amount.replace(/\s+/g, "");
    if (isNaN(Number(amount))) return;
    if (!amount) {
      updateState({
        inAmount: amount,
        percentage: 0,
        rangeIndex: -1
      });
      return;
    }
    const percentage = getPercentage(amount);
    const rangeIndex = RangeList.findIndex((range) =>
      Big(range).eq(Big(percentage).div(100))
    );
    updateState({
      inAmount: amount,
      percentage,
      rangeIndex
    });
  };
  const executionContract = async ({
    contract,
    method,
    params,
    options = {}
  }: any) => {
    let gas = null;
    try {
      gas = await contract.estimateGas[method](...params);
    } catch (error) {
      console.error(error);
    }
    try {
      gas ? Big(gas.toString()).mul(1.2).toFixed(0) : 4000000;
      const unsignedTx = await contract.populateTransaction[method](...params, {
        ...options,
        gasLimit: gas
      });
      console.log("unsignedTx", unsignedTx);
      const tx = await provider.getSigner().sendTransaction(unsignedTx);
      return tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickButton = async () => {
    const toastId = toast?.loading({
      title: operationType === "delegate" ? "Queue Boost..." : "Unbond..."
    });
    updateState({
      isLoading: true
    });
    const contract = new ethers.Contract(
      BGT_ADDRESS,
      BGT_ABI,
      provider?.getSigner()
    );
    const wei = ethers.utils.parseUnits(Big(state?.inAmount).toFixed(18), 18);
    executionContract({
      contract,
      method: operationType === "delegate" ? "queueBoost" : "queueDropBoost",
      params: [validator?.pubkey, wei]
    })
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        addAction?.({
          type: "Delegate",
          action: "Deposit",
          symbol: "BGT",
          name: validator?.name,
          amount: state.inAmount,
          template: "BGTStation",
          status: status,
          transactionHash,
          chain_id: DEFAULT_CHAIN_ID,
          add: operationType === "delegate" ? 1 : 0,
          sub_type: operationType === "delegate" ? "Stake" : "Unstake",
          extra_data: JSON.stringify({
            validator: validator?.address?.toLocaleLowerCase(),
            token0Symbol: "BGT",
            amount0: state.inAmount,
            token0Address: "0x656b95e550c07a9ffe548bd4085c72418ceb1dba",
          })
        });
        updateState({
          isLoading: false
        });
        onSuccess();
        // onClose();
        toast?.dismiss(toastId);
        toast?.success({
          title:
            operationType === "delegate"
              ? "Queue Boost Successful!"
              : "Unbond Successful!"
        });
      })
      .catch((error: any) => {
        updateState({
          isLoading: false
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title:
            operationType === "delegate"
              ? "Queue Boost Failed!"
              : "Unbond Failed!",
          text: error?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : ""
        });
      });
  };

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
        // onClose();
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

  const onSuccess = () => {
    updateState({
      updater: Date.now()
    });
    onClose?.()
  };

  useEffect(() => {
    if (visible && account && provider) {
      getBalance();
      getDelegationQueue();
    }
    updateState({
      inAmount: "",
      rangeIndex: -1,
      percentage: 0
    });
  }, [visible, account, provider, validator?.address, state?.updater]);
  return (
    <>
      <Modal open={visible} onClose={onClose} innerStyle={{ width: "unset" }}>
        <div className="px-[32px] md:px-[12px] pt-[28px] w-[520px] md:w-full h-[452px] pb-[69px] overflow-auto rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,_0,_0,_0.25)]">
          <div className="flex items-center gap-[16px] text-black font-Montserrat text-[20px] font-bold leading-[90%]">
            {isMobile && <Back onBack={onClose} />}
            {operationType === "delegate" ? "Delegate" : "Unbond"}
          </div>
          <div className="mt-[35px] mb-[12px] w-full h-[72px] flex items-center gap-[8px] justify-between rounded-[12px] border border-[#373A53] bg-white">
            <input
              value={state?.inAmount}
              onChange={(event) => handleAmountChange(event?.target?.value)}
              className="py-[24px] pl-[17px] w-full h-[100%] text-[26px] text-black font-bold leading-[90%] bg-transparent"
              placeholder="0"
            />
            <div
              className="cursor-pointer mr-[12px] px-[12px] w-[148px] h-[46px] rounded-[8px] border border-[#373A53] bg-[#FFFDEB] flex items-center"
              onClick={() => {
                updateState({
                  selectVisible: true
                });
              }}
            >
              <CustomImage
                alt={validator?.metadata?.name}
                src={validator?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"}
                className="min-w-[26px] w-[26px] h-[26px] rounded-[15px] border border-black overflow-hidden"
                errorImage="https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"
              />
              <div className="ml-[8px] mr-[10px] w-[65px] text-ellipsis overflow-hidden text-black font-Montserrat text-[16px] whitespace-nowrap font-semibold leading-[90%]">
                {validator?.metadata?.name ?? formatLongText(validator?.pubkey, 4, 4)}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
              >
                <path
                  d="M1 1L6 5L11 1"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">
            balance: <span
              onClick={() => {
                updateState({
                  inAmount: state?.balance
                })
              }}
              className="underline cursor-pointer"
            >{formatValueDecimal(state?.balance, "", 2)}</span> BGT
          </div>
          <div className="mt-[12px] mb-[24px] flex md:flex-col items-center md:items-stretch gap-[24px]">
            <div className="flex items-center gap-[8px]">
              {RangeList.map((range: number, index: number) => (
                <div
                  key={index}
                  className={clsx([
                    "cursor-pointer w-[48px] h-[22px] flex items-center justify-center rounded-[6px] border border-[#373A53] text-black font-Montserrat text-[14px]",
                    index === state?.rangeIndex ? "bg-[#FFDC50]" : ""
                  ])}
                  onClick={() => {
                    const amount = Big(state?.balance ?? 0)
                      .times(range)
                      .toFixed();
                    updateState({
                      inAmount: amount,
                      percentage: getPercentage(amount),
                      rangeIndex: index
                    });
                  }}
                >
                  {range === 1 ? "Max" : range * 100 + "%"}
                </div>
              ))}
            </div>
            <Range
              value={state?.percentage}
              onChange={(e) => {
                const percentage = e.target.value;
                updateState({
                  percentage,
                  inAmount: Big(state?.balance ? state?.balance : 0)
                    .times(Big(percentage).div(100))
                    .toFixed(),
                  rangeIndex: RangeList.findIndex((range) =>
                    Big(range).eq(Big(percentage).div(100))
                  )
                });
              }}
              style={{
                marginTop: 0,
                flex: 1
              }}
            />
          </div>
          <Button
            loading={state?.isLoading}
            inAmount={state?.inAmount}
            balance={state?.balance}
            operationType={operationType}
            onClick={handleClickButton}
          >
            {operationType === "delegate" ? "Queue Boost" : "Unbond"}
          </Button>
          <div className="flex flex-col gap-3 mt-[32px]">
            <div className=" text-black font-Montserrat text-[18px] font-semibold leading-[90%]">
              Delegation Queue
            </div>
            <QueueList
              loading={loading}
              delegationQueue={delegationQueue}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      </Modal>
      <Select
        visible={state?.selectVisible}
        onClose={() => {
          updateState({
            selectVisible: false
          });
        }}
        onValidatorSelect={onValidatorSelect}
      />
    </>
  );
});
