import Modal from '@/components/modal';
import StakeBGT from '@/sections/vaults/v2/components/action/bgt/index';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';

const StakeBGTModal = (props: any) => {
  const {} = props;

  const { bgtVisible, toggleBgtVisible } = useVaultsV2Context();

  return (
    <Modal
      open={bgtVisible}
      onClose={toggleBgtVisible}
    >
      <StakeBGT
        {...props}
        onClose={() => toggleBgtVisible(false)}
      />
    </Modal>
  );
};

export default StakeBGTModal;
