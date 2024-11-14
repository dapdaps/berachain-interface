import Modal from "@/components/modal";
import clsx from "clsx";

export default function Basic({ title, open, onClose, children }: any) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="top-[-10px] right-[-10px] md:hidden"
    >
      <div
        className={clsx(
          "p-[20px] w-[460px] bg-[#FFFDEB] rounded-[20px] border border-black",
          "md:w-full md:rounded-b-none md:border-0"
        )}
      >
        <div className="text-[20px] font-bold">{title}</div>
        {children}
      </div>
    </Modal>
  );
}
