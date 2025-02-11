import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';
import { motion } from 'framer-motion';

const ChoosePill = (props: any) => {
  const { onClose } = props;

  const { choosePillVisible, setChoosePillVisible, setProfileVisible, setGetBeraVisible } = useGuidingTour();

  const handleBack = () => {
    setChoosePillVisible(false);
    setProfileVisible(true);
  };

  const handleNext = () => {
    setChoosePillVisible(false);
    setGetBeraVisible(true);
  };

  return (
    <Modal
      open={choosePillVisible}
      onClose={onClose}
      isMaskClose={false}
    >
      <Card className="w-[680px] !bg-[unset] !border-0 !shadow-none">
        <div className="relative shrink-0 w-full h-[433px] bg-[url('/images/guiding-tour/choose-pill.png')] bg-no-repeat bg-center bg-cover">
          <motion.div
            className="bg-[url('/images/guiding-tour/choose-bera.svg')] transition-all duration-150 bg-no-repeat bg-cover bg-center w-[149px] h-[149px] absolute left-0 bottom-[-20px] cursor-pointer"
            variants={{
              hoverStart: {
                backgroundImage: 'url("/images/guiding-tour/choose-bera-active.svg")',
              },
            }}
            whileHover="hoverStart"
          >
            <motion.img
              src="/images/guiding-tour/how-get-bera.svg"
              alt=""
              className="w-[175px] h-[198px] absolute right-0 bottom-[30px] translate-x-[calc(100%_+_8px)] opacity-0 hidden"
              variants={{
                hoverStart: {
                  display: "block",
                  opacity: 1,
                }
              }}
            />
          </motion.div>
          <motion.div
            className="bg-[url('/images/guiding-tour/choose-bgt.svg')] transition-all duration-150 bg-no-repeat bg-cover bg-center w-[149px] h-[149px] absolute right-0 bottom-[-20px] cursor-pointer"
            variants={{
              hoverStart: {
                backgroundImage: 'url("/images/guiding-tour/choose-bgt-active.svg")',
              },
            }}
            whileHover="hoverStart"
          >
            <motion.img
              src="/images/guiding-tour/how-get-bgt.svg"
              alt=""
              className="w-[172px] h-[274px] absolute left-0 bottom-0 translate-x-[calc(-100%_-_6px)] opacity-0 hidden"
              variants={{
                hoverStart: {
                  display: "block",
                  opacity: 1,
                }
              }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between items-center gap-[22px] mt-[31px]">
          <Button
            className="flex-1"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            type={ButtonType.Primary}
            className="flex-1"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default ChoosePill;
