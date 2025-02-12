import Modal from '@/components/modal';
import Card from '@/components/card';
import AirdropButton from '@/components/airdrop/components/button';
import AirdropReward from '@/components/airdrop/components/reward';
import clsx from 'clsx';
import { useAirdrop } from '@/hooks/use-airdrop';

const AirdropModal = (props: any) => {
  const {} = props;

  const {
    handleVisible,
    visible,
    address,
    handleAddress,
    isValidAddress,
    pending,
    handleCheck,
    invalidMsg,
  } = useAirdrop();

  return (
    <Modal
      open={visible}
      className=""
      onClose={() => {
        handleVisible(false);
      }}
      isMaskClose={false}
    >
      <Card className={clsx(
        'relative flex flex-col items-center w-[554px] !rounded-[20px] !p-[181px_40px_50px]',
        'bg-[url("/images/home-earth/airdrop/reward-bg.svg")] bg-no-repeat bg-[center_bottom_-8px] bg-[338px+355px]'
      )}>
        <img
          src="/images/home-earth/airdrop/entry.2x.png"
          alt=""
          className="w-[280px] h-[242px] absolute top-[-80px] pointer-events-none"
        />
        <div className="text-center text-black text-[26px] font-[700] leading-[90%]">
          BeraTown Airdrop Now!
        </div>
        <article className="mt-[23px] text-center text-black text-[16px] font-[500] leading-normal">
          The airdrop is converted by the equipments you earned in BeraCave. <strong className="uppercase">Its not one-off airdrop</strong>, it will continue in the coming months. Please keep your eyes on BeraTown.
        </article>
        <div className="w-full mt-[25px] bg-[rgba(0,_0,_0,_0.06)] backdrop-blur-[5px] rounded-[10px] p-[28px_28px_31px] flex flex-col items-stretch gap-[13px]">
          <div className="w-full h-[54px] relative">
            <input
              type="text"
              className="w-full h-full border border-black bg-white rounded-[10px] text-[20px] text-black font-[600] leading-[90%] pl-[17px] pr-[30px]"
              placeholder="Enter wallet address"
              value={address}
              disabled={pending}
              onChange={(e) => handleAddress(e.target.value)}
            />
            {
              !!address && (
                <button
                  type="button"
                  className="flex justify-center items-center absolute top-1/2 -translate-y-1/2 right-[13px]"
                  onClick={() => handleAddress('')}
                >
                  <img
                    src="/images/home-earth/airdrop/icon-clear.svg"
                    alt=""
                    className="w-[20px] h-[20px] pointer-events-none"
                  />
                </button>
              )
            }
          </div>
          {
            !!invalidMsg && (
              <div className="flex items-center text-[12px] text-[#CE494D] font-[400] leading-[90%] gap-[5px]">
                <img src="/images/home-earth/airdrop/icon-error.svg" alt="" className="w-[11px] h-[11px]" />
                <div>{invalidMsg}</div>
              </div>
            )
          }
          <AirdropButton
            disabled={!isValidAddress || pending}
            className="w-full"
            onClick={handleCheck}
            loading={pending}
          >
            Check Eligibility
          </AirdropButton>
        </div>
        <AirdropReward className="mt-[55px]">
          12.322
        </AirdropReward>
      </Card>

    </Modal>
  );
};

export default AirdropModal;
