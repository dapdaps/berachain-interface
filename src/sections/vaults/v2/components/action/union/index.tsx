import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import ActionSummary from '@/sections/vaults/v2/components/action/union/summary';
import ActionUnionLeft from '@/sections/vaults/v2/components/action/union/left';
import ActionUnionRight from '@/sections/vaults/v2/components/action/union/right';
import AddLiquidityModal from '@/sections/pools/add-liquidity-modal';
import VaultsV2ActionContextProvider from '@/sections/vaults/v2/components/action/context';
import useAction from '@/sections/vaults/v2/hooks/use-action';

const ActionUnion = (props: any) => {
  const { className } = props;

  const { currentProtocol, openAddLp, toggleOpenAddLp } = useVaultsV2Context();

  const action = useAction();
  const { updateBalance } = action;

  return (
    <VaultsV2ActionContextProvider
      value={action}
    >
      <div className={clsx("w-full flex flex-col items-stretch gap-[24px]", className)}>
        <ActionSummary />
        <div className="grid grid-cols-2 gap-[30px]">
          <ActionUnionLeft />
          <ActionUnionRight />
        </div>
        {["Bex", "Kodiak"].includes(currentProtocol.lpProtocol) && (
          <AddLiquidityModal
            dex={currentProtocol.lpProtocol}
            data={currentProtocol}
            open={openAddLp}
            onClose={() => {
              toggleOpenAddLp(false);
            }}
            onSuccess={updateBalance}
          />
        )}
      </div>
    </VaultsV2ActionContextProvider>
  );
};

export default ActionUnion;


