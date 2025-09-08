import { RPC_LIST } from "@/configs/rpc";
import { post } from "@/utils/http";
import { useProvider } from "@/hooks/use-provider";
import useUser from "@/hooks/use-user";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import useToast from "@/hooks/use-toast";
import { useRpcStore } from "@/stores/rpc";

export const NFT_ADDRESSES = [
    '0x886d2176d899796cd1affa07eff07b9b2b80f1be',
    '0x88888888a9361f15aadbaca355a6b2938c6a674e',
]
export const useNft = () => {
    const [nft, setNft] = useState<any>({
        [NFT_ADDRESSES[0]]: false,
        [NFT_ADDRESSES[1]]: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [claimLoading, setClaimLoading] = useState<boolean>(false);
    const toast = useToast();
    const rpcStore = useRpcStore();

    const rpc = useMemo(() =>
        RPC_LIST[rpcStore.selected]?.url,
        [rpcStore]);

    const { userInfo, getUserInfo } = useUser();

    const checkNFT = useCallback(async (nftAddress: string): Promise<boolean> => {
        if (!userInfo?.address) {
            return false
        }

        setIsLoading(true);
        try {
            const provider = new ethers.providers.JsonRpcProvider(rpc);

            const nftContract = new ethers.Contract(
                nftAddress,
                [
                    "function ownerOf(uint256 tokenId) view returns (address)",
                    "function balanceOf(address owner) view returns (uint256)",
                    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
                    "function tokensOfOwner(address owner) view returns (uint256[])",
                ],
                provider
            );

            const balance = await nftContract.balanceOf(userInfo.address);

            setIsLoading(false);
            return balance.gt(0)

        } catch (error) {
            console.error("Error checking NFT ownership:", error);
        } finally {
            setIsLoading(false);
        }

        return false
    }, [userInfo, rpc]);

    const handleClaim = useCallback(async () => {
        try {
            setClaimLoading(true);
            const res = await post('/api/go/user/nft/reward/claim');
            if (res?.code === 200) {
                toast.success({
                    title: 'Claim success',
                    description: 'You have claimed your NFT reward',
                });
                setClaimLoading(false);
                getUserInfo();
            } else {
                toast.fail({
                    title: 'Claim failed',
                    description: 'You have failed to claim your NFT reward',
                });
                setClaimLoading(false);
            }
        } catch (error) {
            console.error("Error claiming NFT reward:", error);
        } finally {
            setClaimLoading(false);
        }

        setClaimLoading(false);
    }, [userInfo]);

    useEffect(() => {
        NFT_ADDRESSES.forEach((nftAddress) => {
            checkNFT(nftAddress).then((res) => {
                setNft((prev: any) => ({ ...prev, [nftAddress]: res }));
            });
        });
    }, [userInfo]);

    return {
        nft,
        setNft,
        claimLoading,
        handleClaim,
    };
};