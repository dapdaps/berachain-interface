import SwitchNetwork from '@/components/switch-network';
import { DEFAULT_CHAIN_ID } from "@/configs";
import chains from '@/configs/chains';
import config from "@/configs/lending/beraborrow";
import { useProvider } from "@/hooks/use-provider";
import BeraborrowData from "@/sections/Lending/datas/beraborrow";
import { usePriceStore } from "@/stores/usePriceStore";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BorrowModal, { ActionText } from "./form";

const MintNectModal = ({ isOpen, onClose }: any) => {
  const { basic, networks } = config as any;
  const network = networks?.[DEFAULT_CHAIN_ID];
  const { markets, borrowToken, ...rest } = network;

  const { address, chainId } = useAccount();
  const { provider } = useProvider();
  const prices = usePriceStore((store) => store.price);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);

  const currentMarket = data?.markets?.[0]

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const currChain = networks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId]);

  useEffect(() => {
    if (isOpen && isChainSupported) {
      setLoading(true);
    }
  }, [isOpen, isChainSupported, address]);

  return (
    <>
      <BeraborrowData
        {...networks[DEFAULT_CHAIN_ID + ""]}
        {...basic}
        chainId={chainId}
        prices={prices}
        update={loading}
        account={address}
        provider={provider}
        onLoad={(res: any) => {
          console.log("Beraborrow data res: %o", res);
          setData(res);
          setLoading(false);
        }}
      />

      {currentMarket && (
        <BorrowModal
          type={ActionText.Borrow}
          visible={isOpen}
          onClose={onClose}
          market={currentMarket}
          borrowToken={borrowToken}
          basic={basic}
          networks={networks}
          network={network}
          onSuccess={onClose}
          {...rest}
        />
      )}
      {
        isOpen && !isChainSupported && (
          <SwitchNetwork targetChain={chains[DEFAULT_CHAIN_ID]} />
        )
      }
    </>
  );
};

export default MintNectModal;
