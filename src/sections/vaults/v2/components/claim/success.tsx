import Modal from '@/components/modal';
import Card from '@/components/card';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';

const ClaimSuccessModal = (props: any) => {
  const { className } = props;

  const {
    claimSuccessVisible,
    toggleClaimSuccessVisible,
    successReward,
  } = useVaultsV2Context();

  return (
    <Modal
      open={claimSuccessVisible}
      onClose={toggleClaimSuccessVisible}
      className={className}
    >
      <Card className="!rounded-[20px] !py-[50px] w-[354px] flex flex-col items-center gap-[30px]">
        <LazyImage src="/images/vaults/v2/claim-success.png" width={56} height={56} className="shrink-0" fallbackSrc="/assets/tokens/default_icon.png" />
        <div className="flex justify-center items-center gap-[9px] text-black text-right font-montserrat text-[20px] font-semibold leading-[20px]">
          <LazyImage
            src="/images/icon-coin.svg"
            width={26}
            height={26}
            className="shrink-0 rounded-full overflow-hidden"
            fallbackSrc="/assets/tokens/default_icon.png"
          />
          <div className="">
            {numberFormatter(successReward?.amount, 6, true, { isShort: true, isShortUppercase: true })} {successReward?.symbol} Claimed
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default ClaimSuccessModal;
