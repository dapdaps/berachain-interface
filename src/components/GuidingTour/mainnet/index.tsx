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
import Title from '@/components/GuidingTour/mainnet/components/title';
import Article from '@/components/GuidingTour/mainnet/components/article';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { GuidingTourContext } from './context';

const GuidingTutorial = (props: any) => {
  const {} = props;

  const { address } = useAccount();
  const {
    visited,
    setVisited,
    setExitConfirmVisible,
    setProfileVisible,
    getBeraVisible,
    doneVisible,
  } = useGuidingTour();

  const [entryVisible, setEntryVisible] = useState(false);

  const handleClose = (isConfirm = true) => {
    setEntryVisible(false);

    if (isConfirm) {
      setExitConfirmVisible(true);
      return;
    }
    setVisited(address, true);
  };

  const handleNext = () => {
    setEntryVisible(false);
    setProfileVisible(true);
  };

  const { run: setEntryVisibleDelay, cancel: setEntryVisibleCancel } = useDebounceFn((_visible: boolean) => {
    setEntryVisible(_visible);
  }, { wait: 2000 });

  useEffect(() => {
    setEntryVisibleCancel();

    if (visited[address || 'DEFAULT'] || getBeraVisible || doneVisible) {
      setEntryVisible(false);
      return;
    }

    setEntryVisibleDelay(true);
  }, [address, visited, getBeraVisible || doneVisible]);

  return (
    <GuidingTourContext.Provider
      value={{
        entryVisible,
        setEntryVisible,
      }}
     >
      <Modal
        open={entryVisible}
        onClose={handleClose}
        isMaskClose={false}
      >
        <Card className="w-[680px] md:w-full">
          <img src="/images/guiding-tour/banner.png" alt="" className="w-full h-[340px] md:h-[186px] object-cover" />
          <div className="p-[25px_26px_31px]">
            <Title>Welcome to BeraTown Mainnet!</Title>
            <Article className="mt-[11px]">
              <strong>Q5</strong> is finally here, and so is <strong>da town</strong>! <strong>MeBera</strong> is bery excited to be <strong>your guide</strong>, helping you take <strong>your first steps</strong> into this ecosystem of <strong>low IQ</strong> and <strong>yeetard</strong> beras. Complete this totorial to earn some <strong>special welcome gifts</strong>!
            </Article>
            <div className="flex justify-between items-center gap-[22px] md:gap-[10px] mt-[23px]">
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
    </GuidingTourContext.Provider>
  );
};

export default GuidingTutorial;
