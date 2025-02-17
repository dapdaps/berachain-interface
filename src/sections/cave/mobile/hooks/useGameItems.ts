import { useEffect, useState } from 'react';
import { get } from '@/utils/http';
import { ModuleConfig, ModuleType } from '../components/Module';
import { ModuleConfigs } from '../config';
import { useAccount } from 'wagmi';
import useToast from '@/hooks/use-toast';

interface GameItem {
  id: number;
  category: string;
  bonus_percentage: string;
  level: number;
  pc_item: boolean;
  mobile_item: boolean;
}

const categoryToModuleType: Record<string, ModuleType> = {
  cars: 'cars',
  hats: 'hats',
  jackets: 'jackets',
  necklaces: 'necklaces',
};

const generateImageUrls = (category: string, level: number, isActive: boolean) => {
  const basePath = `/images/mobile/cave/${category}/${category}-${level}`;
  
  return {
    icon: `${basePath}${isActive ? '-active' : ''}.png`,
    popoverIcon: `${basePath}-m.png`,
  };

};


export const useGameItems = ({ round }: { round: number }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [moduleConfigs, setModuleConfigs] = useState<Record<ModuleType, ModuleConfig>>(ModuleConfigs);

  const { address }  = useAccount();
  const toast = useToast();

  const fetchGameItems = async () => {
    try {
      setLoading(true);
      const response = await get(`/api/beracave/items`);
      const response2 = await get(`/api/beracave/items/${address || ''}/${round}`)
      if (response.code !== 0 || response2.code !== 0) return

      const sortedItems = response.data.sort((a: any, b: any) => a.level - b.level)
      const groupedByCategory = sortedItems.reduce((acc: Record<string, GameItem[]>, item: GameItem) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      const newConfigs: Record<ModuleType, ModuleConfig> = { ...ModuleConfigs };

      Object.entries(groupedByCategory).forEach(([category, items]: any) => {
        const moduleType = categoryToModuleType[category] as ModuleType;

        newConfigs[moduleType] = {
          ...ModuleConfigs[moduleType],
          items: items.map((item: any, index: any) => {

            const { icon, popoverIcon } = generateImageUrls(
              item.category,
              item.level,
              item.pc_item || response2?.data?.findIndex((_item: any) => _item.name === item.name) > -1 
            );

            return {
              ...item,
              itemId: item.id,
              ...ModuleConfigs[moduleType].items[index],
              icon,
              img: icon,
              popoverIcon,
            };
          }),
        };
      });

      setModuleConfigs(newConfigs);
      setError(null);
    } catch (err) {
      toast.fail('Failed to fetch game items');
      setError(new Error('Failed to fetch game items'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!address) {
      return ;
    }

    fetchGameItems();
  }, [address]);

  return {
    moduleConfigs,
    loading,
    error,
    fetchGameItems,
  };
};