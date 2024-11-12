import { useState, forwardRef, useMemo, useImperativeHandle } from "react";
import Loading from "@/components/circle-loading";
import AddButton from "../../components/button/increase-button";
import useIncrease from "../../hooks/use-add-v3";
import DepositAmounts from "../../components/deposit-amounts/v3";
import SelectedRange from "../../components/selected-range";
import TokenSwitcher from "../../components/token-switcher";
import useData from "../../hooks/use-detail-v3";
import kodiak from "@/configs/pools/kodiak";
import { sortTokens } from "../../utils";

export default forwardRef(function Add(
  {
    onSuccess,
    tokenSelectable,
    defaultToken0,
    defaultToken1,
    defaultFee: fee,
    tokenId
  }: any,
  ref
) {
  const [value0, setValue0] = useState("");
  const [value1, setValue1] = useState("");
  const [token0, setToken0] = useState(defaultToken0);
  const [token1, setToken1] = useState(defaultToken1);
  const [errorTips, setErrorTips] = useState("");

  const onExchangeTokens = () => {
    const [_token1, _token0] = [token0, token1];
    setToken0(_token0);
    setToken1(_token1);
  };

  const { info, loading } = useData({
    token0,
    token1,
    fee,
    tokenId,
    dex: kodiak
  });

  const reverse = useMemo(() => {
    if (!token0 || !token1) return false;
    const [_token0] = sortTokens(token0, token1);

    return _token0.address === token1.address;
  }, [token0, token1]);

  const { loading: adding, onIncrease } = useIncrease({
    token0: defaultToken0,
    token1: defaultToken1,
    value0,
    value1,
    fee,
    noPair: false,
    currentPrice: info?.currentTick,
    lowerPrice: info?.lowerPrice,
    upperPrice: info?.upperPrice,
    info,
    dex: kodiak,
    onSuccess() {
      onSuccess?.();
    }
  });

  return (
    <>
      {loading ? (
        <div className="h-[300px] flex justify-center items-center">
          <Loading size={30} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-[16px] font-semibold">Selected Range</div>
            {token0 && token1 && (
              <TokenSwitcher
                token0={token0}
                token1={token1}
                reverse={!reverse}
                onExchangeTokens={onExchangeTokens}
              />
            )}
          </div>
          <SelectedRange
            from="increase"
            token0={token0}
            token1={token1}
            lowerPrice={info?.lowerPrice}
            upperPrice={info?.upperPrice}
            currentPrice={info?.currentPrice}
            isFullRange={info?.rangeType === 3}
          />
        </>
      )}
      <div className="h-[20px]" />
      <DepositAmounts
        label="Deposit amounts"
        token0={defaultToken0}
        token1={defaultToken1}
        value0={value0}
        value1={value1}
        setValue0={setValue0}
        setValue1={setValue1}
        lowerPrice={info?.lowerPrice}
        upperPrice={info?.upperPrice}
        currentPrice={info?.currentPrice}
        rangeType={info?.rangeType}
        onError={(tips: string) => {
          setErrorTips(tips);
        }}
      />
      <AddButton
        text="Increase Liquidity"
        errorTips={errorTips}
        loading={loading || adding}
        onClick={() => {
          onIncrease();
        }}
        value0={value0}
        value1={value1}
        token0={defaultToken0}
        token1={defaultToken1}
        spender={info?.positionManager}
      />
    </>
  );
});
