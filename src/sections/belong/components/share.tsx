import Card from "@/components/card";
import Modal from "@/components/modal";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import Capsule from "./capsule";
import useToast from "@/hooks/use-toast";
import { useRef } from "react";

const ShareModal = (props: any) => {
  const {
    className,
    open,
    onClose,
    leverage,
    apy,
    market
  } = props;

  const toast: any = useToast();

  const postcardRef = useRef<any>(null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      isMaskClose={false}
      isShowCloseIcon={false}
    >
      <Card className={clsx("!rounded-[20px] !w-[440px] p-[20px] text-[12px] text-[#D7D7D7] font-[500] leading-normal font-Syne", className)}>
        <div
          ref={postcardRef}
          className="pt-[121px] pl-[29px] text-[16px] text-[#F8F8F8] font-[500] font-Montserrat w-full relative h-[265px] bg-[url('/images/belong/v2/bg-share.png')] bg-no-repeat bg-contain bg-center"
        >
          <div className="">
            APR
          </div>
          <div className="text-[48px] text-[#7AFF62] font-[400] leading-[80%] font-SpecialGothicExpandedOne">
            {numberFormatter(apy, 2, true, { prefix: "+ " })}%
          </div>
          <div className="mt-[5px]">
            Leverage: {leverage}x
          </div>
          <div className="text-[14px] text opacity-60 mt-[15px]">
            We Be-Long to Berachain.
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-[4px] mt-[12px] opacity-60">
          <Capsule
            onClick={() => {
              navigator.clipboard.writeText(window.location.href).then(() => {
                toast.success({
                  title: "Copied successfully"
                });
              }).catch(() => {
                toast.fail({
                  title: "Copy failed"
                });
              });
            }}
          >
            <div className="">Copy</div>
            <img
              src="/images/belong/v2/icon-copy.png"
              className="w-[10px] h-[10px] shrink-0"
            />
          </Capsule>
          <Capsule
            onClick={() => {
              // TODO
            }}
          >
            <div className="">Share</div>
            <div className="">&gt;</div>
          </Capsule>
        </div>
        <div className="w-full mt-[12px]">
          <button
            type="button"
            className="w-full h-[32px] border border-black bg-[#FFDC50] rounded-[6px] flex justify-center items-center gap-[5px] uppercase text-[14px] text-[#0F0F0F]"
            onClick={onClose}
          >
            close
          </button>
        </div>
      </Card>
    </Modal>
  );
};

export default ShareModal;
