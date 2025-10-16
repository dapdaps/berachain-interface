import { DEFAULT_CHAIN_ID } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRequest } from "ahooks";
import Big from "big.js";
import { Contract, utils } from "ethers";
import { useMemo, useState } from "react";
import { useSwitchChain } from "wagmi";
import { LOOTBOX_CONTRACT_ADDRESS } from "../components/lootbox/config";
import { LOOTBOX_CONTRACT_ABI } from "../components/lootbox/abi";
import useToast from "@/hooks/use-toast";
import { bera } from "@/configs/tokens/bera";
import useIsMobile from "@/hooks/use-isMobile";
import { GameLootbox } from "@/configs/playground";
import useTokenBalance from "@/hooks/use-token-balance";

export const useLootbox = (props?: any) => {
  const { } = props ?? {};

  const costToken = bera["bera"];
  const isMobile = useIsMobile();
  const { accountWithAk, account, provider, chainId } = useCustomAccount();
  const { isPending: switching, switchChain } = useSwitchChain();
  const connectModal = useConnectModal();
  const toast = useToast();
  const {
    tokenBalance: costTokenBalance,
    isLoading: costTokenBalanceLoading,
    getTokenBalance: getCostTokenBalance,
  } = useTokenBalance(costToken.address, costToken.decimals, costToken.chainId);

  const { data: boxList, loading: boxListLoading } = useRequest(async () => {
    try {
      const res = await get("/api/go/box/products");
      if (res.code !== 200) {
        return [];
      }
      const _list = res.data;
      _list.forEach((item: any) => {
        const _curr = GameLootbox[item.category];
        if (_curr) {
          item.icon = _curr.icon;
          item.img = _curr.img;
          item.imgBox = _curr.imgBox;
          item.imgBoxOpen = _curr.imgBoxOpen;
          item.name = _curr.name;
        }
      });
      return _list;
    } catch (error) {
      console.log("get boxes failed: %o", error);
    }
  }, {});

  const flatBoxList = useMemo(() => {
    if (!Array.isArray(boxList)) return [];
    const result: any[] = [];
    const splitCount = isMobile ? 1 : 2;
    for (let i = 0; i < boxList.length; i += splitCount) {
      result.push(boxList.slice(i, i + splitCount));
    }
    return result;
  }, [boxList, isMobile]);

  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buyBox, setBuyBox] = useState<any>(null);
  const [buyBoxAmount, setBuyBoxAmount] = useState<string>("");

  const onBuyClose = () => {
    setBuyBox(void 0);
    setBuyBoxAmount("");
    setBuyModalOpen(false);
  };

  const { runAsync: onBuyCheck, loading: buyChecking } = useRequest(async (box?: any) => {
    const _box = box ?? buyBox;
    const _result = { success: false, message: "" };

    if (!account) {
      connectModal.openConnectModal?.();
      return _result;
    }
    if (chainId !== DEFAULT_CHAIN_ID) {
      switchChain({
        chainId: DEFAULT_CHAIN_ID,
      });
      return _result;
    }
    if (!_box || !provider) {
      return _result;
    }

    const contract = new Contract(LOOTBOX_CONTRACT_ADDRESS, LOOTBOX_CONTRACT_ABI, provider);

    try {
      const res = await contract.getActivity(_box.product_id);
      _result.success = res.isActive;
      if (!res.isActive) {
        _result.message = "Lootbox is not active";
      }
    } catch (error) {
      console.log("get activity failed: %o", error);
      _result.message = "Lootbox is not active";
    }

    return _result;
  }, { manual: true });

  const { runAsync: onBuyOpen, loading: buyOpening } = useRequest(async (box: any) => {
    setBuyBox(box);
    const checkRes = await onBuyCheck(box);
    if (!checkRes.success) {
      if (checkRes.message) {
        toast.fail({
          title: checkRes.message,
        });
      }
      setBuyBox(void 0);
      return;
    }
    getCostTokenBalance();
    setBuyModalOpen(true);

  }, { manual: true });

  const { runAsync: onBuy, loading: buying } = useRequest(async () => {
    let toastId = toast.loading({ title: "Buying..." });

    const checkRes = await onBuyCheck(buyBox);
    if (!checkRes.success) {
      if (checkRes.message) {
        toast.fail({
          title: checkRes.message,
        });
      }
      toast.dismiss(toastId);
      return;
    }

    if (!buyBoxAmount || Big(buyBoxAmount).lte(0)) {
      toast.dismiss(toastId);
      return;
    }

    const signer = provider.getSigner(account);
    const contract = new Contract(LOOTBOX_CONTRACT_ADDRESS, LOOTBOX_CONTRACT_ABI, signer);
    const params = [
      buyBox.product_id,
      buyBoxAmount
    ];
    const options: any = {
      value: utils.parseUnits(Big(buyBox.price).times(buyBoxAmount).toFixed(costToken.decimals), costToken.decimals),
    };

    try {
      const estimatedGas = await contract.estimateGas.buy(...params, options);
      options.gasLimit = Math.floor(Number(estimatedGas) * 1.2);
    } catch (error) {
      console.log("estimate gas limit failed: %o", error);
    }

    try {
      const tx = await contract.buy(...params, options);
      toast.dismiss(toastId);
      toastId = toast.loading({
        title: "Confirming...",
        tx: tx.hash,
        chainId: DEFAULT_CHAIN_ID,
      });
      const txReceipt = await tx.wait();
      toast.dismiss(toastId);
      const { status, transactionHash } = txReceipt;
      if (status !== 1) {
        toast.fail({
          title: "Buy failed",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID,
        });
        return;
      }
      toast.success({
        title: "Buy successful",
        tx: transactionHash,
        chainId: DEFAULT_CHAIN_ID,
      });
      onBuyClose();
    } catch (error: any) {
      console.log("buy lootbox failed: %o", error);
      toast.dismiss(toastId);
      toast.fail({
        title: "Buy failed",
        text: error?.message?.includes("user rejected transaction") ? "User rejected transaction" : "",
      });
    }
  }, { manual: true });

  const buttonStatus = useMemo(() => {
    const _status = { text: "Buy", loading: false, disabled: false };
    if (buying) {
      _status.loading = true;
    }

    if (!account) {
      _status.text = "Connect Wallet";
      return _status;
    }
    if (chainId !== DEFAULT_CHAIN_ID) {
      _status.text = "Switch Network";
      return _status;
    }
    if (!buyBox) {
      _status.disabled = true;
      _status.text = "Select a lootbox";
      return _status;
    }
    if (!buyBoxAmount || Big(buyBoxAmount).lte(0)) {
      _status.disabled = true;
      _status.text = "Enter an amount";
      return _status;
    }
    if (Big(buyBox.price).times(buyBoxAmount).gt(costTokenBalance || 0)) {
      _status.disabled = true;
      _status.text = "Insufficient balance";
      return _status;
    }

    return _status;
  }, [
    buying,
    buyBox,
    buyBoxAmount,
    account,
    chainId,
    costTokenBalance,
  ]);

  return {
    boxList,
    boxListLoading,
    flatBoxList,
    onBuyOpen,
    buyOpening,
    buyModalOpen,
    setBuyModalOpen,
    buyBox,
    buyBoxAmount,
    setBuyBoxAmount,
    onBuy,
    buying,
    buttonStatus,
    onBuyClose,
    costToken,
    costTokenBalance,
    costTokenBalanceLoading,
    getCostTokenBalance,
  };
};
