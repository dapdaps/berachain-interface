// @ts-nocheck
import CircleLoading from '@/components/circle-loading';
import Modal from '@/components/modal';
import { DEFAULT_CHAIN_ID } from '@/configs';
import useCustomAccount from '@/hooks/use-account';
import useAddAction from "@/hooks/use-add-action";
import { useMultiState } from '@/hooks/use-multi-state';
import useToast from '@/hooks/use-toast';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import clsx from 'clsx';
import { ethers } from 'ethers';
import { memo, useEffect } from 'react';
import { BGT_ABI } from '../../abi';
import { BGT_ADDRESS } from '../../config';
import { OperationTypeType, ValidatorType } from '../../types';
import Button from './button';
import useDelegationQueue, { QueueType } from './hooks/use-delegation-queue';
import Select from './select';
const TABS = [
  {
    value: 'Deposit',
    label: 'Deposit',
    disabled: false
  },
  {
    value: 'Withdraw',
    label: 'Withdraw',
    disabled: false
  }
];

interface IProps {
  visible: boolean;
  validator: ValidatorType;
  operationType: OperationTypeType;
  onClose: VoidFunction
}
export default memo(function Delegate(props: IProps) {
  const {
    visible,
    validator,
    operationType,
    onClose
  } = props

  const {
    provider, account
  } = useCustomAccount()

  const toast = useToast()
  const { addAction } = useAddAction("bgt");
  const {
    loading,
    delegationQueue,
    getDelegationQueue
  } = useDelegationQueue()

  const [state, updateState] = useMultiState({
    balance: "",
    inAmount: "",
    rangeIndex: -1,
    percentage: 0,
    updater: 0,
    isLoading: false,
    // isConfirmAndCancelLoading: false,
    confirmAndCancelLoadingPosition: [],
    selectVisible: false
  })
  const RangeList = [0.25, 0.5, 0.75, 1]

  const getBalance = async () => {
    const contract = new ethers.Contract(BGT_ADDRESS, BGT_ABI, provider)
    try {
      const response = operationType === "delegate" ?
        await contract?.unboostedBalanceOf(account) :
        await contract?.boosted(account, validator?.address)
      updateState({
        balance: ethers.utils.formatUnits(response)
      })
    } catch (error) {
      console.error(error)
    }
  }
  const getPercentage = (_amount: string) => {
    return Big(_amount).div(state?.balance ?? 1).times(100).toFixed()
  }
  const handleAmountChange = (_amount: string) => {
    const amount = _amount.replace(/\s+/g, '');
    if (isNaN(Number(amount))) return;
    if (!amount) {
      updateState({
        inAmount: amount,
        percentage: 0,
        rangeIndex: -1
      });
      return;
    }

    updateState({
      inAmount: amount,
      percentage: getPercentage(amount),
      rangeIndex: -1
    })
  }
  const executionContract = async ({
    contract,
    method,
    params,
    options = {}
  }: any) => {
    let gas = null
    try {
      gas = await contract.estimateGas[method](...params)
    } catch (error) {
      console.error(error)
    }
    try {
      gas ? Big(gas.toString()).mul(1.2).toFixed(0) : 4000000;
      const unsignedTx = await contract.populateTransaction[method](...params, {
        ...options,
        gasLimit: gas
      })
      console.log('unsignedTx', unsignedTx)
      const tx = await provider.getSigner().sendTransaction(unsignedTx)
      return tx.wait()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClickButton = async () => {
    const toastId = toast?.loading({
      title: operationType === "delegate" ? "Queue Boost..." : "Unbond..."
    });
    updateState({
      isLoading: true,
    });
    const contract = new ethers.Contract(BGT_ADDRESS, BGT_ABI, provider?.getSigner())
    const wei = ethers.utils.parseUnits(Big(state?.inAmount).toFixed(18), 18);
    executionContract({
      contract,
      method: operationType === "delegate" ? "queueBoost" : "dropBoost",
      params: [validator?.address, wei]
    }).then((receipt: any) => {

      const { status, transactionHash } = receipt;
      addAction?.({
        type: 'Delegate',
        action: 'Deposit',
        symbol: "BGT",
        name: validator?.name,
        amount: state.inAmount,
        template: "BGTStation",
        status: status,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        add: operationType === "delegate" ? 1 : 0,
        sub_type: operationType === "delegate" ? "Stake" : "Unstake"
      });
      updateState({
        isLoading: false,
      });
      onSuccess()
      onClose()
      toast?.dismiss(toastId);
      toast?.success({
        title: operationType === "delegate" ? 'Queue Boost Successfully!' : 'Unbond Successfully!'
      });
    }).catch((error: any) => {
      updateState({
        isLoading: false
      });
      toast?.dismiss(toastId);
      toast?.fail({
        title: operationType === "delegate" ? 'Queue Boost Failed!' : 'Unbond Failed!',
        text: error?.message?.includes('user rejected transaction') ? 'User rejected transaction' : ''
      });
    })
  }

  const handleClickConfirmAndCancel = async (queue: QueueType, position: any) => {
    const [type, index] = position
    const toastId = toast?.loading({
      title: type === "confirm" ? "Confirming..." : "Canceling..."
    });
    updateState({
      confirmAndCancelLoadingPosition: position
    });
    const contract = new ethers.Contract(BGT_ADDRESS, BGT_ABI, provider?.getSigner())
    const wei = ethers.utils.parseUnits(Big(queue?.balance).toFixed(18), 18);
    executionContract({
      contract,
      method: type === "confirm" ? "activateBoost" : "cancelBoost",
      params: type === "confirm" ? [queue?.address] : [queue?.address, wei]
    }).then((receipt: any) => {
      const { status, transactionHash } = receipt;
      updateState({
        confirmAndCancelLoadingPosition: []
      });
      onSuccess()
      onClose()
      toast?.dismiss(toastId);
      toast?.success({
        title: type === "confirm" ? 'Confirm Successfully!' : 'Cancel Successfully!'
      });
    }).catch((error: any) => {
      updateState({
        confirmAndCancelLoadingPosition: []
      });
      toast?.dismiss(toastId);
      toast?.fail({
        title: type === "confirm" ? 'Confirm Failed!' : 'Cancel Failed!',
        text: error?.message?.includes('user rejected transaction') ? 'User rejected transaction' : ''
      });
    })
  }


  const onSuccess = () => {
    updateState({
      updater: Date.now(),
    })
  }
  useEffect(() => {
    if (visible) {
      if (account) {
        getBalance()
        getDelegationQueue()
      }
    } else {
      updateState({
        inAmount: "",
        rangeIndex: -1,
        percentage: 0
      })
    }
  }, [visible, account, state?.updater])
  return (
    <>
      <Modal open={visible} onClose={onClose}>
        <div className='px-[32px] pt-[28px] w-[520px] h-[452px] pb-[69px] overflow-auto rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,_0,_0,_0.25)]'>
          <div className='text-black font-Montserrat text-[20px] font-bold leading-[90%]'>{operationType === "delegate" ? "Delegate" : "Unbond"}</div>
          <div className='mt-[35px] mb-[12px] w-full h-[72px] flex items-center gap-[8px] justify-between rounded-[12px] border border-[#373A53] bg-white'>
            <input value={state?.inAmount} onChange={(event) => handleAmountChange(event?.target?.value)} className='py-[24px] pl-[17px] w-full h-[100%] text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
            <div
              className='cursor-pointer mr-[12px] px-[12px] w-[148px] h-[46px] rounded-[8px] border border-[#373A53] bg-[#FFFDEB] flex items-center'
              onClick={() => {
                updateState({
                  selectVisible: true
                })
              }}
            >
              <div className='w-[26px] h-[26px] rounded-[15px] border border-black overflow-hidden'>
                <img src={validator?.icon} alt={validator?.name} />
              </div>
              <div className='ml-[8px] mr-[10px] w-[65px] text-ellipsis overflow-hidden text-black font-Montserrat text-[16px] whitespace-nowrap font-semibold leading-[90%]'>{validator?.name}</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M1 1L6 5L11 1" stroke="black" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
          </div>
          <div className='text-[#3D405A] font-Montserrat text-[12px] font-medium'>balance: {formatValueDecimal(state?.balance, '', 2)} BGT</div>
          <div className='mt-[12px] mb-[24px] flex items-center gap-[24px]'>

            <div className='flex items-center gap-[8px]'>
              {
                RangeList.map((range: number, index: number) => (
                  <div
                    key={index}
                    className={clsx(
                      ['cursor-pointer w-[48px] h-[22px] flex items-center justify-center rounded-[6px] border border-[#373A53] text-black font-Montserrat text-[14px]',
                        index === state?.rangeIndex ? 'bg-[#FFDC50]' : ""]
                    )}
                    onClick={() => {
                      const amount = Big(state?.balance).times(range).toFixed()
                      updateState({
                        inAmount: amount,
                        percentage: getPercentage(amount),
                        rangeIndex: index,
                      })
                    }}
                  >{range === 1 ? 'Max' : range * 100 + '%'}</div>
                ))
              }
            </div>
            <div className='flex items-center w-[216px] h-[8px] rounded-[12px] bg-[#DFDCC4]'>
              <div className='relative bg-[#FFDC50] h-full rounded-[12px]' style={{ width: state?.percentage + '%' }}>
                <div className='absolute right-[-5px] top-[-5px] w-[18px] h-[18px] rounded-full bg-[#FFDC50] border border-black'></div>
              </div>
            </div>
          </div>
          <Button
            loading={state?.isLoading}
            inAmount={state?.inAmount}
            balance={state?.balance}
            operationType={operationType}
            onClick={handleClickButton}
          >{operationType === "delegate" ? "Queue Boost" : "Unbond"}</Button>
          <div className='flex flex-col gap-3 mt-[32px]'>
            <div className=' text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>Delegation Queue</div>

            {
              loading ? (
                <div className='flex justify-center'>
                  <CircleLoading size={28} />
                </div>
              ) : delegationQueue?.length > 0 ? delegationQueue?.map((queue: QueueType, index: number) => (
                <div className='flex flex-col' key={index}>
                  <div className="w-full rounded-md border border-border p-4">
                    <div className="flex w-full justify-between">
                      <div className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="relative shrink-0 overflow-hidden aspect-square flex items-center justify-center rounded-full text-foreground bg-background border border-border text-[8px] h-8 w-8">
                            <img className="aspect-square h-full w-full rounded-full" src={queue?.icon} />
                          </div>
                          <div>{queue?.name}</div>
                        </div>
                        <div className="ml-8 text-muted-foreground">
                          <span className="relative inline-flex flex-row items-center text-nowrap">
                            {formatValueDecimal(queue?.balance, '', 2)}
                          </span> BGT
                        </div>
                      </div>
                      <div>
                        <button
                          className={clsx(
                            "inline-flex h-fit items-center justify-center transition-duration-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none ring-offset-background text-muted-foreground hover:bg-muted px-4 py-2 rounded-md text-lg font-semibold leading-7",
                            queue?.canConfirm ? "" : "opacity-30 !cursor-not-allowed"
                          )}
                          disabled={!queue?.canConfirm}
                          onClick={() => {
                            handleClickConfirmAndCancel(queue, ["confirm", index])
                          }}
                        >{state?.confirmAndCancelLoadingPosition[0] === 'confirm' && state?.confirmAndCancelLoadingPosition[1] === index
                          ? <CircleLoading size={14} /> : "Confirm"}</button>
                        <button
                          className="inline-flex h-fit items-center justify-center transition-duration-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none ring-offset-background text-muted-foreground hover:bg-muted px-4 py-2 rounded-md text-lg font-semibold leading-7"
                          onClick={() => {
                            handleClickConfirmAndCancel(queue, ["cancel", index])
                          }}
                        >{state?.confirmAndCancelLoadingPosition[0] === 'cancel' && state?.confirmAndCancelLoadingPosition[1] === index
                          ? <CircleLoading size={14} /> : "Cancel"}</button>
                      </div>
                    </div>
                    <div className="mt-6 pl-8 pr-4">
                      <div className="h-[9px] overflow-hidden rounded border border-border">
                        <div className={clsx(queue?.canConfirm ? "bg-[#079467]" : "bg-[#0084c5]", "h-full")} style={{ width: queue?.remainingPercentage }}></div>
                      </div>
                      {
                        queue?.canConfirm ? (
                          <div className="text-[#079467]">Ready for confirmation</div>
                        ) : (
                          <div className="flex justify-between pt-2 text-sm font-medium leading-6">
                            <div>Confirmation Wait Duration</div>
                            <div>
                              <span className="text-info-foreground">{queue?.remainingBlockNumber} blocks remaining</span>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              )) : (
                <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>No validators in queue</div>
              )
            }
          </div>
        </div>
      </Modal >
      <Select
        visible={state?.selectVisible}
        onClose={() => {
          updateState({
            selectVisible: false
          })
        }}
      />
    </>
  );
});
