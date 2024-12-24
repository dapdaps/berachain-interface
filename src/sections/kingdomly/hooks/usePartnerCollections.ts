import { get } from '@/utils/http';
import { useEffect } from 'react';
import { useListStore } from '../stores/useListStore';
import { NFTCollection, NFTCollectionWithStatus, Status } from '../types';

export const usePartnerCollections = () => {
  const { collections, isLoading, error, setCollections, setLoading, setError } = useListStore();

  useEffect(() => {
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

        const collections: NFTCollectionWithStatus[] = [
          ...data.partnerCollections.live.map((collection: NFTCollection) => ({
            ...collection,
            status: Status.LIVE
          })),
          ...data.partnerCollections.sold_out.map((collection: NFTCollection) => ({
            ...collection,
            status: Status.SOLD_OUT
          }))
        ];

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