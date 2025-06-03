import { useVaultAction } from '@/components/chat/hooks/useVaultAction';
import InterestItem from '@/components/chat/components/InterestItem';
import { motion } from 'framer-motion';
import { motionStaggerParent } from '@/components/chat/utils/motion-stagger-children';

const VaultsCard = (props: any) => {
  const { vaultsShowList } = useVaultAction(props);

  return (
    <motion.div
      className="mt-[10px] w-full min-w-[554px] flex flex-col gap-[8px]"
      {...motionStaggerParent(0.1)}
    >
      {
        vaultsShowList.map((vault: any, idx: number) => (
          <InterestItem
            key={idx}
            item={vault}
          />
        ))
      }
    </motion.div>
  );
};

export default VaultsCard;
