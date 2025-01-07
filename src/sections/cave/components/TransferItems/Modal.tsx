import Modal from '@/components/modal';
import Index from './index';
import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';

const TransferItemsModal = (props: any) => {
  const {
    transferItemsVisible,
    setTransferItemsVisible,
    setTransferItem,
  } = useTransferItemsStore();

  return (
    <Modal
      className=""
      open={transferItemsVisible}
      onClose={() => {
        setTransferItemsVisible(false);
        setTransferItem(void 0);
      }}
    >
      <Index {...props} />
    </Modal>
  );
};

export default TransferItemsModal;
