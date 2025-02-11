import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';
import Title from '@/components/GuidingTour/mainnet/components/title';
import Article from '@/components/GuidingTour/mainnet/components/article';

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
    getBeraVisible,
    setGetBeraVisible,
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
    if (getBeraVisible) {
      setGetBeraVisible(true);
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
      <Card className="w-[680px] md:w-full p-[39px_26px_36px] md:p-[30px_20px_30px]">
        <Title className="px-[12px]">
          Are you sure to skip the tutorial?
        </Title>
        <Article className="mt-[11px] px-[12px]">
          If you’re new to <strong>Berachain</strong> or the mainnet, McBera highly encourages you to go through the <strong>tutorial</strong> to <strong>get familiar</strong> + you’re missing out some seriously dripping <strong>accessories</strong> in the <strong>Beracave</strong>!
        </Article>
        <div className="flex justify-between items-center gap-[22px] md:gap-[10px] mt-[23px]">
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
