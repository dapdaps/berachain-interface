import useToast from '@/hooks/use-toast';
import useCustomAccount from '@/hooks/use-account';
import React, { useImperativeHandle, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Contract, ethers } from 'ethers';
import BerapawApprove from '@/sections/vaults/v2/components/action/union/berapaw/approve';
import BerapawMintRewards from '@/sections/vaults/v2/components/action/union/berapaw/mint';
import {
  BERAPAW_APPROVE_ABI,
  BERAPAW_MINT_ABI,
  BERAPAW_VAULT_ABI
} from '@/sections/vaults/v2/components/action/union/berapaw/abi';
import { BERAPAW_MINT_ADDRESS } from '@/sections/vaults/v2/components/action/union/berapaw/config';
import { getEstimateGas } from '@/sections/vaults/v2/components/action/union/berapaw/utils';
import Big from 'big.js';

const Berapaw = (props: any, ref: any) => {
  const { className, approveClassName, mintClassName, currentProtocol, onClose } = props;

  const rewardVault = currentProtocol.linkVault.vault_address;

  const toast = useToast();
  const { account, provider } = useCustomAccount();

  const signer = useMemo(() => {
    return provider?.getSigner(account);
  }, [provider, account]);

  const handleClose = () => new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      onClose?.();
      resolve(true);
    }, 1500);
  });

  const { runAsync: onApprove, loading: approving, data: checkApproved } = useRequest(async () => {
    if (!account || !provider || !rewardVault) return;
    const approveContract = new Contract(rewardVault, BERAPAW_APPROVE_ABI, signer);
    const params = [BERAPAW_MINT_ADDRESS];
    let error: any;
    try {
      const options = await getEstimateGas(approveContract, "setOperator", params);
      const tx = await approveContract.setOperator(...params, options);
      const res = await tx.wait();
      if (res.status === 1) {
        toast.success({
          title: 'Approve successful!'
        });
        return true;
      }
      error = res;
    } catch (err: any) {
      error = err;
    }
    toast.fail({
      title: "Approve Failed!",
      text: error?.message?.includes("user rejected transaction")
        ? "User rejected transaction"
        : ""
    });
    return false;
  }, {
    manual: true,
  });

  const { data: approved, loading: approvedLoading } = useRequest(async () => {
    if (!account || !provider || !rewardVault) return false;
    const approveContract = new Contract(rewardVault, BERAPAW_APPROVE_ABI, signer);
    const params = [account];
    let error: any;
    try {
      const res = await approveContract.callStatic.operator(...params);
      if (res === BERAPAW_MINT_ADDRESS) {
        return true;
      }
      error = res;
    } catch (err: any) {
      error = err;
    }
    console.log('check operator failed: %o', error);
    return false;
  }, {
    refreshDeps: [account, signer, checkApproved, rewardVault],
  });

  const { data: estimateMintLBGT, loading: estimateMintLBGTLoading, runAsync: getEstimateMintLBGT } = useRequest(async () => {
    if (!account || !provider || !rewardVault) return;
    let percentual = "0";
    try {
      const mintContract = new Contract(BERAPAW_MINT_ADDRESS, BERAPAW_MINT_ABI, signer);
      const params = [
        rewardVault,
      ];
      const options = await getEstimateGas(mintContract, "bribeBack", params);
      const bribeBackRes = await mintContract.bribeBack(...params, options);
      percentual = ethers.utils.formatUnits(bribeBackRes?.percentual || "0", 18);
    } catch (err: any) {
      console.log("get BribeBack Percentual failed: %o", err);
    }
    const vaultContract = new Contract(rewardVault, BERAPAW_VAULT_ABI, signer);
    const params = [
      account,
    ];
    try {
      const options = await getEstimateGas(vaultContract, "earned", params);
      const estimateMintLBGT = await vaultContract.callStatic.earned(...params, options);
      const earnedAmount = ethers.utils.formatUnits(estimateMintLBGT || "0", 18);
      return Big(earnedAmount).times(Big(1).minus(percentual)).toFixed(18);
    } catch (err: any) {
      console.log("get estimate Mint LBGT failed: %o", err);
      return "0";
    }
  }, { refreshDeps: [account, signer, rewardVault] });

  const { runAsync: onMint, loading: minting, data: mintResult } = useRequest(async () => {
    if (!account || !provider || !rewardVault) return;
    const mintContract = new Contract(BERAPAW_MINT_ADDRESS, BERAPAW_MINT_ABI, signer);
    const params = [
      account,
      rewardVault,
      account
    ];
    let error: any;
    try {
      const options = await getEstimateGas(mintContract, "mint", params);
      const tx = await mintContract.mint(...params, options);
      const res = await tx.wait();
      if (res.status === 1) {
        toast.success({
          title: 'Mint successful!'
        });
        await handleClose();
        return { success: true, minted: res };
      }
      error = res;
    } catch (err: any) {
      error = err;
    }
    toast.fail({
      title: "Mint Failed!",
      text: error?.message?.includes("user rejected transaction")
        ? "User rejected transaction"
        : ""
    });
    return { success: false, minted: null };
  }, { manual: true });

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
        onMint={onMint}
        minting={minting}
        approved={approved}
        estimateMintLBGT={estimateMintLBGT}
        disabled={!estimateMintLBGT || Big(estimateMintLBGT).lte(0)}
      />
    </div>
  );
};

export default React.forwardRef(Berapaw);
