import BasicModal from './components/modal';
import Bex from './bex/remove-liquidity';

const RemoveLiquidityPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === 'bex') return <Bex {...rest} />;
};

export default function RemoveLiquidityModal({ token0, token1, dex }: any) {
  return (
    <BasicModal title={`Remove ${token0?.symbol}-${token1?.symbol}`} dex={dex}>
      <div className='pb-[20px]'>
        <RemoveLiquidityPanel dex={dex} token0={token0} token1={token1} />
      </div>
    </BasicModal>
  );
}