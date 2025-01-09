import { useEffect } from 'react';
import { useListStore } from '../stores/useListStore';
import { NFTCollection, NFTCollectionWithStatus, Status } from '../types';
import { Contract, providers } from 'ethers';
import NFTAbi from '../abis/NFT.json';

export const CHAIN_RPC_URLS: { [key: number]: string } = {
  42161: 'https://arb1.arbitrum.io/rpc', // Arbitrum One
  80084: 'https://bartio.drpc.org', // Berachain
};

export const usePartnerCollections = () => {
  const { collections, isLoading, error, setCollections, setLoading, setError } = useListStore();

  useEffect(() => {
    const fetchContractData = async (collection: NFTCollectionWithStatus) => {
      try {
        const chainId = collection.chain.chain_id;
        const rpcUrl = CHAIN_RPC_URLS[chainId];
        
        if (!rpcUrl) {
          console.error(`No RPC URL found for chain ID ${chainId}`);
          return collection;
        }

        const provider = new providers.JsonRpcProvider(rpcUrl);

        const contract = new Contract(collection.contract_address, NFTAbi, provider);

        const [totalSupply, maxSupply] = await Promise.all([
          contract.totalSupply(),
          contract.maxSupply()
        ]);

        return {
          ...collection,
          totalSupplyByContract: totalSupply.toString(),
          maxSupplyByContract: maxSupply.toString()
        };
      } catch (err) {
        console.error(`Error fetching data for contract ${collection.contract_address}:`, err);
        return collection;
      }
    };

    const fetchPartnerCollections = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api.kingdomly/api/fetchPartnerMints', {
          headers: {
            'accept': 'application/json',
            'API-Key': 'THEFOCUSEDMINDCANPIERCETHROUGHSTONE'
          }
        });

        const data = await response.json();

        let collections: NFTCollectionWithStatus[] = [
          ...data.partnerCollections.live.map((collection: NFTCollection) => ({
            ...collection,
            status: Status.LIVE
          })),
          ...data.partnerCollections.upcoming.map((collection: NFTCollection) => ({
            ...collection,
            status: Status.UPCOMING
          }))
        ];

        collections = collections.filter(collection => collection.chain.chain_id === 80084);

        collections = await Promise.all(
          collections.map(collection => fetchContractData(collection))
        );

        collections = collections.map(collection => {
          const validMintGroups = collection.mint_group_data.filter(group => group.allocation > 0);
          const displayPrice = validMintGroups.length > 0 ? validMintGroups[0].price : 0;
          return {
            ...collection,
            displayPrice
          };
        });


        setCollections(collections);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerCollections();
  }, []);

  return {
    collections,
    isLoading,
    error
  };
};