import Modal from "@/components/modal";
import Content from "./index";

const BerapawModal = (props: any) => {
  const { show, onClose } = props;

  return (
    <Modal open={show} onClose={onClose}>
      <Content {...props} />
    </Modal>
  );
};

export default BerapawModal;
