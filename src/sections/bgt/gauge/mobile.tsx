import Slider from '@/components/slider';
import SwitchTabs from '@/components/switch-tabs';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import Button from "../components/gauge/button";
import Back from "./back";
import Range from '@/components/range';
import clsx from 'clsx';
export default function BgtGaugeMobile(props: any) {
  const {
    ABI,
    VAULT_ADDRESS_ABI,
    TABS,
    RangeList,
    rewardSymbol,
    getPercentage,
    template,
    decimals,
    state,
    prices,
    updateState,
    bgtData,
    gaugeData,
    currentTab,
    setCurrentTab,
    ellipsAddress,
    handleClaim,
    handleAmountChange,
    handleMax,
    onSuccess,
    addAction,
    onBack,
  } = props

  const handleSuccess = () => {
    onSuccess?.()
    onBack?.()
  }

  return (
    <div className="relative px-[12px] pt-[19px] pb-[80px] bg-[#FFFDEB] h-full overflow-y-auto">
      <Back onBack={onBack} />

      <div className="mt-[13px] mb-[16px] h-[75px] rounded-[10px] bg-[#FFDC50] flex items-center justify-center gap-[14px]">
        <div className="w-[42px] h-[42px] rounded-full overflow-hidden">
          <img src={gaugeData?.metadata?.logoURI || "/images/bgt-logo.svg"} alt={gaugeData?.metadata?.name} />
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
            {gaugeData?.metadata?.name}
          </div>
          <div className="flex items-center gap-[4px]">
            <div className="w-[16px] h-[16px] rounded-full overflow-hidden">
              <img src={gaugeData?.metadata?.productMetadata?.logoURI || "/images/bgt-logo-1.svg"} alt={gaugeData?.metadata?.product} />
            </div>
            <div className="text-black font-Montserrat text-[12px] font-medium leading-[90%]">{gaugeData?.metadata?.product}</div>
          </div>
        </div>
      </div>

      <SwitchTabs
        tabs={TABS}
        current={currentTab}
        onChange={(current) => {
          setCurrentTab(current);
        }}
        className="md:h-[56px]"
      />

      {
        currentTab === "deposit" ? (
          <div className="flex flex-col">
            <div className="mt-[12px] mb-[18px] text-[#3D405A] font-Montserrat text-[14px] font-medium">Deposit your tokens to start earning BGT rewards</div>
            <div className="mb-[14px] flex flex-col h-[72px] rounded-[12px] border border-[#373A53] bg-white">
              <div className="pt-[16px] px-[12px] flex items-center justify-between">
                <div className='flex-1'>
                  <input type='number' value={state?.inAmount} onChange={(event) => handleAmountChange(event?.target?.value)} className='w-full text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
                </div>
                <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{gaugeData?.metadata?.name}</span>
              </div>
              <div className="flex justify-end pr-[14px]">
                <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className='underline cursor-pointer' onClick={handleMax}>{formatValueDecimal(state?.balance, '', 2)}</span></div>
              </div>
            </div>
            <Button
              type={currentTab}
              product={gaugeData?.metadata?.product}
              symbol={gaugeData?.metadata?.name}
              amount={state?.inAmount}
              template={template}
              decimals={decimals}
              balance={state?.balance}
              address={state?.stakeAddress}
              vaultAddress={state?.vaultAddress}

              abi={VAULT_ADDRESS_ABI}
              method="stake"
              onSuccess={handleSuccess}
              addAction={addAction}
            >
              Deposit
            </Button>


          </div>
        ) : (
          <div className="flex flex-col">
            <div className="mt-[12px] mb-[18px] text-[#3D405A] font-Montserrat text-[14px] font-medium">Withdrawing your receipt tokens will also claim your outstanding BGT rewards</div>
            <div className="mb-[14px] flex flex-col h-[72px] rounded-[12px] border border-[#373A53] bg-white">
              <div className="pt-[16px] px-[12px] flex items-center justify-between">
                <div className='flex-1'>
                  <input type='number' value={state?.inAmount} onChange={(event) => handleAmountChange(event?.target?.value)} className='w-full text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
                </div>
                <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{gaugeData?.metadata?.name}</span>
              </div>
              <div className="flex justify-end pr-[14px]">
                <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className='underline cursor-pointer' onClick={handleMax}>{formatValueDecimal(state?.balance, '', 2)}</span></div>
              </div>
            </div>


            <div className='mt-[12px] mb-[24px] flex md:flex-col items-center md:items-stretch gap-[24px]'>
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
                        const amount = Big(state?.balance ?? 0).times(range).toFixed()
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
              <Range
                value={state?.percentage}
                onChange={(e) => {
                  const percentage = e.target.value;
                  updateState({
                    percentage,
                    inAmount: Big(state?.balance ? state?.balance : 0).times(Big(percentage).div(100)).toFixed(),
                    rangeIndex: RangeList.findIndex(range => Big(range).eq(Big(percentage).div(100))),
                  })
                }}
                style={{
                  marginTop: 0,
                  flex: 1,
                }}
              />
            </div>


            <Button
              type={currentTab}
              product={gaugeData?.metadata?.product}
              symbol={gaugeData?.metadata?.name}
              tokens={state?.tokens}
              amount={state?.inAmount}
              template={template}
              decimals={decimals}
              balance={state?.balance}
              address={state?.stakeAddress}
              vaultAddress={state?.vaultAddress}

              abi={VAULT_ADDRESS_ABI}
              method="withdraw"
              onSuccess={handleSuccess}
              addAction={addAction}
            >
              Withdraw
            </Button>
          </div>
        )
      }

      <div className="mt-[20px] py-[20px] px-[14px] w-full rounded-[10px] bg-black/[0.06]">
        <div className="flex items-start justify-between  mb-[20px]">
          <div className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">My Vault Deposits</div>
          <div className="flex flex-col gap-[4px] items-end">
            <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{formatValueDecimal(state?.depositAmount, '', 2, false, false)}</span>
            <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">{formatValueDecimal((Number(state?.depositAmount) === 0 || Number(state?.totalSupply) === 0) ? 0 : Big(state?.depositAmount ?? 0).div(state?.totalSupply ?? 1).times(100).toFixed(), '', 2, false, false)}%</span>
          </div>
        </div>

        <div className="flex items-start justify-between  mb-[20px]">
          <div className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">Unclaimed Rewards</div>
          <div className="flex flex-col gap-[2px] items-end">
            <div className="flex items-center gap-[6px]">
              <div className="w-[20px] h-[20px] rounded-full">
                <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
              </div>
              <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{formatValueDecimal(state?.earned, '', 2, false, false)}</span>
            </div>
            <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">{formatValueDecimal(Big(state?.earned ? state?.earned : 0).times(prices?.["BGT"] ?? 0).div(prices?.["USDC"] ?? 1).toFixed(), '$', 2, false, false)}</span>
          </div>
        </div>
        {
          Big(state?.earned ? state?.earned : 0).gt(0) &&
          <div className='flex justify-end'>
            {
              state?.claimLoading ? (
                <div className="cursor-not-allowed opacity-50 flex items-center justify-center w-[93px] h-[36px] rounded-[10px] border bg-[#FFDC50] border-black">
                  <CircleLoading size={14} />
                </div>
              ) : (
                <div className="cursor-pointer flex items-center justify-center w-[93px] h-[36px] rounded-[10px] border bg-[#FFDC50] border-black  text-black font-Montserrat text-[14px] font-semibold leading-[90%]" onClick={handleClaim}>Claim</div>
              )
            }
          </div>
        }
      </div>

    </div>
  )

}