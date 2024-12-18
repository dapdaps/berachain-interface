import Modal from '@/components/modal';

const BerasigPrompt = (props: any) => {
  const {
    visible,
    onClose,
  } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
      className="z-[102]"
    >
      <div className="w-[450px] rounded-[24px] border border-black bg-[#FFFDEB] shadow-shadow1 p-[20px_30px]">
        Open your BeraSig Wallet and complete the mission in the app.
      </div>
    </Modal>
  );
};

export default BerasigPrompt;
