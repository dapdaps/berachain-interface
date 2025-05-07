import React, { useImperativeHandle } from 'react';
import BerapawApprove from '@/sections/vaults/v2/components/action/union/berapaw/approve';
import BerapawMintRewards from '@/sections/vaults/v2/components/action/union/berapaw/mint';
import Big from 'big.js';
import { useAction } from '@/sections/vaults/v2/components/action/union/berapaw/use-action';

const Berapaw = (props: any, ref: any) => {
  const { className, approveClassName, mintClassName, currentProtocol, onClose } = props;

  const rewardVault = currentProtocol.linkVault.vault_address;

  const handleClose = () => new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      onClose?.();
      resolve(true);
    }, 1500);
  });

  const {
    onApprove,
    approving,
    approved,
    approvedLoading,
    estimateMintLBGT,
    estimateMintLBGTLoading,
    getEstimateMintLBGT,
    onMint,
    minting,
    mintResult,
  } = useAction({
    rewardVault,
  });

  const refs = {
    getEstimateMintLBGT,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className={className}>
      <BerapawApprove
        className={approveClassName}
        onApprove={onApprove}
        approving={approving || estimateMintLBGTLoading}
        approved={approved}
        approvedLoading={approvedLoading}
        disabled={!estimateMintLBGT || Big(estimateMintLBGT).lte(0)}
      />
      <BerapawMintRewards
        className={mintClassName}
        onMint={async () => {
          const mintRes = await onMint();
          if (mintRes?.success) {
            handleClose();
          }
        }}
        minting={minting}
        approved={approved}
        estimateMintLBGT={estimateMintLBGT}
      />
    </div>
  );
};

export default React.forwardRef(Berapaw);
