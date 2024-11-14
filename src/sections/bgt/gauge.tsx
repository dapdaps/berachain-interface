import CircleLoading from '@/components/circle-loading';
import Slider from '@/components/slider';
import SwitchTabs from '@/components/switch-tabs';
import useCustomAccount from '@/hooks/use-account';
import useAddAction from "@/hooks/use-add-action";
import { useBGT, ABI, VAULT_ADDRESS_ABI } from "@/hooks/use-bgt";
import useExecutionContract from '@/hooks/use-execution-contract';
import useGauge from '@/hooks/use-gauge';
import { useMultiState } from '@/hooks/use-multi-state';
import useToast from '@/hooks/use-toast';
import BgtHead from '@/sections/bgt/components/bgt-head';
import { usePriceStore } from '@/stores/usePriceStore';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from "react";
// import { ERC20_ABI, VAULT_ADDRESS_ABI } from './abi';
import Button from "./components/gauge/button";
const TABS = [
  {
    value: 'deposit',
    label: 'Deposit',
    disabled: false
  },
  {
    value: 'withdraw',
    label: 'Withdraw',
    disabled: false
  }
];
const RangeList = [25, 50, 75, 100]
const rewardSymbol = "BGT"
const template = "Gauge"

export default memo(function gauge() {
  const toast = useToast()
  const { addAction } = useAddAction("gauge");
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<"deposit" | "withdraw">(TABS[0].value);
  const decimals = 18
  const { account, provider, chainId } = useCustomAccount()
  const [state, updateState] = useMultiState({
    stakeAddress: "",
    vaultAddress: "",
    balance: "",
    depositAmount: "",
    earned: "",
    totalSupply: "",
    inAmount: "",
    isApproved: true,
    isApproving: false,
    updater: 0,
    rangeIndex: -1,
    percentage: 0,
    claimLoading: false
  })

  const {
    data: bgtData,
  } = useBGT();

  const { data: gaugeData } = useGauge()
  const { executionContract } = useExecutionContract()
  const prices: any = usePriceStore(store => store.price);

  const getBalance = async (stakingTokenAddress, vaultAddress) => {
    const contract = new ethers.Contract(currentTab === "deposit" ? stakingTokenAddress : vaultAddress, ABI, provider)
    const response = await contract.balanceOf(account)
    updateState({
      balance: ethers.utils.formatUnits(response),
    })
  }
  const getDepositAmount = async (vaultAddress) => {
    const contract = new ethers.Contract(vaultAddress, ABI, provider)
    const response = await contract.balanceOf(account)
    updateState({
      depositAmount: ethers.utils.formatUnits(response)
    })
  }
  const getEarned = async (vaultAddress) => {
    const contract = new ethers.Contract(vaultAddress, VAULT_ADDRESS_ABI, provider)
    const response = await contract.earned(account)
    updateState({
      earned: ethers.utils.formatUnits(response)
    })
  }

  const getTotalsupply = async (vaultAddress) => {
    const contract = new ethers.Contract(vaultAddress, ABI, provider)
    const response = await contract.totalSupply()

    console.log('===totalSupply111', ethers.utils.formatUnits(response))
    updateState({
      totalSupply: ethers.utils.formatUnits(response)
    })
  }

  const getContractData = () => {
    const {
      stakingTokenAddress,
      vaultAddress
    } = gaugeData
    updateState({
      stakeAddress: stakingTokenAddress,
      vaultAddress
    })

    try {
      getBalance(stakingTokenAddress, vaultAddress)
      getEarned(vaultAddress)
      getDepositAmount(vaultAddress)
      getTotalsupply(vaultAddress)
    } catch (error) {
      console.error(error)
    }
  }

  const ellipsAddress = (address?: string) => {
    if (!address || !ethers.utils.isAddress(address)) return '-';
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  const handleClaim = () => {
    const toastId = toast?.loading({
      title: `Claim...`
    });
    updateState({
      claimLoading: true
    })
    const contract = new ethers.Contract(state?.vaultAddress, VAULT_ADDRESS_ABI, provider?.getSigner())
    contract
      .getReward(account)
      .then(tx => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;

        addAction?.({
          type: 'Staking',
          action: 'Claim',
          token: {
            symbol: rewardSymbol
          },
          amount: state?.earned,
          template,
          status: status,
          transactionHash,
          chain_id: chainId,
          sub_type: "Claim"
        });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successfully!'
        });
        updateState({
          claimLoading: false
        })
        setTimeout(() => {
          onSuccess?.()
        }, 3000)
      }).catch((error: Error) => {
        console.log('error: ', error);
        updateState({
          claimLoading: false
        })
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Claim Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  }

  const getPercentage = (_amount: string) => {
    return Big(state?.balance).eq(0) ? 0 : Big(_amount).div(state?.balance ?? 1).times(100).toFixed()
  }

  const handleAmountChange = (_amount: string) => {
    const amount = _amount.replace(/\s+/g, '');
    if (isNaN(Number(amount))) return;
    if (!amount) {
      updateState({
        inAmount: amount,
        percentage: 0,
      });
      return;
    }

    updateState({
      inAmount: amount,
      percentage: getPercentage(amount),
    })
  };
  const handleMax = () => {
    handleAmountChange(state?.balance)
  }

  const onSuccess = () => {
    updateState({
      inAmount: "",
      updater: Date.now(),
    })
  }

  useEffect(() => {
    if (account && provider && gaugeData && currentTab) {
      getContractData()
    }
  }, [account, provider, gaugeData, currentTab, state?.updater])
  return (
    <div className="flex flex-col items-center pt-[75px]">
      <BgtHead bgtData={bgtData} />
      <div className="w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <div className="mb-[30px] flex items-center justify-between pl-[19px] pr-[23px] h-[75px] rounded-[20px] bg-[#FFDC50]">
          <div className="flex items-center">
            <svg onClick={() => {
              router.back()
            }} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect x="0.5" y="0.5" width="33" height="33" rx="10.5" fill="white" stroke="#373A53" />
              <path d="M20 11L15.2 17L20 23" stroke="black" stroke-width="3" stroke-linecap="round" />
            </svg>
            <div className="ml-[32px] mr-[14px] w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src={gaugeData?.metadata?.logoURI || "/images/bgt-logo.svg"} alt={gaugeData?.metadata?.name} />
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className="text-black text-[20px] font-Montserrat font-semibold leading-[90%]">{gaugeData?.metadata?.name}</div>
              <div className="flex items-center gap-[4px]">
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16.002" height="16.002" rx="4" fill="#DA5D18" />
                  <path d="M12.0025 8.14966C12.0025 7.04925 11.5809 5.99386 10.8306 5.21573C10.0803 4.43763 9.06259 4.00049 8.00148 4.00049C6.88295 4.00485 5.80939 4.45746 5.00519 5.2637L4.00049 6.30556" stroke="#FEE1C7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M4.00049 4.00049V6.37116H6.37116" stroke="#FEE1C7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M4.00049 8.14966C4.00049 9.17147 4.42202 10.1515 5.17233 10.874C5.92266 11.5965 6.94037 12.0025 8.00148 12.0025C9.12 11.9984 10.1936 11.5781 10.9978 10.8295L12.0025 9.86204" stroke="#FEE1C7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M9.63086 9.6311H12.0015V12.0018" stroke="#FEE1C7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                </svg> */}
                <div className='w-[16px] h-[16px] rounded-full overflow-hidden'>
                  <img src={gaugeData?.metadata?.productMetadata?.logoURI || "/images/bgt-logo-1.svg"} alt={gaugeData?.metadata?.product} />
                </div>
                <div className="text-black text-[12px] font-Montserrat font-medium leading-[90%]">
                  {gaugeData?.metadata?.product}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="text-black font-Montserrat text-[12px] font-medium">
              Staking Token : <span className="underline cursor-pointer" onClick={() => window.open("https://bartio.beratrail.io/address/" + gaugeData?.stakingTokenAddress)}>{ellipsAddress(gaugeData?.stakingTokenAddress)}</span>
            </div>
            <div className="text-black font-Montserrat text-[12px] font-medium">
              Reward Vault : <span className="underline cursor-pointer" onClick={() => window.open("https://bartio.beratrail.io/address/" + gaugeData?.vaultAddress)}>{ellipsAddress(gaugeData?.vaultAddress)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[24px]">
          <div className="flex-1 py-[24px] px-[20px] rounded-[10px] bg-black/[0.06]">

            <SwitchTabs
              tabs={TABS}
              current={currentTab}
              onChange={(current) => {
                setCurrentTab(current);
              }}
            />

            {
              currentTab === "deposit" ? (
                <div className="flex flex-col">
                  <div className="ml-[15px] mt-[17px] mb-[20px] text-[#3D405A] font-Montserrat text-[14px] font-medium">Deposit your tokens to start earning BGT rewards</div>

                  <div className="mb-[14px] flex flex-col h-[72px] rounded-[12px] border border-[#373A53] bg-white">
                    <div className="pt-[16px] pl-[20px] pr-[14px] flex items-center justify-between">
                      <input type='number' value={state?.inAmount} onChange={(event) => handleAmountChange(event?.target?.value)} className='flex-1 text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
                      <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{gaugeData?.metadata?.name}</span>
                    </div>
                    <div className="flex justify-end pr-[14px]">
                      <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className='underline cursor-pointer' onClick={handleMax}>{formatValueDecimal(state?.balance, '', 2)}</span></div>
                    </div>
                  </div>
                  <Button
                    type={currentTab}
                    symbol={gaugeData?.metadata?.name}
                    amount={state?.inAmount}
                    decimals={18}
                    balance={state?.balance}
                    address={state?.stakeAddress}
                    vaultAddress={state?.vaultAddress}

                    abi={VAULT_ADDRESS_ABI}
                    method="stake"
                    onSuccess={onSuccess}
                  >
                    Deposit
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="ml-[15px] mt-[17px] mb-[20px] text-[#3D405A] font-Montserrat text-[14px] font-medium">Withdrawing your receipt tokens will also claim your outstanding BGT rewards</div>

                  <div className="flex flex-col h-[72px] rounded-[12px] border border-[#373A53] bg-white">
                    <div className="pt-[16px] pl-[20px] pr-[14px] flex items-center justify-between">
                      <input value={state?.inAmount} onChange={(event) => handleAmountChange(event?.target?.value)} className='text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
                      <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{gaugeData?.metadata?.name}</span>
                    </div>
                    <div className="flex justify-end pr-[14px]">
                      <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className='underline cursor-pointer' onClick={handleMax}>{formatValueDecimal(state?.balance, '', 2)}</span></div>
                    </div>
                  </div>

                  <div className='my-[16px]'>
                    <Slider
                      ranges={RangeList}
                      rangeIndex={state?.rangeIndex}
                      percentage={state?.percentage}
                      onChange={(percentage) => {
                        updateState({
                          percentage,
                          inAmount: Big(state?.balance ? state?.balance : 0).times(Big(percentage).div(100)).toFixed(),
                          rangeIndex: RangeList.findIndex(range => Big(range).eq(Big(percentage))),
                        })
                      }}
                    />
                  </div>

                  <Button
                    type={currentTab}
                    symbol={gaugeData?.metadata?.name}
                    amount={state?.inAmount}
                    decimals={18}
                    balance={state?.balance}
                    address={state?.stakeAddress}
                    vaultAddress={state?.vaultAddress}

                    abi={VAULT_ADDRESS_ABI}
                    method="withdraw"
                    onSuccess={onSuccess}
                  >
                    Withdraw
                  </Button>
                </div>
              )
            }
          </div>

          <div className="w-[465px] flex flex-col gap-[13px]">
            <div className="p-[20px] w-full h-[103px] rounded-[10px] bg-black/[0.06]">
              <div className="mb-[30px] text-black font-Montserrat text-[18px] font-semibold leading-[90%]">My Vault Deposits</div>
              <div className="flex items-center justify-between">
                <div className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">{gaugeData?.metadata?.name}</div>
                <div className="flex items-center gap-[11px]">
                  <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{formatValueDecimal(state?.depositAmount, '', 2, false, false)}</span>
                  <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">{formatValueDecimal(Big(state?.depositAmount ? state?.depositAmount : 0).div(state?.totalSupply ? state?.totalSupply : 1).times(100).toFixed(), '', 2, false, false)}%</span>
                </div>
              </div>
            </div>

            <div className="p-[20px] w-full h-[184px] rounded-[10px] bg-black/[0.06]">
              <div className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">Unclaimed Rewards</div>

              <div className="mt-[30px] mb-[18px] flex items-center justify-between">

                <div className="flex items-center gap-[8px]">
                  <div className="w-[20px] h-[20px] rounded-full">
                    <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
                  </div>
                  <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{rewardSymbol}</span>
                </div>
                <div className="flex items-center gap-[11px]">
                  <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{formatValueDecimal(state?.earned, '', 2, false, false)}</span>
                  <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">{formatValueDecimal(Big(state?.earned ? state?.earned : 0).times(prices?.["BGT"] ?? 0).div(prices?.["USDC"] ?? 1).toFixed(), '$', 2, false, false)}</span>
                </div>
              </div>
              {
                Big(state?.earned ? state?.earned : 0).gt(0) &&
                <>
                  {
                    state?.claimLoading ? (
                      <div className="cursor-not-allowed opacity-50 flex items-center justify-center h-[60px] rounded-[10px] border bg-[#FFDC50]">
                        <CircleLoading size={14} />
                      </div>
                    ) : (
                      <div className="cursor-pointer flex items-center justify-center h-[60px] rounded-[10px] border bg-[#FFDC50]  text-black font-Montserrat text-[18px] font-semibold leading-[90%]" onClick={handleClaim}>Claim</div>
                    )
                  }
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  )
})
