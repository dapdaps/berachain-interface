import { BlockchainEnum } from "../../types/interfaces";
import { ChainType, useConnectWallet } from "../../hooks/useConnectWallet";
import { ButtonCustom } from "./ButtonCustom";
import { reverseAssetNetworkAdapter } from "../../utils/adapters";

interface ConnectWalletButtonProps {
  network: BlockchainEnum;
  className?: string;
}

export const ConnectWalletButton = ({ 
  network, 
  className 
}: ConnectWalletButtonProps) => {
  const { signIn } = useConnectWallet();

  const getRequiredWalletType = (): ChainType => {
    const targetChain = reverseAssetNetworkAdapter[network];
    
    switch(targetChain) {
      case 'solana':
        return ChainType.Solana;
      case 'near':
        return ChainType.Near;
      default:
        return ChainType.EVM;
    }
  }

  const handleConnect = async () => {
    const requiredWallet = getRequiredWalletType();
    await signIn({ id: requiredWallet });
  }

  const getButtonText = (): string => {
    switch(getRequiredWalletType()) {
      case ChainType.Solana:
        return "Connect Solana Wallet";
      case ChainType.Near:
        return "Connect Near Wallet";
      case ChainType.EVM:
        return "Connect EVM Wallet";
    }
  }

  return (
    <div
      className="bg-[#FFDC50] rounded-xl h-[50px] w-full border border-black font-Montserrat text-black font-semibold text-[16px] cursor-pointer flex justify-center items-center"
      onClick={handleConnect}
    >
      {getButtonText()}
    </div>
  );
};
