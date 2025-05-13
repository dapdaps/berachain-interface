import Back from '@/sections/bgt/validator/components/back';
import { formatLongText } from '@/utils/utils';
import { formatValueDecimal } from '@/utils/balance';
import clsx from 'clsx';
import Big from 'big.js';
import Range from '@/components/range';
import Button from '@/sections/bgt/components/delegate/button';
import QueueList from '@/sections/bgt/components/delegate/queue-list';
import React, { useEffect } from 'react';
import Select from '@/sections/bgt/components/delegate/select';
import useCustomAccount from '@/hooks/use-account';
import useIsMobile from '@/hooks/use-isMobile';
import useToast from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import useAddAction from '@/hooks/use-add-action';
import useDelegationQueue from '@/sections/bgt/components/delegate/hooks/use-delegation-queue';
import { useMultiState } from '@/hooks/use-multi-state';
import { ethers } from 'ethers';
import { BGT_ADDRESS } from '@/sections/bgt/config';
import { BGT_ABI } from '@/sections/bgt/abi';
import { DEFAULT_CHAIN_ID } from '@/configs';

const DelegateContent = (props: any) => {
  const { visible, validator, operationType, onClose, onValidatorSelect, className, isFromVaults, isShowTitle = true } = props;

  console.log('operationType: %o', operationType);

  const { provider, account } = useCustomAccount();
  const isMobile = useIsMobile();

  const toast = useToast();
  const searchParams = useSearchParams();
  const searchParamFrom = searchParams.get("from");
  const { addAction } = useAddAction((searchParamFrom === "vaults" || isFromVaults) ? "vaults" : "bgt");
  const { loading, delegationQueue, getDelegationQueue } = useDelegationQueue();

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
    const contract = new ethers.Contract(BGT_ADDRESS, BGT_ABI as any, provider);
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
    const percentage: any = getPercentage(amount);
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
      BGT_ABI as any,
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
  }, [visible, account, provider, validator?.id, state?.updater]);

  return (
    <>
      <div className={clsx("", className)}>
        {
          isShowTitle && (
            <div className="flex items-center gap-[16px] text-black font-Montserrat text-[20px] font-bold leading-[90%]">
              {isMobile && <Back onBack={onClose} />}
              {operationType === "delegate" ? "Delegate" : "Unbond"}
            </div>
          )
        }
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
              className="w-[26px] h-[26px] rounded-[15px] border border-black overflow-hidden"
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
                    percentage: getPercentage(amount) as any,
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
            onChange={(e: any) => {
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
};

export default DelegateContent;
