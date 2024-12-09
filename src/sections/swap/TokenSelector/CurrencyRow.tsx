import styled from "styled-components";

import Loading from '@/components/circle-loading';
import { balanceFormated } from '@/utils/balance';
import useToast from '@/hooks/use-toast';

const StyledCurrencyRow = styled.div`
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;

  &:hover {
    background-color: rgba(151, 154, 190, 0.1);
  }

  &.active {
    background-color: var(--dex-hover-bg-color);
    pointer-events: none;
    opacity: 0.8;
  }
`;

const checkIcon = (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5L6 10L15 1"
      stroke="currentColor"
      stroke-width="2"
      strokeLinecap="round"
    />
  </svg>
);

const CurrencyLabel = styled.div`
  display: flex;
  align-items: center;
`;
const CurrencySymbol = styled.div`
  font-size: 16px;
  font-weight: 600;
`;
const CurrencyIcon = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  margin-right: 8px;
`;
const CurrencyAmount = styled.div`
  font-size: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export default function CurrencyRow({
  currency,
  selectedTokenAddress,
  onClick,
  balance,
  loading
}: any) {
  const isActive = currency.address === selectedTokenAddress;

  const toast = useToast();

  const handleCopyAddress = (currency: any) => {
    window?.navigator?.clipboard?.writeText?.(currency.address as string);
    toast.success({
      title: `Copied ${currency.symbol} address ${currency.address}`,
    });
  };

  return (
    <StyledCurrencyRow
      className={`${isActive ? "active" : ""} cursor-pointer`}
      onClick={onClick}
    >
      <CurrencyLabel>
        <CurrencyIcon
          src={
            currency.icon || currency.logo || "/images/tokens/default_icon.png"
          }
        />
        <div>
          <CurrencySymbol>{currency.symbol}</CurrencySymbol>
          <div className='text-[10px] flex items-center gap-[12px]'>
            <div className="">{currency.name}</div>
            {
              currency.address !== 'native' && (
                <div className="text-[#3D405A] flex items-center gap-[10px] pointer-events-auto opacity-100">
                  <div className="">
                    {currency.address ? `${currency.address.slice(0, 6)}...${currency.address.slice(-4)}` : ''}
                  </div>
                  <button
                    type='button'
                    className="w-[14px] h-[14px] bg-[url('/images/icon-copy.svg')] bg-no-repeat bg-center bg-contain"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAddress(currency);
                    }}
                  />
                </div>
              )
            }
          </div>
        </div>
      </CurrencyLabel>
      <CurrencyAmount>
        {loading ? (
          <Loading />
        ) : (
          <>
            {balanceFormated(balance)}
            {isActive ? checkIcon : <div style={{ width: 16 }} />}
          </>
        )}
      </CurrencyAmount>
    </StyledCurrencyRow>
  );
}
