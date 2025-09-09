import Modal from "@/components/modal";
import Index from "./index";

const BuySpinsModal = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[-10px] !top-[-10px]"
    >
      <div className="w-[384px] flex-shrink-0 rounded-[16px] border-2 border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)]">
        <Index {...props} />
      </div>
    </Modal>
  );
};

export default BuySpinsModal;
