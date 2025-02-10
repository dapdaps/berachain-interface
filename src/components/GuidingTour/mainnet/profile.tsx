import Modal from '@/components/modal';
import Card from '@/components/GuidingTour/mainnet/components/card';
import { useGuidingTour } from '@/stores/useGuidingTour';
import Button, { ButtonType } from '@/components/GuidingTour/mainnet/components/button';

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
      <Card className="w-[680px] p-[76px_26px_53px]">
        <div className="flex justify-between items-end gap-[55px]">
          <img src="/images/guiding-tour/profile.png" alt="" className="shrink-0 w-[237px] h-[220px]" />
          <div className="flex-1">
            <div className="text-[24px] font-Montserrat font-[900] leading-[120%] text-black">
              Wut is Berachain?
            </div>
            <article className="text-[16px] font-Montserrat font-[500] text-black leading-[150%] mt-[26px]">
              <strong>Berachain</strong> is built different: a next-gen L1 that speaks Ethereum's language (EVM-identical) but packs a secret sauce called <strong>Proof-of-Liquidity</strong> (POL). This isn't just another chain - POL aligns everyone's incentives to pump both security and the app ecosystem. Plus, it has a bear on it.
            </article>
          </div>
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

export default Profile;
