import BasicModal from './components/modal';
import Bex from './bex/add-liquidity';

const AddLiquidityPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === 'bex') return <Bex {...rest} />;
};

export default function AddLiquidityModal({ token0, token1, dex }: any) {
  return (
    <BasicModal title={`Provide ${token0?.symbol}-${token1?.symbol}`} dex={dex}>
      <div className='pb-[20px]'>
        <AddLiquidityPanel
          dex={dex}
          defaultToken0={token0}
          defaultToken1={token1}
        />
      </div>
    </BasicModal>
  );
}
