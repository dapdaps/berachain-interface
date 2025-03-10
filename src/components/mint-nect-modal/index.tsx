import { DEFAULT_CHAIN_ID } from "@/configs";
import BorrowModal, { ActionText } from "./form";
import config from "@/configs/lending/beraborrow";
import BeraborrowData from "@/sections/Lending/datas/beraborrow";
import { usePriceStore } from "@/stores/usePriceStore";
import { useProvider } from "@/hooks/use-provider";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";

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

  const currentMarket = useMemo(() => data?.markets?.[0], [data]);

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const currChain = networks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId]);

  useEffect(() => {
    setLoading(isChainSupported);
  }, [isChainSupported, address]);

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
    </>
  );
};

export default MintNectModal;
