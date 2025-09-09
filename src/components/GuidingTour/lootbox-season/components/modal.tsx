import Modal from "@/components/modal";
import clsx from "clsx";

const LootboxSeasonModal = (props: any) => {
  const { className, open, onClose, children } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIcon={(
        <img
          src="/images/guiding-tour/lootbox-season/icon-close@2x.png"
          alt=""
          className="w-[26px] h-[26px] shrink-0 object-center object-contain"
        />
      )}
      closeIconClassName="!right-[12px] !top-[12px]"
      isMaskClose={false}
    >
      <div className={clsx("w-[680px] md:w-full overflow-hidden rounded-[20px] border border-[#333648] bg-[#FFFDEB] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]", className)}>
        {children}
      </div>
    </Modal>
  );
};

export default LootboxSeasonModal;
