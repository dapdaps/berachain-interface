import Modal from '@/components/modal';
import Index from './index';
import Card from '@/components/card';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';

const ClaimModal = (props: any) => {
  const { className } = props;

  const { claimVisible, toggleClaimVisible } = useVaultsV2Context();

  return (
    <Modal
      open={claimVisible}
      onClose={toggleClaimVisible}
      className={className}
    >
      <Card className="!rounded-[20px] w-[354px] md:w-full">
        <Index />
      </Card>
    </Modal>
  );
};

export default ClaimModal;
