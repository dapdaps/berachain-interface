import Button from '@/components/button';
import Health from '@/sections/Lending/Beraborrow/health';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';

const Info = (props: any) => {
  const { market = {} } = props;

  return (
    <div className="bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[20px_24px] flex-1 flex flex-col items-stretch gap-[5px]">
      <Item label="Vault APY" value={market.apyShown} />
      <Item label="Interest Rate" value={market.interestRateShown} />
      <Item label={`${market.symbol} value`} value={market.balanceUsdShown} newValue="" />
      <Item label={`${market.symbol} amount`} value={market.balanceShown} newValue="" />
      <Item label="NECT borrowed" value={market.borrowedShown} newValue="" />
      <Item label="Liquidation Price" value={market.liquidationPriceShown} newValue="" />
      <Item label="Current Price" value={market.priceShown} />
      <Item label="Collateral Ratio" value="197% - Good" note="The ratio of your collateral's value to your NECT debt. It's vital to maintain this ratio above the minimum threshold to avoid liquidations." />
      <Item
        label="MCR"
        value={market.MCR}
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
        value={market.CCR}
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
        value="-"
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
      <div
        className="w-full h-[10px] rounded-[4px] relative bg-gradient-to-r from-green-500 to-red-500 my-[10px]"
        style={{ backgroundImage: 'linear-gradient(to right,var(--tw-gradient-stops))' }}
      >
        <div className="absolute z-[1] left-0 top-[-5px] w-[8px] rounded-[4px] h-[20px] bg-[#FFDC50]"></div>
        <div className="text-green-500 text-[12px] font-[400] absolute left-0 bottom-[-24px]">Low Risk</div>
        <div className="text-red-500 text-[12px] font-[400] absolute right-0 bottom-[-24px]">High Risk</div>
      </div>
      <div className="w-full mt-[20px]">
        <Button
          type="default"
          className="w-full h-[60px]"
        >
          Close Position
        </Button>
      </div>
    </div>
  );
};

export default Info;

function Item(props: any) {
  const { label, value, newValue, note } = props;

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
          <Health>
            {value}
          </Health>
        )
      }
      {
        !isCollateralRatio && (
          <div className="flex items-center gap-[5px]">
            <div className={`${!!newValue ? 'text-[#3D405A]' : ''}`}>{value}</div>
            {
              !!newValue && (
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
