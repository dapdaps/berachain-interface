import Modal from "@/components/modal";
import Card from "@/components/card";
import AirdropButton from "@/components/airdrop/components/button";
import AirdropReward from "@/components/airdrop/components/reward";
import clsx from "clsx";
import { useAirdrop } from "@/hooks/use-airdrop";
import ClaimCountDown from "./claim-count-down";
import useAirdropClaim from "@/hooks/use-airdrop-claim";
import CircleLoading from "../circle-loading";

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
    checkData,
    checked
  } = useAirdrop();
  const {
    claimed,
    endTime,
    loading: claimLoading,
    claiming,
    onClaim
  } = useAirdropClaim();

  return (
    <Modal
      open={visible}
      className=""
      onClose={() => {
        handleVisible(false);
      }}
      isMaskClose={false}
    >
      <Card
        className={clsx(
          "relative flex flex-col items-center w-[590px] !rounded-[20px] !p-[181px_20px_50px]",
          checked && checkData
            ? 'bg-[url("/images/home-earth/airdrop/reward-bg.svg")] bg-no-repeat bg-[center_bottom_-8px] bg-[338px+355px]'
            : ""
        )}
      >
        <img
          src="/images/home-earth/airdrop/entry.2x.png"
          alt=""
          className="w-[280px] h-[242px] absolute top-[-80px] pointer-events-none"
        />
        <div className="text-center text-black text-[26px] font-[700] leading-[90%]">
          Beratown Testnet Airdrop!
        </div>
        {/* <article className="mt-[23px] text-center text-black text-[16px] font-[500] leading-normal">
          This airdrop is converted by the items you earned during testnet.
          <strong className="uppercase">THERE WILL BE FUTURE AIRDROPS</strong>,
          Beracave will return thoon. Keep your eyes on Beratown socials for
          future updates 👀
        </article> */}
        <div className="w-[475px] m-[25px_40px_0px] bg-[rgba(0,_0,_0,_0.06)] backdrop-blur-[5px] rounded-[10px] p-[12px_28px_15px] flex flex-col justify-center items-center">
          <div className="text-[16px] font-bold text-center">Claim In</div>
          {claimLoading || !endTime ? (
            <div className="mt-[10px]">
              <CircleLoading size={20} />
            </div>
          ) : (
            <ClaimCountDown time={endTime} />
          )}
        </div>
        <div className="w-[475px] m-[14px_40px_0px] bg-[rgba(0,_0,_0,_0.06)] backdrop-blur-[5px] rounded-[10px] p-[28px_28px_31px] flex flex-col items-stretch gap-[13px]">
          <div className="w-full h-[54px] relative">
            <input
              type="text"
              className="w-full h-full border border-black bg-white rounded-[10px] text-[20px] text-black font-[600] leading-[90%] pl-[17px] pr-[30px]"
              placeholder="Enter wallet address"
              value={address}
              disabled={pending}
              onChange={(e) => handleAddress(e.target.value)}
            />
            {!!address && (
              <button
                type="button"
                className="flex justify-center items-center absolute top-1/2 -translate-y-1/2 right-[13px]"
                onClick={() => handleAddress("")}
              >
                <img
                  src="/images/home-earth/airdrop/icon-clear.svg"
                  alt=""
                  className="w-[20px] h-[20px] pointer-events-none"
                />
              </button>
            )}
          </div>
          {!!invalidMsg && (
            <div className="flex items-center justify-center text-[14px] text-black font-[600] leading-[90%] gap-[5px]">
              <img
                src="/images/home-earth/airdrop/icon-error.svg"
                alt=""
                className="w-[19px] h-[19px]"
              />
              <div>{invalidMsg}</div>
            </div>
          )}
          <AirdropButton
            disabled={!isValidAddress || pending}
            className="w-full"
            onClick={handleCheck}
            loading={pending}
          >
            Check Eligibility
          </AirdropButton>
        </div>
        {checked && (
          <AirdropReward
            className="mt-[24px]"
            data={checkData}
            claimed={claimed}
            claiming={claiming}
            onClaim={onClaim}
            endTime={endTime}
          />
        )}
      </Card>
    </Modal>
  );
};

export default AirdropModal;
