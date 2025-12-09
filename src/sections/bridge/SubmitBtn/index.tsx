import Loading from "@/components/loading";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useSwitchChain, useConnect } from "wagmi";
import Big from "big.js";
import useToast from "@/hooks/use-toast";
import { useOneclickWallet } from "../lib/bridges/oneclick/wallet";
import { useRequest } from "ahooks";
import { useMemo } from "react";
import { ZeroAddress } from "@/hooks/use-add-action";

const cls = 'w-full h-[60px] flex items-center justify-center border border-[#000000] rounded-[10px] bg-[#FFDC50] text-[18px] font-[600] mt-[16px] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'

export default function SubmitBtn(props: any) {
  const { comingSoon, onClick, isLoading, disabled, fromChainId, text, fromToken, selectedRoute, amount } = props;
  const { switchChain } = useSwitchChain()
  const { address, chainId } = useAccount()
  const { openConnectModal } = useConnectModal();
  const wallet = useOneclickWallet();
  const toast = useToast();

  const { runAsync: onApprove, loading: approving } = useRequest(async (params: any) => {
    const res = await wallet.approve(params);
    checkAllowance();
    toast.success({
      title: "Approve Successful!",
    });
    return res;
  }, {
    manual: true,
  });

  const [approveSpender, isNeedApprove] = useMemo(() => {
    const _approveSpender = selectedRoute?.quote?.approveSpender;
    const _isNeedApprove = ["Oneclick"].includes(selectedRoute?.bridgeType) && fromToken?.address && fromToken.address !== ZeroAddress;
    return [
      _approveSpender,
      _isNeedApprove,
    ];
  }, [selectedRoute, fromToken?.address]);

  const { runAsync: checkAllowance, loading: checkingAllowance, data: needApprove } = useRequest(async () => {
    if (!fromToken?.address || !approveSpender || !address || !amount || Big(amount).lte(0) || !isNeedApprove) {
      return false;
    }
    const _allowance = await wallet.allowance({
      contractAddress: fromToken?.address,
      spender: approveSpender,
      address,
      amountWei: Big(amount || 0).times(10 ** fromToken?.decimals).toFixed(0, 0),
    });
    console.log("_allowance: %o", _allowance);
    return _allowance.needApprove;
  }, {
    debounceWait: 500,
    refreshDeps: [fromToken?.address, approveSpender, amount, address, isNeedApprove],
  });

  const [loading, innerText] = useMemo(() => {
    let _loading = isLoading || approving || checkingAllowance;
    let _text = () => {
      if (comingSoon) {
        return "Coming soon...";
      }
      if (_loading) {
        return (
          <Loading size={20} />
        );
      }
      if (chainId !== fromChainId) {
        return "Switch Chain";
      }
      if (needApprove) {
        return "Approve";
      }
      return "Bridge";
    };

    return [
      _loading,
      text === "SuperSwap" ? text : _text(),
    ];
  }, [isLoading, approving, comingSoon, chainId, fromChainId, needApprove, checkingAllowance, text]);


  if (!address) {
    return (
      <button
        type="button"
        className={cls}
        onClick={() => {
          openConnectModal?.()
        }}
      >
        Connect Wallet
      </button>
    );
  }


  return (
    <button
      type="button"
      className={cls}
      disabled={comingSoon || (chainId === fromChainId && disabled)}
      onClick={() => {
        if (chainId !== fromChainId) {
          switchChain({ chainId: fromChainId })
          return
        }

        if (disabled) {
          return
        }

        if (loading) {
          return
        }

        if (needApprove) {
          onApprove({
            contractAddress: fromToken.address,
            spender: approveSpender,
            amountWei: Big(amount || 0).times(10 ** fromToken?.decimals).toFixed(0, 0),
          });
          return;
        }

        onClick()
      }}
    >
      {innerText}
    </button>
  );
}