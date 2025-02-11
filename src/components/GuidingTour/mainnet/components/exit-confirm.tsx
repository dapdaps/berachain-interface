import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';

const ExitConfirm = (props: any) => {
  const { onClose } = props;

  const {
    setVisited,
    exitConfirmVisible,
    setExitConfirmVisible,
    setEntryVisible,
    profileVisible,
    setProfileVisible,
    choosePillVisible,
    setChoosePillVisible,
  } = useGuidingTour();

  const handleClose = () => {
    setExitConfirmVisible(false);
    if (profileVisible) {
      setProfileVisible(true);
      return;
    }
    if (choosePillVisible) {
      setChoosePillVisible(true);
      return;
    }
    setEntryVisible(true);
  };

  const handleConfirm = () => {
    setVisited(true);
    handleClose();
  };

  return (
    <Modal
      open={exitConfirmVisible}
      onClose={() => onClose(false)}
      isMaskClose={false}
    >
      <Card className="w-[680px] p-[39px_26px_36px]">
        <div className="text-[24px] font-Montserrat font-[900] leading-[120%] text-black px-[12px]">
          Are you sure to skip the tutorial?
        </div>
        <article className="text-[16px] font-Montserrat font-[500] text-black leading-[150%] mt-[11px] px-[12px]">
          If you’re new to <strong>Berachain</strong> or the mainnet, McBera highly encourages you to go through the <strong>tutorial</strong> to <strong>get familiar</strong> + you’re missing out some seriously dripping <strong>accessories</strong> in the <strong>Beracave</strong>!
        </article>
        <div className="flex justify-between items-center gap-[22px] mt-[23px]">
          <Button
            className="flex-1"
            onClick={handleClose}
          >
            Back
          </Button>
          <Button
            type={ButtonType.Primary}
            className="flex-1"
            onClick={handleConfirm}
          >
            Visit BeraTown Now
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default ExitConfirm;
