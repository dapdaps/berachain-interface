import CircleLoading from '@/components/circle-loading';
// import Slider from '@/components/slider';
import SwitchTabs from '@/components/switch-tabs';
import { VAULT_ADDRESS_ABI } from "@/hooks/use-bgt";
import BgtHead from '@/sections/bgt/components/bgt-head';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import { memo } from "react";
import Button from "../components/gauge/button";
import { useRouter } from 'next/navigation';
import Back from './back';
import Range from '@/components/range';
import clsx from 'clsx';
import { getProtocolIcon } from '@/utils/utils';

export default memo(function gauge(props: any) {
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
    addAction
  } = props

  return (
    <div className="flex flex-col items-center pt-[75px]">
      <BgtHead bgtData={bgtData} />
      <div className="w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <div className="mb-[30px] flex items-center justify-between pl-[19px] pr-[23px] h-[75px] rounded-[20px] bg-[#FFDC50]">
          <div className="flex items-center relative">
            {/* <svg onClick={() => {
              router.back()
            }} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect x="0.5" y="0.5" width="33" height="33" rx="10.5" fill="white" stroke="#373A53" />
              <path d="M20 11L15.2 17L20 23" stroke="black" stroke-width="3" stroke-linecap="round" />
            </svg> */}
            <Back />
            <div className="ml-[32px] mr-[14px] w-[42px] h-[42px] rounded-full overflow-hidden">
              <img src={gaugeData?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"} alt={gaugeData?.metadata?.name} />
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className="text-black text-[20px] font-Montserrat font-semibold leading-[90%]">{gaugeData?.metadata?.name}</div>
              <div className="flex items-center gap-[4px]">
                <div className='w-[16px] h-[16px] rounded-full overflow-hidden'>
                  <img src={getProtocolIcon(gaugeData?.metadata?.protocolName)} alt={gaugeData?.metadata?.protocolName} />
                </div>
                <div className="text-black text-[12px] font-Montserrat font-medium leading-[90%]">
                  {gaugeData?.metadata?.protocolName}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="text-black font-Montserrat text-[12px] font-medium">
              Staking Token : <span className="underline cursor-pointer" onClick={() => window.open("https://berascan.com/address/" + gaugeData?.stakingToken?.address)}>{ellipsAddress(gaugeData?.stakingToken?.address)}</span>
            </div>
            <div className="text-black font-Montserrat text-[12px] font-medium">
              Reward Vault : <span className="underline cursor-pointer" onClick={() => window.open("https://berascan.com/address/" + gaugeData?.address)}>{ellipsAddress(gaugeData?.address)}</span>
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
                  <div className="ml-[15px] mt-[17px] mb-[20px] text-[#3D405A] font-Montserrat text-[14px] font-medium">Stake your tokens to start earning BGT rewards</div>

                  <div className="mb-[14px] flex flex-col h-[72px] rounded-[12px] border border-[#373A53] bg-white">
                    <div className="pt-[16px] pl-[20px] pr-[14px] flex items-center justify-between">
                      <input type='number' value={state?.inAmount} onChange={(event) => handleAmountChange(event?.target?.value)} className='flex-1 text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
                      <span className="truncate text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{gaugeData?.stakingToken?.symbol}</span>
                    </div>
                    <div className="flex justify-end pr-[14px]">
                      <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className='underline cursor-pointer' onClick={handleMax}>{formatValueDecimal(state?.balance, '', 2)}</span></div>
                    </div>
                  </div>
                  <Button
                    type={currentTab}
                    product={gaugeData?.metadata?.protocolName}
                    symbol={gaugeData?.stakingToken?.symbol}
                    amount={state?.inAmount}
                    template={template}
                    decimals={18}
                    balance={state?.balance}
                    address={state?.stakeAddress}
                    vaultAddress={state?.vaultAddress}

                    abi={VAULT_ADDRESS_ABI}
                    method="stake"
                    onSuccess={onSuccess}
                    addAction={addAction}
                  >
                    Stake
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="ml-[15px] mt-[17px] mb-[20px] text-[#3D405A] font-Montserrat text-[14px] font-medium">Withdrawing your receipt tokens will also claim your outstanding BGT rewards</div>

                  <div className="flex flex-col h-[72px] rounded-[12px] border border-[#373A53] bg-white">
                    <div className="pt-[16px] pl-[20px] pr-[14px] flex items-center justify-between">
                      <input value={state?.inAmount} onChange={(event) => handleAmountChange(event?.target?.value)} className='text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
                      <span className="truncate text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{gaugeData?.stakingToken?.symbol}</span>
                    </div>
                    <div className="flex justify-end pr-[14px]">
                      <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className='underline cursor-pointer' onClick={handleMax}>{formatValueDecimal(state?.balance, '', 2)}</span></div>
                    </div>
                  </div>

                  <div className='w-full my-[16px] flex md:flex-col items-center md:items-stretch gap-[24px]'>
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
                    type={currentTab}
                    product={gaugeData?.metadata?.protocolName}
                    symbol={gaugeData?.stakingToken?.symbol}
                    amount={state?.inAmount}
                    template={template}
                    decimals={18}
                    balance={state?.balance}
                    address={state?.stakeAddress}
                    vaultAddress={state?.vaultAddress}

                    abi={VAULT_ADDRESS_ABI}
                    method="withdraw"
                    onSuccess={onSuccess}
                    addAction={addAction}
                  >
                    Unstake
                  </Button>
                </div>
              )
            }
          </div>

          <div className="w-[465px] flex flex-col gap-[13px]">
            <div className="p-[20px] w-full h-[103px] rounded-[10px] bg-black/[0.06]">
              <div className="mb-[30px] text-black font-Montserrat text-[18px] font-semibold leading-[90%]">My Staked Tokens</div>
              <div className="flex items-center justify-between">
                <div className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">{gaugeData?.metadata?.name}</div>
                <div className="flex items-center gap-[11px]">
                  <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{formatValueDecimal(state?.depositAmount, '', 2, false, false)}</span>

                  <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">{formatValueDecimal((Number(state?.depositAmount) === 0 || Number(state?.totalSupply) === 0) ? 0 : Big(state?.depositAmount ?? 0).div(state?.totalSupply ?? 1).times(100).toFixed(), '', 2, false, false)}%</span>
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
