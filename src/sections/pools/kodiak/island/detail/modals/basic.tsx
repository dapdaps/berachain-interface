import Modal from "@/components/modal";

export default function Basic({ title, children }: any) {
  return (
    <Modal
      open={true}
      onClose={() => {}}
      closeIconClassName="top-[-10px] right-[-10px]"
    >
      <div className="p-[20px] w-[460px] bg-[#FFFDEB] rounded-[20px] border border-black">
        <div className="text-[20px] font-bold">{title}</div>
        {children}
      </div>
    </Modal>
  );
}
