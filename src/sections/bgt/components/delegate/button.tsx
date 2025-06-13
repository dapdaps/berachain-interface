import CircleLoading from "@/components/circle-loading";
import { DEFAULT_CHAIN_ID } from "@/configs";
import clsx from "clsx";
import { memo } from "react";
import { useAccount, useSwitchChain } from "wagmi";

export default memo(function Button(props: any) {
  const { loading, inAmount, balance, onClick } = props;
  const BTN_CLASS =
    "w-full h-[60px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[18px] font-semibold leading-[90%]";
  const { isPending: switching, switchChain } = useSwitchChain();
  const { chainId } = useAccount();

  if (loading || switching) {
    return (
      <div className={clsx(BTN_CLASS, "!opacity-50")}>
        <CircleLoading size={14} />
      </div>
    );
  }

  if (chainId !== DEFAULT_CHAIN_ID) {
    return (
      <div
        className={clsx(BTN_CLASS, "cursor-pointer")}
        onClick={() => {
          switchChain({
            chainId: DEFAULT_CHAIN_ID
          });
        }}
      >
        Switch Network
      </div>
    );
  }

  if (Number(inAmount) > Number(balance)) {
    return (
      <div className={clsx(BTN_CLASS, "!opacity-50")}>InSufficient Balance</div>
    );
  }
  if (Number(inAmount) <= 0) {
    return (
      <div className={clsx(BTN_CLASS, "!opacity-50")}>{props.children}</div>
    );
  }

  return (
    <div className={clsx(BTN_CLASS, "cursor-pointer")} onClick={onClick}>
      {props.children}
    </div>
  );
});
