import SwitchTabs from "@/components/switch-tabs";
import { NFTCollectionWithStatus } from "../types";
import { useEffect, useState } from "react";
import { CHAIN_RPC_URLS } from "../hooks/usePartnerCollections";
import { Contract, ethers, providers } from "ethers";
import NFTAbi from '../abis/NFT.json';

interface MintDetailCardProps {
  item: NFTCollectionWithStatus;
}

const MintDetailCard: React.FC<MintDetailCardProps> = ({
  item
}) => {
  const [tab, setTab] = useState("live");
  const [quantity, setQuantity] = useState(1);
  const [detail, setDetail] = useState<NFTCollectionWithStatus | null>(null);

  const LIMIT_PER_WALLET = 5;
  const MINT_PRICE = 0.015;
  const GAS_FEE = 0.001332;

  useEffect(() => {
    fetchContractData();
  }, []);


  const fetchContractData = async () => {
    try {
      const chainId = item.chain.chain_id;
      const rpcUrl = CHAIN_RPC_URLS[chainId];
      
      if (!rpcUrl) {
        console.error(`No RPC URL found for chain ID ${chainId}`);
        return item;
      }

      const provider = new providers.JsonRpcProvider(rpcUrl);

      const contract = new Contract(item.contract_address, NFTAbi, provider);

      const [maxMintPerWallet, mintPrice] = await Promise.all([
        contract.maxMintPerWallet(0),
        contract.mintPrice(0),
        // contract.quoteBatchMint(1)
      ]);

      const setter = {
        ...item,
        maxMintPerWallet: maxMintPerWallet.toString(),
        mintPrice: ethers.utils.formatUnits(mintPrice, 'ether')
      };

      console.log('setter', setter);

    } catch (err) {
      console.error(`Error fetching data for contract ${item.contract_address}:`, err);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(value) || 0;

    if (numValue <= LIMIT_PER_WALLET) {
      setQuantity(numValue);
    }
  };

  const handleIncrement = () => {
    if (quantity < LIMIT_PER_WALLET) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateSubtotal = () => {
    return (quantity * MINT_PRICE + GAS_FEE).toFixed(6);
  };

  return (
    <div className="mt-[14px]">
      <div className="flex w-full justify-between gap-5">
        <img
          src={item.profile_image}
          className="w-[300px] h-[300px] object-cover rounded-[10px] aspect-square"
          alt=""
        />
        <div className="p-5 bg-black bg-opacity-[0.06] rounded-[10px] shrink-0 flex-1">
          <SwitchTabs
            tabs={[
              { label: "Live", value: "live" },
              { label: "Upcoming", value: "upcoming" },
              { label: "Testing", value: "tes" },
              { label: "Live", value: "live1" },
            ]}
            isScroll
            onChange={setTab}
            current={tab}
            className="w-full mx-auto"
            style={{ height: 56, borderRadius: 12 }}
            cursorStyle={{ borderRadius: 10 }}
          />
          
          <div className="text-[14px] font-Montserrat mt-3 mb-[30px]">
            This is a public mint, anyone can mint and join the BeraVote
            Senate. Join the greatest governance revolution and community in
            crypto!
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-3 gap-8 mb-5">
              <div className="w-full">
                <div className="text-[14px] mb-2">Limit per wallet</div>
                <div className="text-base font-bold">{LIMIT_PER_WALLET}</div>
              </div>
              <div className="w-full">
                <div className="text-[14px] mb-2">Max supply</div>
                <div className="text-base font-bold">1000</div>
              </div>
              <div className="w-full">
                <div className="text-[14px] mb-2">Mint Price:</div>
                <div className="text-base font-bold">{MINT_PRICE}ETH</div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="relative mb-4">
              <div className="flex items-center justify-between p-2 rounded-xl border border-[#373A53] bg-white">
                <button
                  onClick={handleDecrement}
                  className="w-[32px] h-[32px] flex items-center justify-center"
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="33"
                      height="33"
                      rx="10.5"
                      fill="white"
                      stroke="#373A53"
                    />
                    <rect
                      x="11"
                      y="16"
                      width="13"
                      height="2"
                      rx="1"
                      fill="black"
                    />
                  </svg>
                </button>

                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center text-2xl font-medium focus:outline-none"
                />

                <button
                  onClick={handleIncrement}
                  className="w-[32px] h-[32px] flex items-center justify-center"
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="33"
                      height="33"
                      rx="10.5"
                      fill="white"
                      stroke="#373A53"
                    />
                    <path
                      d="M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z"
                      fill="black"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-4 font-Montserrat">
              <div className="flex justify-between items-center">
                <div className="text-[14px]">Estimated fees</div>
                <div className="text-base font-bold">{GAS_FEE} ETH</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[14px]">Subtotal</div>
                <div className="text-base font-bold">{calculateSubtotal()} ETH</div>
              </div>
            </div>

            <button className="w-full bg-[#FFDC50] border border-black h-[46px] font-Montserrat text-[18px] text-center leading-[46px] mt-[18px] rounded-[10px]">
              Mint now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintDetailCard;
