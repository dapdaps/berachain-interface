import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import useIsMobile from '@/hooks/use-isMobile';
import { useEffect, useState, useContext } from 'react';
import Title from '@/components/GuidingTour/mainnet/components/title';
import { GuidingTourContext } from './context';

const ChoosePill = (props: any) => {
  const { onClose } = props;
  const isMobile = useIsMobile();
  const { handlePrize, prizing } = useContext(GuidingTourContext);

  const { choosePillVisible, setChoosePillVisible, setProfileVisible, setGetBeraVisible, setDoneVisible } = useGuidingTour();
  const [choosed, setChoosed] = useState<'bera' | 'bgt'>();

  const handleBack = () => {
    setChoosePillVisible(false);
    setProfileVisible(true);
  };

  const handleNext = () => {
    setChoosePillVisible(false);
    setDoneVisible(true);
  };

  const handleChoose = (token?: 'bera' | 'bgt') => {
    setChoosed(token);
  };

  const handleHowGetBera = (e?: any) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setChoosePillVisible(false);
    setGetBeraVisible(true);
  };

  useEffect(() => {
    if (!choosePillVisible) {
      handleChoose(void 0);
      return;
    }
    if (isMobile && !choosed) {
      handleChoose('bera');
    }
  }, [isMobile, choosed, choosePillVisible]);

  return (
    <Modal
      open={choosePillVisible}
      onClose={onClose}
      isMaskClose={false}
    >
      <Card className={clsx('w-[680px] md:w-full md:pb-[30px]', isMobile ? '' : '!bg-[unset] !border-0 !shadow-none')}>
        <div className={clsx(
          'relative shrink-0 w-full h-[433px] md:h-[239px] bg-[url("/images/guiding-tour/choose-pill.png")] bg-no-repeat bg-center bg-cover',
          choosed ? 'pt-[38px]' : 'pt-[48px]'
        )}>
          {
            choosed ? (
              <img
                src="/images/guiding-tour/choose-bera-bgt-symbol.svg"
                alt=""
                className="w-[240px] h-[32px] mx-auto"
              />
            ) : (
              <img
                src="/images/guiding-tour/choose-bera-bgt-symbol-name.svg"
                alt=""
                className="w-[202px] h-[26px] absolute left-1/2 -translate-x-1/2 bottom-[50px] md:static md:mx-auto md:translate-x-[0]"
              />
            )
          }
          <img
            src="/images/guiding-tour/choose-your-pill.svg"
            alt=""
            className="w-[472px] h-[59px] md:w-[350px] md:h-[44px] mx-auto"
          />
          <div
            className={clsx('absolute w-[149px] h-[149px] left-0 bottom-[-20px] cursor-pointer')}
            onMouseEnter={() => handleChoose('bera')}
          >
            <TokenBg visible={choosed === 'bera'} />
            <img
              src={choosed === 'bera' ? '/images/guiding-tour/choose-bera-active.svg' : '/images/guiding-tour/choose-bera.svg'}
              alt=""
              className={clsx(
                'transition-all duration-150 absolute left-[7px] bottom-[25px] z-[2] pointer-events-none',
                choosed === 'bera' ? 'w-[150px] h-[92px]' : 'w-[144px] h-[88px]'
              )}
            />
            <AnimatePresence>
              {
                (choosed === 'bera' && !isMobile) && (
                  <motion.img
                    src="/images/guiding-tour/how-get-bera.svg"
                    alt=""
                    className="w-[175px] h-[198px] absolute right-0 bottom-[30px] translate-x-[calc(100%_+_8px)]"
                    {...VisibleAnimation}
                    onClick={handleHowGetBera}
                  />
                )
              }
            </AnimatePresence>
          </div>
          <div
            className={clsx('absolute w-[149px] h-[149px] right-0 bottom-[-20px] cursor-pointer')}
            onMouseEnter={() => handleChoose('bgt')}
          >
            <TokenBg visible={choosed === 'bgt'} />
            <img
              src={choosed === 'bgt' ? '/images/guiding-tour/choose-bgt-active.svg' : '/images/guiding-tour/choose-bgt.svg'}
              alt=""
              className={clsx(
                'transition-all duration-150 absolute right-[7px] bottom-[25px] z-[2] pointer-events-none',
                choosed === 'bgt' ? 'w-[152px] h-[90px]' : 'w-[145px] h-[85px]'
              )}
            />
            <AnimatePresence>
              {
                choosed === 'bgt' && !isMobile && (
                  <motion.img
                    src="/images/guiding-tour/how-get-bgt.svg"
                    alt=""
                    className="w-[172px] h-[274px] absolute left-0 bottom-0 translate-x-[calc(-100%_-_6px)]"
                    {...VisibleAnimation}
                  />
                )
              }
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {
            (choosed === 'bera' && isMobile) && (
              <motion.div
                key={1}
                className="px-[10px] pt-[20px]"
                {...VisibleAnimation}
              >
                <Title className="!font-CherryBomb text-center">
                  The $BERA token
                </Title>
                <ul className="mt-[10px] pl-[20px] flex flex-col gap-[10px] list-disc">
                  <li className="">
                    Used to pay for transaction fees on the blockchain
                  </li>
                  <li className="">
                    Staking for activating validator nodes
                  </li>
                </ul>
              </motion.div>
            )
          }
          {
            (choosed === 'bgt' && isMobile) && (
              <motion.div
                key={2}
                className="px-[10px] pt-[20px]"
                {...VisibleAnimation}
              >
                <Title className="!font-CherryBomb text-center">
                  The $BGT token
                </Title>
                <ul className="mt-[10px] pl-[20px] flex flex-col gap-[10px] list-disc">
                  <li className="">
                    Used to vote on governance proposals
                  </li>
                  <li className="">
                    Used to delegate to validators to boost
                  </li>
                  <li className="">
                    Can be burned 1:1 to <strong>$BERA</strong>
                  </li>
                  <li className="">
                    Holders earn fees from the default apps
                  </li>
                  <li className="">
                    Non-transferable
                  </li>
                  <li className="">
                    Can only be acquired by interacting with the ecosystem
                  </li>
                </ul>
              </motion.div>
            )
          }
        </AnimatePresence>
        <div className="flex justify-between items-center gap-[22px] md:gap-[10px] mt-[31px] md:px-[10px]">
          <Button
            className="flex-1"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            type={ButtonType.Primary}
            className="flex-1"
            onClick={() => {
              if (choosed === 'bera' && isMobile) {
                handleHowGetBera();
                return;
              }
              handlePrize(handleNext);
            }}
            loading={prizing}
            disabled={prizing}
          >
            {(choosed === 'bera' && isMobile) ? 'How to get $BERA?' : 'Next'}
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default ChoosePill;

const TokenBg = (props: any) => {
  const { visible } = props;

  return (
    <AnimatePresence mode="wait">
      {
        visible && (
          <motion.img
            src="/images/guiding-tour/choose-token-bg.svg"
            alt=""
            className="animate-rotate w-full h-full absolute left-0 bottom-0 z-[1] pointer-events-none"
            style={{
              animationDuration: '5s',
            }}
            {...VisibleAnimation}
          />
        )
      }
    </AnimatePresence>
  );
};

const VisibleAnimation = {
  variants: {
    visible: {
      opacity: 1,
    },
    invisible: {
      opacity: 0,
    }
  },
  initial: "invisible",
  exit: "invisible",
  animate: "visible",
};
