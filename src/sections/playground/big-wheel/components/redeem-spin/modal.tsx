import Modal from "@/components/modal";
import RedeemSpin from ".";

const RedeemSpinModal = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[-10px] !top-[-10px]"
    >
      <div className="w-[384px] p-[58px_20px_25px] md:w-full rounded-[16px] border-[2px] border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)]">
        <RedeemSpin {...props} />
      </div>
    </Modal>
  );
};

export default RedeemSpinModal;
