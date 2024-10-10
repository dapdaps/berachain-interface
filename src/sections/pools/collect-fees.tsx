'use client';

import BasicModal from './components/modal';
import Kodiak from './kodiak/collect-fees';

const Panel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === 'kodiak') return <Kodiak {...rest} />;
};

export default function CollectFees({
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
      title={`Claim Rewards`}
      dex={dex}
      fee={fee}
      version={version}
      open={open}
      onClose={onClose}
    >
      <div className='pb-[20px]'>
        <Panel
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
