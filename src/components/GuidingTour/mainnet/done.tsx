import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';

const Done = (props: any) => {
  const { onClose } = props;

  const { doneVisible, setDoneVisible, setVisited } = useGuidingTour();

  const handleNext = () => {
    setDoneVisible(false);
    setVisited(true);
  };

  return (
    <Modal
      open={doneVisible}
      onClose={() => onClose(false)}
      isMaskClose={false}
    >
      <Card className="w-[680px] md:w-full p-[39px_51px_35px] md:p-[30px_20px_35px] flex flex-col items-center">
        <img src="/images/guiding-tour/done-title.png" alt="" className="shrink-0 w-[393px] md:w-[300px] h-[36px] md:h-[27px]" />
        <img src="/images/guiding-tour/balloon.svg" alt="" className="shrink-0 w-[102px] h-[96px] mt-[36px]" />
        <div className="text-[20px] font-CherryBomb font-[400] leading-[150%] text-black mt-[11px] text-center">
          Bera Balloon
        </div>
        <div className="text-[16px] font-Montserrat font-[400] leading-[150%] text-black mt-[17px] text-center px-[71px] md:px-0">
          Congratz on your <strong>first step</strong> onto Berachain!<br />
          Here’s a <strong>small prize</strong> from McBera. You can check this item later on in the <strong>Beracave</strong>
        </div>
        <div className="flex justify-between items-center mt-[17px]">
          <Button
            type={ButtonType.Primary}
            className="w-[354px]"
            onClick={handleNext}
          >
            Ooga Booga, Let’s Go!
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default Done;
