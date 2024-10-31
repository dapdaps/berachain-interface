import { useState } from 'react';
import Drawer from '@/components/drawer';
import { useIBGT } from '@/hooks/use-ibgt';
import IbgtHead from '@/sections/bgt/components/ibgt-head';
import SwitchTabs from '@/components/switch-tabs';
import Big from 'big.js';
import { formatThousandsSeparator, formatValueDecimal } from '@/utils/balance';
import Popover from '@/components/popover';
import Modal from '@/components/modal';
import IbgtForm from '@/sections/bgt/components/ibgt-form';
import { AnimatePresence } from 'framer-motion';

const IBGTMobileView = (props: Props) => {
  const { visible, onClose } = props;

  const {
    data: ibgtData,
    tokenData: data,
    tabs,
    tIndex,
    setTIndex,
    state,
    isInSufficient,
    isWithdrawInsufficient,
    handleMax,
    handleTokenChange,
    handleLPChange,
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleClaim,
    symbol,
    handleMintIBGT,
  } = useIBGT(props);

  const [tab, setTab] = useState<any>(tabs[0]);

  const {
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount,
  } = state;

  const [totalVisible, setTotalVisible] = useState(false);
  const handleTotal = () => {
    setTotalVisible(!totalVisible);
  };

  return (
    <>
      <Drawer
        visible={visible}
        onClose={onClose}
        style={{
          background: '#000',
        }}
      >
        <IbgtHead
          ibgtData={ibgtData}
          style={{ position: 'absolute' }}
          className="scale-75 translate-y-[-50%] left-[50%] translate-x-[-50%]"
          innerStyle={{
            borderRadius: 44,
          }}
          valueStyle={{
            borderRadius: 44,
          }}
        />
        <div className="absolute w-full h-[72px] overflow-hidden top-0">
          <div className="opacity-90 w-full h-[143px] absolute top-[-72px] blur-md rounded-[387px] bg-[radial-gradient(50%_50%_at_50%_50%,_#FFDC50_0%,_rgba(255,_220,_80,_0.00)_100%)]" />
        </div>
        <div className="px-[10px] mt-[54px]">
          <div className="bg-[#FFDC50] rounded-[10px] p-[17px_8px_19px_16px] flex justify-between">
            <div className="">
              <div className="text-[#3D405A] text-[14px] font-[500]">TVL</div>
              <div className="text-black text-[16px] font-[600] mt-[11px]">
                {formatValueDecimal(data?.tvl, '$', 2, true)}
              </div>
            </div>
            <div className="">
              <div className="text-[#3D405A] text-[14px] font-[500]">APY</div>
              <div className="text-black text-[16px] font-[600] mt-[11px]">
                {Big(data?.apy ?? 0).toFixed(2)}%
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[#3D405A] text-[14px] font-[500]">% of iBGT staked</div>
              <div className="text-black text-[16px] font-[600] relative mt-[11px]" onClick={handleTotal}>
                <span>{ibgtData?.total ? Big(ibgtData?.staked).div(ibgtData?.total).times(100).toFixed(2) : '-'}%</span>
                <svg
                  className="absolute bottom-[-6px] left-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="46"
                  height="2"
                  viewBox="0 0 46 2"
                  fill="none"
                >
                  <path d="M0 1L46 1" stroke="black" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="px-[10px] mt-[10px]">
          <div className="relative bg-[rgba(255,255,255,0.16)] rounded-[10px] py-[14px] flex justify-center gap-[100px]">
            <div className="flex flex-col items-center gap-[7px] text-white text-[14px] font-[500]">
              <div className="">Your Position</div>
              <div className="flex justify-center items-center gap-[7px]">
                <img src="/images/dapps/infrared/ibgt.svg" alt="" className="w-[26px] h-[26px] rounded-full" />
                <div className="text-[20px] font-[600]">0</div>
                <div className="">iBGT</div>
              </div>
              <button
                type="button"
                className="border border-[#373A53] rounded-[10px] h-[36px] leading-[34px] px-[16px] text-white text-[14px] font-[500] text-center"
                onClick={handleMintIBGT}
              >
                Mint iBGT
              </button>
            </div>
            <div className="flex flex-col items-center gap-[7px] text-white text-[14px] font-[500]">
              <div className="">Rewards</div>
              <div className="flex justify-center items-center gap-[7px]">
                <img src={`/images/dapps/infrared/${data?.rewardSymbol?.toLocaleLowerCase() ?? "honey"}.svg`} alt="" className="w-[26px] h-[26px] rounded-full" />
                <div className="text-[20px] font-[600]">0</div>
                <div className="">{data?.rewardSymbol}</div>
              </div>
              <button
                disabled={Big(data?.earned ?? 0).lte(0)}
                style={{
                  opacity: Big(data?.earned ?? 0).lte(0) ? 0.3 : 1,
                }}
                type="button"
                className="border border-[#373A53] rounded-[10px] h-[36px] leading-[34px] px-[16px] text-white text-[14px] font-[500] text-center"
                onClick={handleClaim}
              >
                Claim
              </button>
            </div>
            <div className="absolute w-[1px] h-[37px] bg-[#373A53] left-[50%] top-[23px] translate-x-[-50%]"></div>
          </div>
        </div>
        <div className="px-[10px] mt-[20px]">
          <SwitchTabs
            tabs={[
              { label: tabs[0], value: tabs[0] },
              { label: tabs[1], value: tabs[1] }
            ]}
            onChange={(val, index) => {
              setTIndex(index);
              setTab(val);
            }}
            current={tab}
            className="md:h-[52px] rounded-[10px] bg-[rgba(255,255,255,0.16)!important] border-0"
            cursorClassName="rounded-[10px]"
            tabClassName="text-white"
            renderTabStyle={(_tab) => ({
              color: _tab.value === tab ? 'black' : 'white',
            })}
          />
          <AnimatePresence mode="wait">
            {
              tab === tabs[0] && (
                <IbgtForm
                  key="stake"
                  type="Stake"
                  amount={inAmount}
                  onChange={handleTokenChange}
                  balance={Big(balances[symbol] ?? 0).toFixed(6)}
                  usdValue={inAmount ? '$' + Big(inAmount).times(data?.initialData?.stake_token?.price ?? 0).toFixed(2) : '-'}
                  onSubmit={handleDeposit}
                  onBalance={handleMax}
                  loading={isLoading}
                  btnText="Stake iBGT"
                  isInSufficient={isInSufficient}
                  isTokenApproved={isTokenApproved}
                  isTokenApproving={isTokenApproving}
                  symbol={symbol}
                  handleApprove={handleApprove}
                />
              )
            }
            {
              tab === tabs[1] && (
                <IbgtForm
                  key="Withdraw"
                  type="Withdraw"
                  amount={lpAmount}
                  onChange={handleLPChange}
                  balance={lpBalance}
                  usdValue={lpAmount ? '$' + Big(lpAmount).times(data?.initialData?.stake_token?.price ?? 0).toFixed(2) : '-'}
                  onSubmit={handleWithdraw}
                  onBalance={() => {
                    handleLPChange(lpBalance);
                  }}
                  loading={isLoading}
                  btnText="Withdraw iBGT"
                  isInSufficient={isWithdrawInsufficient}
                  isTokenApproved={true}
                  isTokenApproving={false}
                />
              )
            }
          </AnimatePresence>
        </div>
      </Drawer>
      <Modal
        open={totalVisible}
        onClose={handleTotal}
        isForceNormal={true}
        closeIcon={<></>}
      >
        <div className="w-[200px] border border-black rounded-[20px] bg-[#FFFDEB] p-[19px_10px_26px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="text-black text-[16px] font-[600]">
            <div className="text-[#3D405A] text-[14px] font-[500]">Staked</div>
            <div className="mt-[7px]">
              {formatThousandsSeparator(formatValueDecimal(ibgtData?.staked, '', 2, false, true))} iBGT
            </div>
          </div>
          <div className="w-full h-[1px] bg-[rgba(0,0,0,0.15)] my-[15px]" />
          <div className="text-black text-[16px] font-[600]">
            <div className="text-[#3D405A] text-[14px] font-[500]">Total iBGT</div>
            <div className="mt-[7px]">
              {formatThousandsSeparator(formatValueDecimal(ibgtData?.total, '', 2, false, true))} iBGT
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IBGTMobileView;

interface Props {
  visible: boolean;

  onClose(): void;
}
