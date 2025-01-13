import Tabs from '@/components/tabs';
import { DEFAULT_CHAIN_ID } from "@/configs";
import { beraB } from '@/configs/tokens/bera-bArtio';
import useBedrock from "@/sections/staking/hooks/use-bedrock";
import SwapModal from "@/sections/swap/SwapModal";
import { usePriceStore } from "@/stores/usePriceStore";
import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import { memo, useState } from "react";
import Button from "../../Bridge/Button";
export default memo(function Bedrock({ dapp }: any) {

  const prices = usePriceStore(store => store.price)
  const [isSwitched, setIsSwitched] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('stake');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const defaultInputCurrency = beraB.bera
  const protocols = ["BEX"]
  const dexConfig = dapp?.chains?.[DEFAULT_CHAIN_ID]
  const { balance, inAmount, getBalance, handleAmountChange, handleMax, handleDeposit, handleCopy } = useBedrock(dexConfig)

  const {
    STAKE_ADDRESS,
    sourceToken,
    targetToken,
  } = dexConfig
  return (
    <div>
      <Tabs
        isCard
        currentTab={currentTab}
        tabs={[
          {
            key: 'stake',
            label: (
              <div className="text-black font-Montserrat text-[18px] font-bold leading-[90%]">Stake</div>
            ),
            children: (
              <div className="pb-[63px]">
                <div className="flex flex-col gap-[9px] px-[20px] md:px-[10px] pt-[18px] pb-[12px] h-[90px] rounded-[12px] border border-[#373A53] bg-white ">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input value={inAmount} onChange={(event) => handleAmountChange(event.target.value)} type="number" className='w-full text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0' />
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[36px]">
                        <img src={sourceToken?.icon} alt={sourceToken?.symbol} />
                      </div>
                      <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{sourceToken?.symbol}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium opacity-30">{formatValueDecimal(Big(inAmount ? inAmount : 0).times(prices?.[sourceToken?.symbol] ?? 0).toFixed(), '$', 4)}</div>
                    <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className="underline cursor-pointer" onClick={handleMax}>{formatValueDecimal(balance, '', 4)}</span></div>
                  </div>
                </div>

                {
                  inAmount && Big(inAmount).gt(0) && Big(inAmount).lt(0.0001) && (
                    <div className="mt-[8px] text-red-600 font-Montserrat text-[12px] font-medium">We do recommend a deposit of at least 0.0001 WBTC to make your transaction worthwhile.</div>
                  )
                }

                <div className="mt-[16px] mb-[22px] flex items-center gap-[17px]">
                  <div className="flex flex-col gap-[15px] flex-1 h-[89px] rounded-[10px] bg-black/[0.06] pt-[25px] px-[20px] md:px-[10px]">
                    <div className="text-[#6F6F6F] font-Montserrat text-[16px] font-semibold leading-[90%]">You will receive</div>
                    <div className="text-black font-Montserrat text-[16px] font-bold leading-[90%]">{inAmount ? inAmount : 0} {targetToken.symbol}</div>
                  </div>
                  <div className="flex flex-col gap-[15px] flex-1 h-[89px] rounded-[10px] bg-black/[0.06] pt-[25px] px-[20px] md:px-[10px]">
                    <div className="text-[#6F6F6F] font-Montserrat text-[16px] font-semibold leading-[90%]">Staking pool fee</div>
                    <div className="text-black font-Montserrat text-[16px] font-bold leading-[90%]">0</div>
                  </div>
                </div>

                <Button
                  {...{
                    type: "deposit",
                    symbol: sourceToken?.symbol,
                    amount: inAmount,
                    minAmount: "0.0001",
                    decimals: sourceToken?.decimals,
                    balance,
                    address: sourceToken?.address,
                    vaultAddress: STAKE_ADDRESS,
                    onDepositOrWithdraw: handleDeposit,
                  }}
                >Stake</Button>


                <div className="mt-[28px] flex flex-col gap-[30px]">
                  <div className="flex items-center justify-between">
                    <div className="text-[#6F6F6F] font-Montserrat text-[16px] font-semibold leading-[90%]">Exchange Ratio</div>

                    <div className="flex items-center gap-[8px]">
                      <span className="text-black font-Montserrat text-[16px] font-bold leading-[90%]">1.0 {isSwitched ? targetToken?.symbol : sourceToken?.symbol} = 1.0 {isSwitched ? sourceToken?.symbol : targetToken?.symbol}</span>
                      <svg
                        onClick={() => setIsSwitched(!isSwitched)}
                        className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                        <path d="M1 6H14L9.51724 1" stroke="#24ABFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14 11L1 11L5.48276 16" stroke="#24ABFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#6F6F6F] font-Montserrat text-[16px] font-semibold leading-[90%]">Token Contract</div>
                    <div className="flex items-center gap-[8px]">
                      <span className="text-black font-Montserrat text-[16px] font-bold leading-[90%]">{targetToken?.address
                        ? targetToken?.address?.slice(0, 6) +
                        '...' +
                        targetToken?.address?.slice(-6)
                        : ''}</span>
                      <svg
                        onClick={() => {
                          handleCopy(targetToken?.address)
                        }}
                        className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="6" y="6" width="9" height="9" rx="2" stroke="#24ABFF" stroke-width="2" />
                        <path d="M10 4V3C10 1.89543 9.10457 1 8 1H3C1.89543 1 1 1.89543 1 3V8C1 9.10457 1.89543 10 3 10H4" stroke="#24ABFF" stroke-width="2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-[46px] flex flex-col gap-[21px]">
                  <div className="text-black font-Montserrat text-[18px] font-bold leading-[90%]">Swap</div>
                  <div
                    onClick={() => {
                      setSelectedRecord(sourceToken)
                    }}
                    className="relative cursor-pointer bg-black/[0.06] pl-[16px] w-[284px] h-[62px] rounded-[10px] flex items-center gap-[14px]">
                    <div className="w-[36px]">
                      <img src={sourceToken.icon} alt={sourceToken.name} />
                    </div>
                    <div className="text-black font-Montserrat text-[16px] font-bold leading-[90%]">{sourceToken.name}</div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-[20px] w-[12px]">
                      <img src="/images/icon-right-2.svg" alt="icon-right" />
                    </div>
                  </div>
                </div>

              </div>
            )
          },
          {
            key: 'unstake',
            label: (
              <div className="relative">
                <div className="text-black font-Montserrat text-[18px] font-bold leading-[90%]">Unstake</div>
                <div className="absolute -right-[3px] -top-[7px] translate-x-[100%] w-[40px] h-[16px] rounded-[10px] border border-black bg-[#FFDC50] flex items-center justify-center text-black font-Montserrat text-[10px] font-medium">Thoon</div>
              </div>
            ),
            disabled: true,
            children: (
              <div>Borrow</div>
            )
          },
        ]}
        onChange={(key) => setCurrentTab(key as string)}
        className="h-full md:pt-[20px]"
      />

      {selectedRecord && (
        <SwapModal
          defaultOutputCurrency={selectedRecord}
          defaultInputCurrency={defaultInputCurrency}
          outputCurrencyReadonly={true}
          show={!!selectedRecord}
          protocols={protocols}
          onClose={() => {
            setSelectedRecord(null);
          }}
          onSuccess={() => {
            getBalance?.()
          }}
          from="bedrock"
        />
      )}
    </div>
  )
})
