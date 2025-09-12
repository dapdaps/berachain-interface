import Modal from "@/components/modal";
import LuckyBeraRecords from ".";

const LuckyBeraRecordsModal = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[10px] !top-[10px] md:hidden"
    >
      <div className="w-[600px] md:h-[80dvh] md:overflow-y-auto md:w-full p-[28px_0_30px] md:p-[10px_5px] rounded-[16px] md:rounded-b-[0] border-2 border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)]">
        <LuckyBeraRecords {...props} />
      </div>
    </Modal>
  );
};

export default LuckyBeraRecordsModal;
