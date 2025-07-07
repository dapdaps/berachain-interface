import InputNumber from "@/components/input-number";
import LazyImage from "@/components/layz-image";
import Range from "@/components/range";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import beraborrowConfig from "@/configs/lending/beraborrow";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { usePriceStore } from "@/stores/usePriceStore";
import useCustomAccount from "@/hooks/use-account";

const BeraborrowData = dynamic(() => import('@/sections/Lending/datas/beraborrow'));

const BelongForm = (props: any) => {
  const { } = props;

  const { basic, networks }: any = beraborrowConfig;
  const { markets = [] } = networks?.[DEFAULT_CHAIN_ID + ''] || {};

  const { account, provider, chainId } = useCustomAccount();
  const prices = usePriceStore((store) => store.price);

  const [loading, setLoading] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [totalDebt, setTotalDebt] = useState("");
  const [leverage, setLeverage] = useState(0);
  const [currentMarket, setCurrentMarket] = useState<any>(markets[0]);

  const isChainSupported = useMemo(() => {
    if (!chainId) {
      return false;
    }
    const currChain = networks[chainId];
    return !!currChain;
  }, [chainId]);

  useEffect(() => {
    setLoading(isChainSupported);
  }, [isChainSupported, account]);

  return (
    <div className="w-[500px] mx-auto mt-[20px]">
      <div className="w-full">
        <div className="">
          Deposit collateral
        </div>
        <div className="flex justify-between items-center gap-[10px]">
          <div className="shrink-0 flex items-center gap-[4px]">
            <LazyImage
              src={currentMarket?.icon}
              fallbackSrc="/assets/tokens/default_icon.png"
              alt=""
              containerClassName="!w-[20px] !h-[20px] shrink-0 rounded-full overflow-hidden"
            />
            <div className="">
              {currentMarket?.symbol}
            </div>
            <img src="/images/belong/icon-arrow.svg" alt="" className="w-[12px] h-[12px] shrink-0" />
          </div>
          <InputNumber
            className="flex-1 bg-[#3D405A]"
            value={depositAmount}
            onNumberChange={(value) => setDepositAmount(value)}
          />
        </div>
        <div className="">
          Balance: 0
        </div>
        <div className="flex items-center gap-[2px]">
          <div className="">25%</div>
          <div className="">50%</div>
          <div className="">75%</div>
          <div className="uppercase">max</div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="">
            Liquidation price
          </div>
          <div className="">
            Ratio: 221.4%
          </div>
        </div>
        <div className="flex justify-between items-center gap-[40px]">
          <div className="">
            <Range
              type="range"
              value={leverage}
              onChange={(e: any) => setLeverage(e.target.value)}
              className="!mt-[unset] range-green"
              color="#16a34a"
            />
            <div className="flex items-center gap-[2px]">
              <div className="">
                Leverage:
              </div>
              <div className="">
                2.5x
              </div>
            </div>
          </div>
          <div className="">
            <div className="">$2,800.45</div>
            <div className="flex items-center gap-[2px]">
              <div className="">
                Current:
              </div>
              <div className="">
                $33.54
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="">
            Total debt
          </div>
          <div className="flex items-center gap-[2px]">
            <div className="">
              Exposure:
            </div>
            <div className="">
              1,234.56 iBERA-wgBERA
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-[10px]">
          <input
            type="text"
            value={totalDebt}
            className="flex-1 bg-[#3D405A]"
          />
          <div className="shrink-0">
            iBERA-wgBERA
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center gap-[10px]">
        <div className="flex items-center gap-[2px]">
          <div className="">
            Fee:
          </div>
          <div className="">
            0.00%
          </div>
        </div>
        <div className="flex items-center gap-[2px]">
          <div className="">
            Liquidation risk:
          </div>
          <div className="text-green-600">
            Meduim
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="">
          Transaction details &gt;
        </div>
      </div>
      <div className="w-full">
        <button
          type="button"
          className="w-full bg-green-600 text-black uppercase flex justify-center items-center h-[40px] rounded-[2px]"
        >
          deposit
        </button>
      </div>

      <BeraborrowData
        {...networks[DEFAULT_CHAIN_ID + '']}
        {...basic}
        markets={[currentMarket]}
        chainId={chainId}
        prices={prices}
        update={loading}
        account={account}
        provider={provider}
        onLoad={(res: any) => {
          console.log('Beraborrow data res: %o', res);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default BelongForm;
