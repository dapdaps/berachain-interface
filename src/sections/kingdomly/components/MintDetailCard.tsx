import SwitchTabs from "@/components/switch-tabs";
import { NFTCollectionWithStatus } from "../types";
import { useEffect, useState } from "react";
import { CHAIN_RPC_URLS } from "../hooks/usePartnerCollections";
import { Contract, ethers, providers } from "ethers";
import NFTAbi from '../abis/NFT.json';
import Big from "big.js";
import { useCountDown } from "@/hooks/use-count-down";
import Button from './Button'
import { checkMintStatus } from "../hooks/checkMintStatus";
import clsx from "clsx";
import { useMint } from '../hooks/useMint';
import Skeleton from "react-loading-skeleton";
import useToast from "@/hooks/use-toast";

interface MintDetailCardProps {
  item: NFTCollectionWithStatus;
}

const MintDetailCard: React.FC<MintDetailCardProps> = ({
  item
}) => {
  const [currentGroupId, setCurrentGroupId] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [detail, setDetail] = useState<NFTCollectionWithStatus | null>(null);
  const [fees, setFees] = useState({ feeAmount: '', totalCostWithFee: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [mintGroups, setMintGroups] = useState(item.mint_group_data || []);
  const [isMinting, setIsMinting] = useState(false);
  const [isMintStatusLoading, setIsMintStatusLoading] = useState(false);

  const { handleMint } = useMint();
  const toast = useToast();


  const currentGroup = mintGroups.find(group => group.id === currentGroupId) || mintGroups[0];

  const symbol = item.chain.native_currency;

  const mintGroupTabs = mintGroups.map(group => ({
    label: group.name,
    value: group.id.toString(),
    status: group.status
  }));

  const handleTabChange = (value: string) => {
    setCurrentGroupId(Number(value));
    setQuantity(1);
  };

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
      ]);

      const setter = {
        ...item,
        maxMintPerWallet: maxMintPerWallet.toString(),
        mintPrice: ethers.utils.formatUnits(mintPrice, 'ether'),
      };

      setDetail(setter);

    } catch (err) {
      console.error(`Error fetching data for contract ${item.contract_address}:`, err);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(value) || 0;

    if (numValue <= currentGroup.max_mint_per_wallet) {
      setQuantity(numValue);
    }
  };

  const handleIncrement = () => {
    if (quantity < currentGroup.max_mint_per_wallet) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const calculateFees = async () => {
      setIsLoading(true);
      const chainId = item.chain.chain_id;
      const rpcUrl = CHAIN_RPC_URLS[chainId];
      
      if (!rpcUrl) {
        console.error(`No RPC URL found for chain ID ${chainId}`);
        return;
      }

      try {
        const provider = new providers.JsonRpcProvider(rpcUrl);
        const contract = new Contract(item.contract_address, NFTAbi, provider);
        const amount = Big(1).mul(quantity).toFixed();

        const [feeAmount, totalCostWithFee] = await contract.quoteBatchMint(currentGroupId, amount);

        if (isMounted) {
          setFees({
            feeAmount: ethers.utils.formatEther(feeAmount),
            totalCostWithFee: ethers.utils.formatEther(totalCostWithFee)
          });
        }
      } catch (error) {
        if (isMounted) {
          setFees({ feeAmount: '', totalCostWithFee: '' });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    calculateFees();
    return () => { isMounted = false };
  }, [item.chain.chain_id, item.contract_address, quantity, currentGroupId]);

  useEffect(() => {
    const updateMintStatuses = async () => {
      if (!item.mint_group_data) return;
      setIsMintStatusLoading(true);

      try {
        const updatedGroups = await Promise.all(
          item.mint_group_data.map(async (group) => {
            const status = await checkMintStatus(
              item.contract_address,
              item.chain.chain_id,
              group.id,
              group.allocation
            );
            return {
              ...group,
              status
            };
          })
        );
        setMintGroups(updatedGroups);
      } catch (error) {
        console.error('Error updating mint statuses:', error);
      } finally {
        setIsMintStatusLoading(false);
      }

    };

    updateMintStatuses();
  }, [item.contract_address, item.chain.chain_id, item.mint_group_data]);

  const renderMintGroupTag = (tab: any) => {
    if (!tab.status || ['closed', 'paused'].includes(tab.status)) return null;

    const statusMap: {
      [key: string]: string;
    } = {
      'live': 'Live',
      'sold_out': 'Sold Out',
      // 'paused': 'Paused',
      // 'upcoming': 'Upcoming'
    }
    
    return (
      <div className='absolute font-[400] right-2 top-0 p-[3px_5px] font-Montserrat text-[10px] leading-[1] rounded-[16px] bg-[#FFDC50] border border-black'>
        {statusMap[tab.status]}
      </div>
    );
  };

  const onMint = async () => {
    if (!fees.totalCostWithFee) return;
    
    setIsMinting(true);
    toast.loading('Minting...');
    try {
      await handleMint(
        item,
        currentGroupId,
        quantity,
      );
      await fetchContractData();
      toast.success('Your transaction has been confirmed sire!');
    } catch (error) {
      console.error('Mint failed:', error);
    } finally {
      toast.dismiss();
      setIsMinting(false);
    }
  };

  return (
    <div className="mt-[14px]">
      <div className="flex md:flex-col lg:flex-row w-full justify-between gap-5">
        <img
          src={item.profile_image}
          className="md:w-full lg:w-[300px] md:h-[300px] object-cover rounded-[10px] aspect-square"
          alt=""
        />
        <div className="p-5 bg-black bg-opacity-[0.06] rounded-[10px] shrink-0 flex-1">
          <SwitchTabs
            tabs={mintGroupTabs}
            isScroll
            onChange={handleTabChange}
            current={currentGroupId.toString()}
            className="w-full mx-auto md:h-[40px] lg:h-[56px]"
            style={{ borderRadius: 12 }}
            cursorStyle={{ borderRadius: 10 }}
            renderTag={renderMintGroupTag}
          />
          
          <div className="text-[14px] font-Montserrat mt-3 mb-[30px] md:mb-[20px]">
            {currentGroup?.mint_group_description || ""}
          </div>
          
          <div className="w-full">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-8 mb-5">
              <div className="w-full">
                <div className="text-[14px] mb-2">Limit per wallet</div>
                <div className="text-base font-bold">{currentGroup.max_mint_per_wallet}</div>
              </div>
              <div className="w-full">
                <div className="text-[14px] mb-2">Max supply</div>
                <div className="text-base font-bold">{currentGroup.allocation}</div>
              </div>
              <div className="w-full md:col-span-2 lg:col-span-1">
                <div className="text-[14px] mb-2">Mint Price:</div>
                <div className="text-base font-bold">
                  {parseFloat(currentGroup.price.toString()) === 0 ? 'FREE MINT' : `${currentGroup.price} ${symbol}`}
                </div>
              </div>
            </div>

            <div className="relative mb-4">
              <div className="flex items-center justify-between p-2 rounded-xl border border-[#373A53] bg-white">
                <button
                  onClick={handleDecrement}
                  className="w-[32px] h-[32px] flex items-center justify-center"
                  disabled={quantity === 1}
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
                  disabled={quantity === currentGroup.max_mint_per_wallet}
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

            <div className="space-y-4 font-Montserrat md:mb-[20px]">
              <div className="flex justify-between items-center">
                <div className="text-[14px]">Estimated fees</div>
                <div className="text-base font-bold">{parseFloat(fees.feeAmount || '0').toFixed(6)} {item.chain.native_currency}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[14px]">Subtotal</div>
                <div className="text-base font-bold">{parseFloat(fees.totalCostWithFee || '0').toFixed(6)} {item.chain.native_currency}</div>
              </div>
            </div>


            {
              isMintStatusLoading ? (
                <Skeleton height={46} />
              ) : (
                <Button 
                  status={currentGroup.status}
                  timestamp={item.mint_live_timestamp}
                  onClick={onMint}
                  loading={isMinting}
                  className="md:w-full"
                />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintDetailCard;
