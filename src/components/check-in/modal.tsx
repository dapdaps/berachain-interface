import clsx from "clsx";
import Modal from "../modal";
import { useCheckIn } from "@/hooks/use-check-in";
import CheckIn from ".";
import CheckInRewardView from "./reward";

const CheckInModal = (props: any) => {
  const { className, open, onClose } = props;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeIconClassName="!right-[-14px] !top-[-8px]"
      >
        <div
          className={clsx(
            "w-[386px] md:w-fullrounded-[16px] border-2 border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)]",
            className
          )}
        >
          <Content />
        </div>
      </Modal>
    </>
  );
};

export default CheckInModal;

const Content = () => {
  const {
    openReward,
    rewardData,
    checkInData,
    checkInDataLoading,
    getCheckInData,
    onCheckIn,
    checkInPending,
    setOpenReward,
    setRewardData,
  } = useCheckIn();

  return (
    <>
      <CheckIn
        setOpenReward={setOpenReward}
        setRewardData={setRewardData}
        data={checkInData}
        loading={checkInDataLoading}
        getData={getCheckInData}
        onCheckIn={onCheckIn}
        checkInPending={checkInPending}
      />
      <CheckInRewardView
        open={openReward}
        onClose={() => {
          setOpenReward(false);
          setRewardData(void 0);
        }}
        data={rewardData}
      />
    </>
  );
};
