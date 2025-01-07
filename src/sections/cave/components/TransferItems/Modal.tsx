import Modal from '@/components/modal';
import Index from './index';

const TransferItemsModal = (props: any) => {
  const { visible, onClose } = props;

  return (
    <Modal
      className=""
      open={visible}
      onClose={onClose}
    >
      <Index {...props} />
    </Modal>
  );
};

export default TransferItemsModal;
