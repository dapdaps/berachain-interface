import Loading from "@/components/loading";
import { useAccount, useSwitchChain } from "wagmi";

export default function SubmitBtn(props: any) {
  const { comingSoon, onClick, isLoading, disabled, fromChainId } = props;
  const { switchChain } = useSwitchChain()
  const { address, chainId } = useAccount()

  return (
    <button
      type="button"
      className="w-full h-[60px] flex items-center justify-center border border-[#000000] rounded-[10px] bg-[#FFDC50] text-[18px] font-[600] mt-[16px] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      disabled={comingSoon || disabled}
      onClick={() => {
        if (disabled) {
          return
        }

        if (isLoading) {
          return
        }

        if (chainId !== fromChainId) {
          switchChain({ chainId: fromChainId })
          return
        } 

        onClick()
      }}
    >
        {comingSoon ? 'Coming soon...' : isLoading ? <Loading size={20}/> : chainId !== fromChainId ? 'Switch Chain' : 'Bridge'}
    </button>
  );
}