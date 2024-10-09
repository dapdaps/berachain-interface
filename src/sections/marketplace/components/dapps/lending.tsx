import DappModal from '@/sections/marketplace/components/dapps/modal';
import { useContext, useState } from 'react';
import { MarketplaceContext } from '@/sections/marketplace/context';
import SwitchTabs from '@/components/switch-tabs';
import LendingButton from '@/sections/Lending/components/button';
import { useProvider } from '@/hooks/use-provider';
import Link from 'next/link';
import { useHandler } from '@/sections/Lending/hooks/use-handler';

const TABS = [
  {
    value: 'Deposit',
    label: 'Supply',
    disabled: false,
  },
  {
    value: 'Withdraw',
    label: 'Withdraw',
    disabled: false,
  },
];

const Lending = (props: Props) => {
  const {} = props;
  const { lendingVisible, setLendingVisible } = useContext(MarketplaceContext);

  const balance = '0';

  const { provider } = useProvider();
  const {
    amount,
    disabled,
    loading,
    txData,
    isMax,
    setLoading,
    setTxData,
    handleAmount,
    handleBalance,
  } = useHandler({ balance: balance });

  const [currentTab, setCurrentTab] = useState(TABS[0].value);

  const handleClose = () => {
    setLendingVisible(false);
  };

  return (
    <DappModal
      title="Invest HONEY"
      type="Lending"
      visible={lendingVisible}
      onClose={handleClose}
    >
      <div className="mt-[40px]">
        <SwitchTabs
          tabs={TABS}
          current={currentTab}
          onChange={(current) => {
            setCurrentTab(current);
          }}
        />
        <div className="flex justify-between items-start mt-[33px]">
          <div className="flex flex-col gap-[14px]">
            <div className="text-[16px] font-[500] leading-[100%]">
              Earn APY
            </div>
            <div className="text-[20px] font-[700] leading-[normal]">
              0.87%
            </div>
          </div>
          <div className="flex flex-col gap-[14px] pr-[62px]">
            <div className="text-[16px] font-[500] leading-[100%]">
              Earn APY
            </div>
            <div className="text-[20px] font-[700] leading-[normal] flex items-center gap-[3px]">
              <img src="/assets/tokens/bera.svg" alt="" width={30} height={30} className="rounded-full" />
              <span className="ml-[3px]">0</span>
              <span className="font-[500] text-[0.7em]">HONEY</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-[14px] font-[500] mt-[38px]">
          <span className="pl-[5px]">Deposit</span>
          <span className="whitespace-nowrap pr-[13px]">
            Balance: <span className="underline decoration-solid" onClick={handleBalance}>{balance}</span>
          </span>
        </div>
        <div className="mt-[12px] relative">
          <input
            type="text"
            className="w-full rounded-[12px] border border-[#373A53] bg-white h-[72px] leading-[70px] pr-[200px] pl-[17px] text-[26px] font-[700]"
            placeholder="0"
            value={amount}
            onChange={handleAmount}
          />
          <div className="absolute flex items-center gap-[8px] right-[16px] top-[50%] translate-y-[-50%]">
            <img src="/assets/tokens/bera.svg" alt="" width={30} height={30} className="rounded-full" />
            <span className="font-[600] text-[16px] whitespace-nowrap">HONEY</span>
          </div>
        </div>
        <div className="mt-[18px]">
          <LendingButton
            type="primary"
            disabled={disabled}
            loading={loading}
            style={{ height: 60, width: '100%' }}
            amount={'0'}
            token={{} as any}
            chain={{ chainId: 80084 }}
            spender=""
            isSkipApproved={false}
            provider={provider}
            unsignedTx={txData?.unsignedTx}
            gas={txData?.gas}
            config={{}}
            onApprovedSuccess={() => {
            }}
            onSuccess={() => {
            }}
          >
            {currentTab}
          </LendingButton>
        </div>
        <div className="mt-[16px] flex justify-center items-center text-[14px] text-[#979ABE] font-[400] gap-[4px]">
          <span>Manage exist assets on</span>
          <Link className="text-black underline decoration-solid" href="javascript: void(0);">Bend</Link>
        </div>
      </div>
    </DappModal>
  );
};

export default Lending;

interface Props {
}
