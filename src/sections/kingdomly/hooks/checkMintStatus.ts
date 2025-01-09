import { Contract, providers } from 'ethers';
import { MintStatus } from '../types';
import NFTAbi from '../abis/NFT.json';
import { CHAIN_RPC_URLS } from './usePartnerCollections';

export const checkMintStatus = async (
  contractAddress: string,
  chainId: number,
  mintId: number,
  allocation: number
): Promise<MintStatus> => {
  try {
    const rpcUrl = CHAIN_RPC_URLS[chainId];
    if (!rpcUrl) {
      console.error(`No RPC URL found for chain ID ${chainId}`);
      return 'closed';
    }

    const provider = new providers.JsonRpcProvider(rpcUrl);
    const contract = new Contract(contractAddress, NFTAbi, provider);
    
    const isContractLive = await contract.mintLive();
    const totalSupply = await contract.mintGroupMints(mintId);
    const maxSupply = await contract.maxSupplyPerMintGroup(mintId);


    if (!isContractLive && (maxSupply.toNumber() !== totalSupply.toNumber())) return 'closed';

    const startTimestamp = await contract.presaleScheduledStartTimestamp(mintId);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime < startTimestamp.toNumber()) return 'upcoming';

    const isActive = await contract.presaleActive(mintId);
    if (!isActive) return 'paused';

    
    if (totalSupply.toNumber() >= allocation) return 'sold_out';

    return 'live';
  } catch (error) {
    console.error('Error checking mint status:', error);
    return 'closed';
  }
};
