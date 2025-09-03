import { DEFAULT_CHAIN_ID } from "@/configs";
import { RPC_LIST } from "@/configs/rpc";
import { useProvider } from "@/hooks/use-provider";
import useUser from "@/hooks/use-user";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";

const NFT_ADDRESSES = [
    '0x88888888a9361f15aadbaca355a6b2938c6a674e',
    '0x886d2176d899796cd1affa07eff07b9b2b80f1be'
]
export const useNft = () => {
    const [nft, setNft] = useState<any>({
        [NFT_ADDRESSES[0]]: false,
        [NFT_ADDRESSES[1]]: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const rpc = useMemo(() => RPC_LIST[DEFAULT_CHAIN_ID], [DEFAULT_CHAIN_ID]);

    const { userInfo } = useUser();

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
            console.log('balance:', balance);

            setIsLoading(false);
            return balance.toString() === '0'

        } catch (error) {
            console.error("Error checking NFT ownership:", error);
        } finally {
            setIsLoading(false);
        }

        return false
    }, [userInfo, rpc]);

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
    };
};