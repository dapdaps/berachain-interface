'use client';

import BasicModal from './components/modal';
import Bex from './bex/remove-liquidity';
import Kodiak from './kodiak/remove-liquidity';

const RemoveLiquidityPanel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === 'bex') return <Bex {...rest} />;
  if (dex?.toLowerCase() === 'kodiak') return <Kodiak {...rest} />;
};

export default function RemoveLiquidityModal({
  token0,
  token1,
  version,
  dex,
  fee,
  tokenId,
  open,
  onClose
}: any) {
  return (
    <BasicModal
      title={`Remove ${token0?.symbol}-${token1?.symbol}`}
      dex={dex}
      fee={fee}
      version={version}
      open={open}
      onClose={onClose}
    >
      <div className='pb-[20px]'>
        <RemoveLiquidityPanel
          dex={dex}
          token0={token0}
          token1={token1}
          fee={fee}
          version={version}
          tokenId={tokenId}
          onSuccess={onClose}
        />
      </div>
    </BasicModal>
  );
}
