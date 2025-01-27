import { BlockchainEnum } from "../../types/interfaces";
import { ChainType, useConnectWallet } from "../../hooks/useConnectWallet";
import { useConnectedWalletsStore } from "@/stores/useConnectedWalletsStore";
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
  const { isWalletConnected, switchActiveWallet } = useConnectedWalletsStore();

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
    const isConnected = isWalletConnected(requiredWallet);

    if (isConnected) {
      // 使用新的 switchActiveWallet 方法来切换活跃钱包
      switchActiveWallet(requiredWallet);
    } else {
      // 新钱包连接
      await signIn({ id: requiredWallet });
    }
  }

  const getButtonText = (): string => {
    const requiredWallet = getRequiredWalletType();
    const isConnected = isWalletConnected(requiredWallet);

    if (isConnected) {
      switch(requiredWallet) {
        case ChainType.Solana:
          return "Switch to Solana Wallet";
        case ChainType.Near:
          return "Switch to Near Wallet";
        case ChainType.EVM:
          return "Switch to EVM Wallet";
      }
    } else {
      switch(requiredWallet) {
        case ChainType.Solana:
          return "Connect Solana Wallet";
        case ChainType.Near:
          return "Connect Near Wallet";
        case ChainType.EVM:
          return "Connect EVM Wallet";
      }
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
