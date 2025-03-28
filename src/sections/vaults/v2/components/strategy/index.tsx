import clsx from "clsx";
import StrategyGroupWithButton from "@/sections/vaults/v2/components/strategy/group-with-button";
import LazyImage from "@/components/layz-image";
import StrategyItem from "@/sections/vaults/v2/components/strategy/item";
import { StrategyPool } from "../../config";
import SwapModal from "@/sections/swap/SwapModal";
import AddLiquidityModal from "@/sections/pools/add-liquidity-modal";
import useTokenBalance from "@/hooks/use-token-balance";
import { useEffect, useRef, useState } from "react";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import useValidator from "@/hooks/use-validator";
import { numberFormatter } from "@/utils/number-formatter";
import Delegate from "@/sections/bgt/components/delegate";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";

import Big from "big.js";

const DefaultValidatorId =
  "0x482a2049a2ca55eb9b4dd5818fea5f9aafcf1fc73494d6834771f505cfa35a0f";

const Strategy = (props: any) => {
  const { className } = props;
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [openAddLp, setOpenAddLp] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const swapTokenIndex = useRef(0);

  const { tokenBalance: token0Balance, update: updateToken0 } = useTokenBalance(
    StrategyPool.tokens[0].address,
    StrategyPool.tokens[0].decimals
  );

  const { tokenBalance: token1Balance, update: updateToken1 } = useTokenBalance(
    StrategyPool.tokens[1].address,
    StrategyPool.tokens[1].decimals
  );

  const { tokenBalance: lpTokenBalance, update: updateLpToken } =
    useTokenBalance(StrategyPool.token.address, StrategyPool.token.decimals);

  const { toggleActionVisible } = useVaultsV2Context();

  const { loading: validatorLoading, pageData, getPageData } = useValidator();

  useEffect(() => {
    getPageData(DefaultValidatorId);
  }, []);

  return (
    <div
      className={clsx(
        "text-black font-Montserrat text-[18px] font-semibold leading-[90%]",
        className
      )}
    >
      <div className="border-b border-b-[rgba(0,0,0,0.2)] p-[24px_0_20px_24px]">
        Strategy
      </div>
      <div className="p-[20px_23px_5px_24px] flex flex-col">
        <StrategyItem
          no="1"
          title="Get Base Tokens"
          contentClassName="!grid-cols-2"
        >
          <StrategyGroupWithButton
            buttonText="Get"
            onClick={() => {
              swapTokenIndex.current = 0;
              setShowSwapModal(true);
            }}
          >
            {numberFormatter(token0Balance, 2, true)}{" "}
            {StrategyPool.tokens[0].symbol}
          </StrategyGroupWithButton>
          <StrategyGroupWithButton
            buttonText="Get"
            onClick={() => {
              swapTokenIndex.current = 1;
              setShowSwapModal(true);
            }}
          >
            {numberFormatter(token1Balance, 2, true)}{" "}
            {StrategyPool.tokens[1].symbol}
          </StrategyGroupWithButton>
        </StrategyItem>

        <StrategyItem
          no="2"
          title={
            <>
              Provide Liquidity via{" "}
              <span className="underline underline-offset-2">Bex</span>
            </>
          }
        >
          <StrategyGroupWithButton
            buttonText="Add Liquidity"
            disabled={
              Big(token0Balance || 0).eq(0) || Big(token1Balance || 0).eq(0)
            }
            onClick={() => {
              setOpenAddLp(true);
            }}
          >
            {numberFormatter(lpTokenBalance, 2, true)}{" "}
            {StrategyPool.token.symbol}
          </StrategyGroupWithButton>
        </StrategyItem>

        <StrategyItem no="3" title="Deposit LP token for BGT">
          <StrategyGroupWithButton
            buttonText="Deposit"
            disabled={Big(lpTokenBalance || 0).eq(0)}
            onClick={() => {
              toggleActionVisible({
                type: ACTION_TYPE.DEPOSIT,
                record: StrategyPool,
                visible: true
              });
            }}
          >
            {numberFormatter(lpTokenBalance, 2, true)}{" "}
            {StrategyPool.token.symbol}
          </StrategyGroupWithButton>
        </StrategyItem>

        <StrategyItem no="4" title="Boost in Top Validator" isLine={false}>
          <StrategyGroupWithButton
            buttonText="Boost"
            loading={validatorLoading}
            onClick={() => {
              setShowBoostModal(true);
            }}
          >
            <LazyImage
              src="https://res.cloudinary.com/duv0g402y/image/upload/c_thumb,w_200,g_face/v1739968715/src/validators/mainnet/mzekeibmcpshwx0tqbyj.png"
              width={25}
              height={25}
              containerClassName="shrink-0 rounded-full overflow-hidden"
              fallbackSrc="/assets/tokens/default_icon.png"
            />
            <div className="">Infrared by Luganodes</div>
          </StrategyGroupWithButton>
        </StrategyItem>
      </div>
      <SwapModal
        defaultOutputCurrency={StrategyPool.tokens[swapTokenIndex.current]}
        outputCurrencyReadonly={true}
        show={showSwapModal}
        onClose={() => {
          setShowSwapModal(false);
        }}
        onSuccess={() => {
          setShowSwapModal(false);
          if (swapTokenIndex.current === 0) {
            updateToken0();
          } else {
            updateToken1();
          }
        }}
      />
      <AddLiquidityModal
        dex="Bex"
        data={StrategyPool}
        open={openAddLp}
        onClose={() => {
          setOpenAddLp(false);
        }}
        onSuccess={() => {
          updateLpToken();
          setOpenAddLp(false);
        }}
      />
      <Delegate
        visible={showBoostModal}
        validator={pageData as any}
        operationType="delegate"
        onClose={() => {
          setShowBoostModal(false);
        }}
        onValidatorSelect={(value: any) => {
          getPageData(value);
        }}
      />
    </div>
  );
};

export default Strategy;
