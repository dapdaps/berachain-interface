import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';
import LendingButton from '@/sections/Lending/components/button';
import TokenSelector from '@/sections/Lending/components/token-selector';
import { useEffect, useState } from 'react';

const CHAIN_ID = 80084;

const PositionAdd = (props: Props) => {
  const { markets } = props;

  const [amount, setAmount] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<any>([]);
  const [tokenSelectVisible, setTokenSelectVisible] = useState<any>(false);
  const [tokenSelected, setTokenSelected] = useState<any>();

  const handleAmountChange = (ev: any) => {
    if (isNaN(Number(ev.target.value))) return;
    setAmount(ev.target.value.replace(/\s+/g, ''));
  };

  const handleSubmit = () => {};

  useEffect(() => {
    let _disabled = false;
    if (!amount || Big(amount).lte(0)) {
      _disabled = true;
    }
    setDisabled(_disabled);
  }, [amount]);

  useEffect(() => {
    const tokenList: any = Object.values(markets || {});
    setTokens(tokenList);
    setTokenSelected(tokenList[0] || undefined);
  }, [markets]);

  return (
    <div className="mt-[60px] mb-[30px]">
      <div className="bg-[#FFDC50] rounded-[10px] p-[16px_19px]">
        <div className="text-[26px] font-[600]">Open New Borrow Position</div>
        <div className="flex items-center gap-[64px] mt-[17px]">
          Start by adding collateral for the borrow position. You will then be able to borrow against that collateral.
        </div>
      </div>
      <div className="bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[20px_24px] flex-1 mt-[24px]">
        <div className="mt-[17px]">
          <div className="relative w-full h-[72px] leading-[70px]">
            <div
              onClick={() => {
                setTokenSelectVisible(true);
              }}
              className="absolute right-[14px] top-[50%] translate-y-[-50%] w-[176px] h-[46px] flex justify-between items-center rounded-[8px] border border-[#373A53] bg-[#FFFDEB] p-[10px_14px_10px_7px]"
            >
              <div className="flex items-center gap-[8px]">
                <img src={tokenSelected?.icon} alt="" className="w-[26px] h-[26px] rounded-full border-0" />
                <div className="leading-none">
                  <div className="text-[16px] font-[600] text-black">{tokenSelected?.symbol}</div>
                  <div className="text-[12px] text-[#3D405A] font-[500] mt-[3px]">{tokenSelected?.name}</div>
                </div>
              </div>
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 5L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full h-full border border-[#373A53] bg-white rounded-[12px] text-[26px] font-[700] pl-[20px] pr-[200px]"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          <div className="flex justify-end items-center py-[12px]">
            <div className="text-[#3D405A] text-[12px] font-[500]">
              balance:&nbsp;
              <span
                className="underline"
                onClick={() => {
                  handleAmountChange({ target: { value: Big(tokenSelected?.balance).toFixed(tokenSelected?.decimals, 0) } });
                }}
              >
                  {numberFormatter(tokenSelected?.balance, 4, true)}
                </span>
            </div>
          </div>
          <LendingButton
            type="primary"
            disabled={disabled}
            loading={loading}
            style={{ height: 60, marginTop: 12, width: '100%' }}
            amount={amount}
            token={tokenSelected}
            chain={{ chainId: CHAIN_ID }}
            spender=""
            onClick={handleSubmit}
            isSkipApproved={true}
          >
            Add Position
          </LendingButton>
        </div>
      </div>
      <TokenSelector
        visible={tokenSelectVisible}
        selected={tokenSelected}
        tokens={tokens}
        onClose={() => {
          setTokenSelectVisible(false);
        }}
        onSelect={(token: any) => {
          setTokenSelected(token);
        }}
      />
    </div>
  );
};

export default PositionAdd;

interface Props {
  markets: any;
}
