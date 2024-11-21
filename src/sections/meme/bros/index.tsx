import Laptop from "./main/laptop";
import Mobile from "./main/mobile";
import useIsMobile from "@/hooks/use-isMobile";
import WithdrawalModal from "./modals/withdrawal-panel";
import StakeModal from "./modals/stake";
import UnstakeModal from "./modals/unstake";
import ClaimRewardsModal from "./modals/claim-rewards";
import IncentivesModal from "./modals/incentives";
import VoteModal from "./modals/vote/laptop";
import RulesModal from "./modals/rules";
import { useState } from "react";

export default function Meme(props: any) {
  const isMobile = useIsMobile();
  const [modalType, setModalType] = useState(0);
  const [modalData, setModalData] = useState<any>();

  const onOpenModal = (type: any, data: any) => {
    setModalData(data);
    setModalType(type);
  };

  return (
    <>
      {isMobile ? (
        <Mobile {...props} onOpenModal={onOpenModal} />
      ) : (
        <Laptop {...props} onOpenModal={onOpenModal} />
      )}
      {modalData && (
        <>
          <StakeModal
            open={modalType === 1}
            onClose={() => {
              setModalType(0);
            }}
          />
          <UnstakeModal
            open={modalType === 2}
            onClose={() => {
              setModalType(0);
            }}
          />
          <ClaimRewardsModal
            open={modalType === 3}
            onClose={() => {
              setModalType(0);
            }}
          />

          <WithdrawalModal
            open={modalType === 4}
            onClose={() => {
              setModalType(0);
            }}
          />
        </>
      )}
      <IncentivesModal
        open={modalType === 5}
        onClose={() => {
          setModalType(0);
        }}
      />
      <VoteModal
        open={modalType === 6}
        onClose={() => {
          setModalType(0);
        }}
      />
      <RulesModal
        open={modalType === 7}
        onClose={() => {
          setModalType(0);
        }}
      />
    </>
  );
}
