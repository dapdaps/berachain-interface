import Modal from '@/components/modal';
import Index from './index';
import Card from '@/components/card';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';

const ActionModal = (props: any) => {
  const { className } = props;

  const { actionVisible, toggleActionVisible } = useVaultsV2Context();

  return (
    <Modal
      open={actionVisible}
      onClose={toggleActionVisible}
      className={className}
    >
      <Card className="!rounded-[20px] w-[496px]">
        <Index />
      </Card>
    </Modal>
  );
};

export default ActionModal;
