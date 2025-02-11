'use client';

import { useGuidingTour } from '@/stores/useGuidingTour';
import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import ExitConfirm from '@/components/GuidingTour/mainnet/components/exit-confirm';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';
import Profile from '@/components/GuidingTour/mainnet/profile';
import ChoosePill from '@/components/GuidingTour/mainnet/choose-pill';
import GetBera from '@/components/GuidingTour/mainnet/get-bera';
import Done from '@/components/GuidingTour/mainnet/done';

const GuidingTutorial = (props: any) => {
  const {} = props;

  const {
    visited,
    setVisited,
    entryVisible,
    setEntryVisible,
    setExitConfirmVisible,
    setProfileVisible,
  } = useGuidingTour();

  const handleClose = (isConfirm = true) => {
    setEntryVisible(false);

    if (isConfirm) {
      setExitConfirmVisible(true);
      return;
    }
    setVisited(true);
  };

  const handleNext = () => {
    setEntryVisible(false);
    setProfileVisible(true);
  };

  if (visited) return null;

  return (
    <>
      <Modal
        open={entryVisible}
        onClose={handleClose}
        isMaskClose={false}
      >
        <Card className="w-[680px]">
          <img src="/images/guiding-tour/banner.png" alt="" className="w-full h-[340px]" />
          <div className="p-[25px_26px_31px]">
            <div className="text-[24px] font-Montserrat font-[900] leading-[120%] text-black">
              Welcome to BeraTown Mainnet!
            </div>
            <article className="text-[16px] font-Montserrat font-[500] text-black leading-[150%] mt-[11px]">
              <strong>Q5</strong> is finally here, and so is <strong>da town</strong>! <strong>MeBera</strong> is bery excited to be <strong>your guide</strong>, helping you take <strong>your first steps</strong> into this ecosystem of <strong>low IQ</strong> and <strong>yeetard</strong> beras. Complete this totorial to earn some <strong>special welcome gifts</strong>!
            </article>
            <div className="flex justify-between items-center gap-[22px] mt-[23px]">
              <Button
                className="flex-1"
                onClick={handleClose}
              >
                Already a town citizen 🐻
              </Button>
              <Button
                type={ButtonType.Primary}
                className="flex-1"
                onClick={handleNext}
              >
                Show me around!
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
      <ExitConfirm onClose={handleClose} />
      <Profile onClose={handleClose} />
      <ChoosePill onClose={handleClose} />
      <GetBera onClose={handleClose} />
      <Done onClose={handleClose} />
    </>
  );
};

export default GuidingTutorial;
