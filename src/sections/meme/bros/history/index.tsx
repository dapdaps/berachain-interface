import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import MemeRank from "../modals/meme-rank";
import HistoryUnstakeModal from "../modals/unstake-history";
import ClaimRewardsModal from "../modals/claim-rewards";
import WithdrawalModal from "../modals/withdrawal-panel";
import RulesModal from "../modals/rules";
import { useState } from "react";
import useHistoryRounds from "../hooks/use-history-data";
import useHistoryStakeData from "../hooks/use-history-unstake-data";
import useClaimData from "../hooks/use-claim-data";
import useHistoryWithdrawData from "../hooks/use-history-withdraw-data";

export default function Meme(props: any) {
  const isMobile = useIsMobile();
  const [modalType, setModalType] = useState(0);
  const [modalData, setModalData] = useState<any>();
  const { loading, rounds } = useHistoryRounds();
  const {
    loading: fetchingUserStakingData,
    data: userStakeData,
    onQuery: onQueryStakeData
  } = useHistoryStakeData(rounds);
  const {
    loading: fetchingClaim,
    data: claimData,
    onQuery: onQueryClaim
  } = useClaimData(rounds);
  const {
    loading: fetchingWithdarw,
    data: withdrawList,
    onQuery: onRefreshWithdrawData
  } = useHistoryWithdrawData(rounds);

  const onOpenModal = (type: any, data: any) => {
    setModalData(data);
    setModalType(type);
  };

  const params = {
    loading,
    rounds,
    fetchingUserStakingData,
    userStakeData,
    fetchingClaim,
    claimData,
    withdrawList,
    onRefreshWithdrawData
  };

  return (
    <>
      {isMobile ? (
        <Mobile {...props} {...params} onOpenModal={onOpenModal} />
      ) : (
        <Laptop {...props} {...params} onOpenModal={onOpenModal} />
      )}
      {modalType === 3 && (
        <HistoryUnstakeModal
          open={modalType === 3}
          data={modalData}
          userStakeData={userStakeData}
          onClose={() => {
            setModalType(0);
          }}
          onSuccess={() => {
            setModalType(0);
            onQueryStakeData();
          }}
        />
      )}
      {modalType === 2 && (
        <ClaimRewardsModal
          open={modalType === 2}
          data={modalData}
          onClose={() => {
            setModalType(0);
          }}
          onSuccess={() => {
            setModalType(0);
            onQueryClaim();
          }}
        />
      )}
      {modalType === 11 && (
        <MemeRank
          open={modalType === 11}
          onClose={() => {
            setModalType(0);
          }}
        />
      )}
      <RulesModal
        open={modalType === 7}
        onClose={() => {
          setModalType(0);
        }}
      />
      {modalType === 4 && (
        <WithdrawalModal
          open={modalType === 4}
          list={withdrawList}
          onSuccess={() => {
            onRefreshWithdrawData();
          }}
          onClose={() => {
            setModalType(0);
          }}
        />
      )}
    </>
  );
}
