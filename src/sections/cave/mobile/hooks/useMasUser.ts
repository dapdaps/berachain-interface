import { useEffect, useState } from 'react';
import { get } from '@/utils/http';
import { ModuleConfig, ModuleType } from '../components/Module';
import { ItemsConfigs } from '../config';
import { useAccount } from 'wagmi';
import useToast from '@/hooks/use-toast';




export const useMasUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<any>(ItemsConfigs)
  const [nfts, setNfts] = useState<any>([])

  const { address } = useAccount();
  const toast = useToast();

  useEffect(() => {
    if (!address) {
      return;
    }
    const fetchMasUser = async () => {
      try {
        setLoading(true);
        const response = await get(`/api/mas/user/${address}`);
        if (response.code !== 0) return

        const _items = items?.map((item: any) => {
          return {
            ...item,
            christmas: true,
            pc_item: response?.data?.findIndex((_item: any) => _item.name === item.name) > -1,
          }
        })
        const _nfts = response?.data?.nfts?.map((item: any) => {
          return {
            ...item,
            pc_item: true,
          }
        })
        setItems(_items)
        setNfts(_nfts)
        setError(null);
      } catch (err) {
        toast.fail('Failed to fetch game items');
        setError(new Error('Failed to fetch game items'));
      } finally {
        setLoading(false);
      }
    };

    fetchMasUser();
  }, [address]);

  return {
    nfts,
    items,
    loading,
    error,
  };
};