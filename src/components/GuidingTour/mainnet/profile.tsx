import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';
import Title from '@/components/GuidingTour/mainnet/components/title';
import Article from '@/components/GuidingTour/mainnet/components/article';

const Profile = (props: any) => {
  const { onClose } = props;

  const { profileVisible, setProfileVisible, setEntryVisible, setChoosePillVisible } = useGuidingTour();

  const handleBack = () => {
    setProfileVisible(false);
    setEntryVisible(true);
  };

  const handleNext = () => {
    setProfileVisible(false);
    setChoosePillVisible(true);
  };

  return (
    <Modal
      open={profileVisible}
      onClose={onClose}
      isMaskClose={false}
    >
      <Card className="w-[680px] md:w-full p-[76px_26px_53px] md:p-[40px_20px_30px]">
        <div className="flex justify-between items-end gap-[55px] md:flex-col-reverse md:items-center md:gap-[20px]">
          <img src="/images/guiding-tour/profile.png" alt="" className="shrink-0 w-[237px] h-[220px] md:w-[160px] md:h-[148px]" />
          <div className="flex-1">
            <Title className="">
              Wut is Berachain?
            </Title>
            <Article className="mt-[26px]">
              <strong>Berachain</strong> is built different: a next-gen L1 that speaks Ethereum's language (EVM-identical) but packs a secret sauce called <strong>Proof-of-Liquidity</strong> (POL). This isn't just another chain - POL aligns everyone's incentives to pump both security and the app ecosystem. Plus, it has a bear on it.
            </Article>
          </div>
        </div>
        <div className="flex justify-between items-center gap-[22px] md:gap-[10px] mt-[31px]">
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

export default Profile;
