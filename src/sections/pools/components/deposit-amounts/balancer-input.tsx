import Big from "big.js";
import { memo, useEffect, useMemo, useState } from "react";
import Loading from "@/components/circle-loading";
import useTokenBalance from "@/hooks/use-token-balance";
import { balanceFormated, valueFormated } from "@/utils/balance";
import TokenSelector from "@/sections/swap/TokenSelector";
import chains from "@/configs/chains";
import useCustomAccount from "@/hooks/use-account";

import {
  StyledBalance,
  StyledIcon,
  StyledInput,
  StyledInputInner,
  StyledInputTokenBox,
  StyledSymbol,
  StyledToken
} from "./styles";
import weth from "@/configs/contract/weth";
import { DEFAULT_CHAIN_ID } from "@/configs";
import clsx from "clsx";
import { bera } from "@/configs/tokens/bera";
import LazyImage from '@/components/layz-image';

const Input = ({
  token,
  setValue: onChangeValue,
  value: defaultValue,
  prices,
  disabled,
  className,
  onError,
  onSelectToken
}: any) => {
  const [value, setValue] = useState(defaultValue);
  const { account, chainId } = useCustomAccount();
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const { tokenBalance: balance, isLoading } = useTokenBalance(
    token?.isNative ? "native" : token?.address,
    token?.decimals
  );
  const isError = useMemo(() => {
    if (!value || !token || value === "NaN") return false;

    if (!balance) return false;

    return new Big(value || 0).gt(balance);
  }, [value, balance]);

  const showSelector = useMemo(
    () => token.isNative || token.address === weth[DEFAULT_CHAIN_ID],
    [token]
  );

  useEffect(() => {
    onError(isError);
  }, [isError]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <StyledInput $error={isError} className={className}>
        <StyledInputTokenBox>
          <div className="grow">
            <StyledInputInner
              placeholder="0"
              value={value}
              onChange={(ev) => {
                if (isNaN(Number(ev.target.value))) return;
                onChangeValue(ev.target.value);
                setValue(ev.target.value);
              }}
              disabled={disabled}
            />
          </div>
          <StyledToken
            className={clsx(
              "shrink-0 px-[7px] cursor-pointer justify-between border-[#000] rounded-[8px] h-[38px]",
              showSelector ? "border bg-[#FFFDEB]" : ""
            )}
            onClick={() => {
              showSelector && setShowTokenSelector(true);
            }}
          >
            <LazyImage
              src={token?.icon}
              fallbackSrc="/assets/tokens/default_icon.png"
              containerClassName="!w-[26px] !h-[26px] !shrink-0 !rounded-full !overflow-hidden"
            />
            <StyledSymbol>{token.symbol}</StyledSymbol>
            {showSelector && (
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 5L11 1"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </StyledToken>
        </StyledInputTokenBox>
        <div className="mt-[4px] flex items-center justify-between text-[#979abe] text-[14px]">
          <div>
            $
            {!isNaN(Number(value)) && prices
              ? valueFormated(value, prices[token?.priceKey || token?.symbol])
              : "-"}
          </div>
          <div className="flex items-center gap-[4px]">
            <div>Balance: </div>
            {isLoading ? (
              <Loading size={16} />
            ) : (
              <StyledBalance
                onClick={() => {
                  if (isNaN(Number(balance))) return;
                  onChangeValue(
                    balanceFormated(new Big(balance).toFixed(18), 18)
                  );
                  setValue(balanceFormated(new Big(balance).toFixed(18), 18));
                }}
                className="cursor-pointer"
              >
                {!balance ? "-" : balanceFormated(balance, 4)}
              </StyledBalance>
            )}
          </div>
        </div>
      </StyledInput>
      <TokenSelector
        display={showTokenSelector}
        tokens={[bera.bera, bera.wbera]}
        chainId={DEFAULT_CHAIN_ID}
        chainIdNotSupport={chainId === DEFAULT_CHAIN_ID}
        account={account}
        explor={chains[DEFAULT_CHAIN_ID].blockExplorers.default.url}
        onClose={() => {
          setShowTokenSelector(false);
        }}
        onSelect={(_token: any) => {
          onSelectToken(_token);
        }}
        showSearch={false}
      />
    </>
  );
};

export default memo(Input);
