import Modal from '@/components/modal';
import Card from '@/components/card';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import LazyImage from '@/components/layz-image';

const ClaimSuccessModal = (props: any) => {
  const { className } = props;

  const { claimSuccessVisible, toggleClaimSuccessVisible } = useVaultsV2Context();

  return (
    <Modal
      open={claimSuccessVisible}
      onClose={toggleClaimSuccessVisible}
      className={className}
    >
      <Card className="!rounded-[20px] !py-[50px] w-[354px] flex flex-col items-center gap-[30px]">
        <LazyImage src="/images/vaults/v2/claim-success.png" width={56} height={56} className="shrink-0" />
        <div className="flex justify-center items-center gap-[9px] text-black text-right font-montserrat text-[20px] font-semibold leading-[20px]">
          <LazyImage
            src="/images/icon-coin.svg"
            width={26}
            height={26}
            className="shrink-0 rounded-full overflow-hidden"
          />
          <div className="">
            0.45 BGT Claimed
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default ClaimSuccessModal;
