import Card from "@/components/card";
import Modal from "@/components/modal";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import Capsule from "./capsule";
import useToast from "@/hooks/use-toast";
import { useRef } from "react";
import useIsMobile from "@/hooks/use-isMobile";
import html2canvas from "html2canvas";
import { useRequest } from "ahooks";
import Loading from "@/components/loading";

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
  const isMobile = useIsMobile();

  const postcardRef = useRef<any>(null);

  const { runAsync: handleCopyImage, loading: copyImageLoading } = useRequest(async () => {
    try {
      if (postcardRef.current) {
        const canvas = await html2canvas(postcardRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true
        });

        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const clipboardItem = new ClipboardItem({
              'image/png': blob
            });

            navigator.clipboard.write([clipboardItem]).then(() => {
              toast.success({
                title: "Image copied to clipboard"
              });
            }).catch((error) => {
              console.error('Copy failed:', error);
              toast.fail({
                title: "Copy failed"
              });
            });
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.fail({
        title: "Failed to generate image"
      });
    }
  }, { manual: true });

  return (
    <Modal
      open={open}
      onClose={onClose}
      isMaskClose={isMobile}
      isShowCloseIcon={false}
    >
      <Card className={clsx("!rounded-[20px] md:!rounded-b-[0px] !w-[440px] md:!w-full p-[20px] text-[12px] text-[#D7D7D7] font-[500] leading-normal font-Montserrat", className)}>
        <div
          ref={postcardRef}
          className="pt-[121px] pl-[29px] text-[16px] text-[#F8F8F8] font-[500] font-Montserrat w-full relative h-[265px] bg-[url('/images/belong/v2/bg-share.png')] bg-no-repeat bg-contain bg-center"
        >
          <div className="flex items-center gap-[16px] absolute top-[22px] left-[29px] pointer-events-none">
            <img
              src="/images/belong/v2/share-beratown-logo.png"
              className="w-[35px] h-[22px] object-center object-contain shrink-0"
            />
            <img
              src="/images/belong/v2/belong-title.svg"
              className="w-[76px] h-[10px] object-center object-contain shrink-0"
            />
          </div>
          <img
            src="/images/belong/v2/share-parachute.svg"
            className="w-[149px] h-[139px] object-center object-contain shrink-0 absolute top-[0px] right-[18px] pointer-events-none"
          />
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
              if (copyImageLoading) {
                return;
              }
              handleCopyImage();
            }}
          >
            {
              copyImageLoading && (
                <Loading size={12} />
              )
            }
            <div className="">Copy</div>
            <img
              src="/images/belong/v2/icon-copy.png"
              className="w-[10px] h-[10px] shrink-0"
            />
          </Capsule>
          <Capsule
            onClick={() => {
              const tweetText = `I Be-Long to @berachain 🐻\n@0xberatown is for berachain, for everyone.\nHuge shoutout to @SmileeFinance, @InfraredFinance, @KodiakFi, @beraborrow, and @steadyteddys for making this happen :p\nTry it yourself: bera.town/belong`;

              // Encode the tweet text for the URL
              const encodedTweet = encodeURIComponent(tweetText);

              // Construct the Twitter Intent URL
              const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;

              window.open(tweetUrl, "_blank");
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
