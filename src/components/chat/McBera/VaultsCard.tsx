import { useVaultAction } from '@/components/chat/hooks/useVaultAction';
import InterestItem from '@/components/chat/components/InterestItem';

const VaultsCard = (props: any) => {
  const { vaultsShowList } = useVaultAction(props);

  return (
    <div className="mt-[10px] w-full min-w-[554px] flex flex-col gap-[8px]">
      {
        vaultsShowList.map((vault: any, idx: number) => (
          <InterestItem
            key={idx}
            item={vault}
          />
        ))
      }
    </div>
  );
};

export default VaultsCard;
