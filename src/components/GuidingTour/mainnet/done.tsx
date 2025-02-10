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
      <Card className="w-[680px] p-[76px_26px_53px] flex flex-col items-center">
        <img src="/images/guiding-tour/done-title.png" alt="" className="shrink-0 w-[393px] h-[36px]" />
        <img src="/images/guiding-tour/helmet.png" alt="" className="shrink-0 w-[103px] h-[80px] mt-[32px]" />
        <div className="text-[18px] font-CherryBomb font-[400] leading-[120%] text-black mt-[5px] text-center">
          Common Bike Helmet
        </div>
        <div className="text-[16px] font-Montserrat font-[400] leading-[120%] text-black mt-[22px] text-center">
          Congratz on your <strong>first step</strong> onto Berachain!
        </div>
        <div className="text-[16px] font-Montserrat font-[400] leading-[120%] text-black mt-[22px] text-center">
          Here’s a <strong>small prize</strong> from McBera. You can check this item later on in the <strong>Beracave</strong>
        </div>
        <div className="flex justify-between items-center mt-[58px]">
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
