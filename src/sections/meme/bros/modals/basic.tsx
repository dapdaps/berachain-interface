import Modal from "@/components/modal";
import clsx from "clsx";

export default function Basic({ open, onClose, className, children }: any) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="right-[-10px] top-[-10px] md:hidden"
    >
      <div
        className={clsx(
          "p-[20px] w-[520px] bg-[#FFFDEB] rounded-[20px] border border-black md:w-full md:px-[12px] md:rounded-b-none md:border-0",
          className
        )}
      >
        {children}
      </div>
    </Modal>
  );
}
