import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';

const GetBera = (props: any) => {
  const { onClose } = props;

  const { getBeraVisible, setGetBeraVisible, setChoosePillVisible, setDoneVisible } = useGuidingTour();

  const handleBack = () => {
    setGetBeraVisible(false);
    setChoosePillVisible(true);
  };

  const handleNext = () => {
    setGetBeraVisible(false);
    setDoneVisible(true);
  };

  return (
    <Modal
      open={getBeraVisible}
      onClose={onClose}
      isMaskClose={false}
    >
      <Card className="w-[1024px] p-[39px_20px_46px_57px]">
        <div className="text-[24px] font-Montserrat font-[900] leading-[120%] text-black text-center">
          Get $BERA for gas fees
        </div>
        <div className="flex justify-between items-stretch mt-[75px]">
          <div className="flex-1 pr-[32px]">
            <div className="text-[24px] font-CherryBomb font-[400] leading-[120%] text-black">
              Method 1
            </div>
            <div className="font-Montserrat text-[16px] leading-[120%] text-black font-[400] mt-[22px]">
              <span className="text-[20px] font-CherryBomb">Step 1: </span>Buy $BERA from the following CEXs
            </div>
            <div className="flex items-center gap-[5px] mt-[19px]">
              {
                [
                  '/images/guiding-tour/cex-1.svg',
                  '/images/guiding-tour/cex-2.svg',
                  '/images/guiding-tour/cex-3.svg',
                  '/images/guiding-tour/cex-4.svg',
                  '/images/guiding-tour/cex-5.svg',
                  '/images/guiding-tour/cex-6.svg',
                ].map((it, idx) => (
                  <img key={idx} src={it} alt="" className="w-[40px] h-[40px] shrink-0" />
                ))
              }
            </div>
            <div className="font-Montserrat text-[16px] leading-[120%] text-black font-[400] mt-[51px]">
              <span className="text-[20px] font-CherryBomb">Step 2: </span>Withdraw to your own wallet
            </div>
          </div>
          <div className="shrink-0 w-[7px] h-[289px] bg-[url('/images/guiding-tour/line-1.svg')] bg-no-repeat bg-center bg-contain"></div>
          <div className="flex-1 pl-[51px] pr-[18px]">
            <div className="text-[24px] font-CherryBomb font-[400] leading-[120%] text-black">
              Method 2
            </div>
            <div className="font-Montserrat text-[16px] leading-[120%] text-black font-[400] mt-[19px]">
              Bridge & convert assets directly to $BERA from other blockchains
            </div>
            <img src="/images/guiding-tour/bridge.svg" alt="" className="w-[154px] h-[143px] mx-auto mt-[40px]" />
          </div>
          <div className="shrink-0 w-[10px] h-[279px] bg-[url('/images/guiding-tour/line-2.svg')] bg-no-repeat bg-center bg-contain"></div>
          <div className="flex-1 pl-[46px]">
            <div className="text-[24px] font-CherryBomb font-[400] leading-[120%] text-black">
              Method 3
            </div>
            <div className="font-Montserrat text-[16px] leading-[120%] text-black font-[400] mt-[19px]">
              Ask your bera frens to send you some $BERA for gas fees
            </div>
            <div className="font-Montserrat text-[16px] leading-[120%] text-black font-[400] mt-[19px]">
              Don’t have any bera frens?
            </div>
            <div className="font-Montserrat text-[16px] leading-[120%] text-black font-[400] mt-[19px]">
              Join McBera Discord / Telegram and bera frens there will help you out!
            </div>
            <div className="flex items-center gap-[24px] mt-[20px]">
              <a href="https://t.me/DapDapDiscussion" target="_blank">
                <img src="/images/guiding-tour/telegram.svg" alt="" className="w-[56px] h-[56px]" />
              </a>
              <a href="https://discord.com/invite/dapdapmeup" target="_blank">
                <img src="/images/guiding-tour/discord.svg" alt="" className="w-[56px] h-[56px]" />
              </a>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex justify-center items-center mt-[24px]">
        <Button
          type={ButtonType.Primary}
          className="w-[354px]"
          onClick={handleNext}
        >
          I’m all set!
        </Button>
      </div>
    </Modal>
  );
};

export default GetBera;
