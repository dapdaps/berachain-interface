import Modal from "../../components/modal";
import Index from "./index";

const LootboxSeasonStartModal = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Index {...props} />
    </Modal>
  );
};

export default LootboxSeasonStartModal;
