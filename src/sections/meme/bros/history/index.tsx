import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import MemeRank from "../modals/meme-rank";
import UnstakeModal from "../modals/unstake";
import ClaimRewardsModal from "../modals/claim-rewards";
import RulesModal from "../modals/rules";
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
          <MemeRank
            open={modalType === 1}
            onClose={() => {
              setModalType(0);
            }}
          />
          <ClaimRewardsModal
            open={modalType === 2}
            onClose={() => {
              setModalType(0);
            }}
          />
          <UnstakeModal
            open={modalType === 3}
            onClose={() => {
              setModalType(0);
            }}
          />
        </>
      )}
      <RulesModal
        open={modalType === 4}
        onClose={() => {
          setModalType(0);
        }}
      />
    </>
  );
}
