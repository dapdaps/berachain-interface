import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import StrategyTitle from '@/sections/vaults/v2/components/strategy/title';
import StrategyGroupWithButton from '@/sections/vaults/v2/components/strategy/group-with-button';
import LazyImage from '@/components/layz-image';
import StrategyItem from '@/sections/vaults/v2/components/strategy/item';

const Strategy = (props: any) => {
  const { className } = props;

  const { } = useVaultsV2Context();

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

        <StrategyItem no="1" title="Get Base Tokens" contentClassName="!grid-cols-2">
          <StrategyGroupWithButton buttonText="Get">
            1.23 WBERA
          </StrategyGroupWithButton>
          <StrategyGroupWithButton buttonText="Get">
            0 HONEY
          </StrategyGroupWithButton>
        </StrategyItem>

        <StrategyItem
          no="2"
          title={(
            <>
              Provide Liquidity via <span className="underline underline-offset-2">Bex</span>
            </>
          )}
        >
          <StrategyGroupWithButton buttonText="Add Liquidity">
            0 WBERA-HONEY
          </StrategyGroupWithButton>
        </StrategyItem>

        <StrategyItem no="3" title="Deposit LP token for BGT">
          <StrategyGroupWithButton buttonText="Deposit">
            0 WBERA-HONEY
          </StrategyGroupWithButton>
        </StrategyItem>

        <StrategyItem no="4" title="Boost in Top Validator" isLine={false}>
          <StrategyGroupWithButton buttonText="Boost">
            <LazyImage src="/images/icon-coin.svg" width={25} height={25} containerClassName="shrink-0 rounded-full overflow-hidden" />
            <div className="">Infrared by Luganodes</div>
          </StrategyGroupWithButton>
        </StrategyItem>

      </div>
    </div>
  );
};

export default Strategy;
