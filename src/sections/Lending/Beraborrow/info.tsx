import Button from '@/components/button';
import Health, { Status } from '@/sections/Lending/Beraborrow/health';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import { useEffect, useMemo, useRef, useState } from 'react';
import Big from 'big.js';
import { ActionText } from '@/sections/Lending/hooks/use-beraborrow';

const Info = (props: any) => {
  const { market = {}, riskyRatio, newValue, type, onClose, loading, style } = props;

  const rangeRef = useRef<any>(null);
  const [riskPosition, setRiskPosition] = useState(0);

  const calcRiskPosition = () => {
    if (!rangeRef.current) return 0;
    const width = parseFloat(getComputedStyle(rangeRef.current).width);
    if (!riskyRatio || !market.collateralRatio) return width / 2;
    let p: any = Big(100).div(Big(riskyRatio).times(2)).times(market.collateralRatio).toNumber();
    p = Math.max(0, Math.min(100, p));
    return Big(p).div(100).times(width).toNumber();
  };

  useEffect(() => {
    const _risk = calcRiskPosition();
    setRiskPosition(_risk);
  }, [market]);

  return (
    <div style={style} className="bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[20px_24px] flex-1 flex flex-col items-stretch gap-[5px]">
      {/*<Item label="Vault APY" value={market.apyShown} />*/}
      <Item label="Interest Rate" value={market.interestRateShown} />
      <Item label={`${market.collToken.symbol} value`} value={market.balanceUsdShown} newValue={newValue?.balanceUsdShown} />
      <Item label={`${market.collToken.symbol} amount`} value={market.balanceShown} newValue={newValue?.balanceShown} />
      <Item label="NECT borrowed" value={market.borrowedShown} newValue={newValue?.borrowedShown} />
      {
        (market.balance && Big(market.balance).gt(0) || (newValue?.liquidationPrice && Big(newValue?.liquidationPrice || 0).gt(0))) && (
          <Item label="Liquidation Price" value={market.liquidationPriceShown} newValue={newValue?.liquidationPriceShown} />
        )
      }
      <Item label="Current Price" value={market.priceShown} />
      <Item
        label="Collateral Ratio"
        empty={!market.collateralRatio || Big(market.collateralRatio).lte(0)}
        value={market.collateralRatioShown + ' - ' + Status[market.collateralRatioRisk].name}
        note="The ratio of your collateral's value to your NECT debt. It's vital to maintain this ratio above the minimum threshold to avoid liquidations."
        risk={Status[market.collateralRatioRisk]}
      />
      <Item
        label="MCR"
        value={(
          <div style={{ color: `rgb(${Status.HighRisk.color})` }}>{market.MCR}%</div>
        )}
        note={(
          <div className="">
            <div className="text-[16px] font-[500]">
              Minimum Collateral Ratio
            </div>
            <div className="mt-[5px]">
              It is the collateral ratio by which you can have greatest capital efficiency, but you risk redemptions and sudden collateral price volatility can trigger liquidations against your Den.
            </div>
          </div>
        )}
      />
      <Item
        label="CCR"
        value={(
          <div style={{ color: `rgb(${Status.MidRisk.color})` }}>{market.CCR}%</div>
        )}
        note={(
          <div className="">
            <div className="text-[16px] font-[500]">
              Critical Collateral Ratio
            </div>
            <div className="mt-[5px]">
              The system enters Recovery Mode when this value is greater than or equal to the TCR.
            </div>
          </div>
        )}
      />
      <Item
        label="TCR"
        value={(
          <div style={{ color: `rgb(${Status.LowRisk.color})` }}>{market.TCR}%</div>
        )}
        note={(
          <div className="">
            <div className="text-[16px] font-[500]">
              Total Collateral Ratio
            </div>
            <div className="mt-[5px]">
              Refers to the proportion of the total value of all collaterals in the Den Manager, at their present prices, to the total outstanding debt in the DenManager.
            </div>
          </div>
        )}
      />
      {/*<div
        ref={rangeRef}
        className="w-full h-[10px] rounded-[4px] relative bg-gradient-to-r from-red-500 to-green-500 my-[10px]"
        style={{ backgroundImage: 'linear-gradient(to right,var(--tw-gradient-stops))' }}
      >
        <motion.div
          className="absolute z-[1] left-0 top-[-5px] w-[8px] rounded-[4px] h-[20px] bg-[#FFDC50]"
          animate={{
            x: riskPosition
          }}
        />
        <div className="text-green-500 text-[12px] font-[400] absolute right-0 bottom-[-24px]">Low Risk</div>
        <div className="text-red-500 text-[12px] font-[400] absolute left-0 bottom-[-24px]">High Risk</div>
      </div>*/}
      {
        type === ActionText.Repay && market.status === 'open' && (
          <div className="w-full mt-[20px]">
            <Button
              type="default"
              className="w-full h-[60px]"
              onClick={onClose}
              loading={loading}
              disabled={loading}
            >
              Close Position
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default Info;

export function Item(props: any) {
  const { label, value, newValue, note, risk, empty } = props;

  const isCollateralRatio = label === 'Collateral Ratio';

  return (
    <div className="flex justify-between items-center gap-[10px] w-full text-[14px] text-black font-[500]">
      <div className="text-[#3D405A] flex items-center gap-[5px]">
        {
          note && (
            <Popover
              trigger={PopoverTrigger.Hover}
              placement={PopoverPlacement.Top}
              contentStyle={{ zIndex: 200 }}
              content={(
                <Card className="w-[300px] text-[14px]">
                  {note}
                </Card>
              )}
            >
              <img src="/images/icon-tips.svg" alt="" className="w-[18px] h-[18px] cursor-pointer" />
            </Popover>
          )
        }
        <div className="">{label}</div>
      </div>
      {
        isCollateralRatio && (
          empty ? '-' : (
            <Health risk={risk}>
              {value}
            </Health>
          )
        )
      }
      {
        !isCollateralRatio && (
          <div className="flex items-center gap-[5px]">
            <div className={`${!!newValue && newValue !== '0' ? 'text-[#3D405A]' : ''}`}>{value}</div>
            {
              !!newValue && newValue !== '0' && (
                <>
                  <img src="/images/icon-arrow.svg" alt="" className="w-[10px] -rotate-90" />
                  <div className="">{newValue}</div>
                </>
              )
            }
          </div>
        )
      }
    </div>
  );
}
