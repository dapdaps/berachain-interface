import clsx from "clsx";
import Modal from "../modal";

const CheckInReward = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[-14px] !top-[-8px]"
    >
      <div
        className={clsx(
          "w-[340px] h-[400px] relative shrink-0 rounded-[16px] border-[2px] border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] text-black text-center font-Montserrat text-[16px] font-medium leading-[120%]"
        )}
      >
        <div className="absolute flex justify-center items-center left-1/2 -translate-x-1/2 top-[-104px] w-[255px] h-[242px] bg-[url('/images/check-in/box-open.png')] bg-no-repeat bg-center bg-contain">
          <img
            src="/images/check-in/gem.png"
            alt=""
            className="w-[47px] h-[60px] object-center object-contain shrink-0"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CheckInReward;
