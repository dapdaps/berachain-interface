import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import WithdrawalModal from "../modals/withdrawal-panel";
import StakeModal from "../modals/stake";
import UnstakeModal from "../modals/unstake";
import ClaimRewardsModal from "../modals/claim-rewards";
import IncentivesModal from "../modals/incentives";
import VoteModal from "../modals/vote/laptop";
import RulesModal from "../modals/rules";
import SwapModal from "@/sections/swap/SwapModal";
import MemeRank from "../modals/meme-rank";
import EndTips from "../modals/end-tips";
import { useEffect, useMemo, useState } from "react";
import useRound from "../hooks/use-round";
import useWithdrawData from "../hooks/use-withdraw-data";
import useUserData from "../hooks/use-user-data";
import useTokensBalance from "@/hooks/use-tokens-balance";
import useClaimData from "../hooks/use-claim-data";

export default function Meme(props: any) {
  const isMobile = useIsMobile();
  const [modalType, setModalType] = useState(0);
  const [modalData, setModalData] = useState<any>();
  const [innerModalType, setInnerModalType] = useState(0);
  const { loading, tokens, rewardTokens, info, onQuery } = useRound();
  const { list: withdrawList, onQuery: onRefreshWithdrawData } =
    useWithdrawData(tokens);
  const {
    loading: userDataLoading,
    userData,
    onQuery: onRefreshUserData
  } = useUserData(tokens);

  const rounds = useMemo(() => [props.round], [props.round]);
  const {
    loading: fetchingClaim,
    data: claimData,
    onQuery: onQueryClaim
  } = useClaimData(rounds);

  const balancesTokens = useMemo(
    () => tokens?.map((token: any) => token.token),
    [tokens]
  );

  const {
    loading: balancesLoading,
    balances = {},
    queryBalance
  } = useTokensBalance(balancesTokens);

  const onOpenModal = (type: any, data: any) => {
    if (type === 8) {
      setInnerModalType(1);
    } else {
      setModalType(type);
    }

    setModalData(data);
  };

  const params = {
    onOpenModal,
    tokens,
    loading,
    withdrawList,
    userData,
    balancesLoading,
    balances,
    info,
    rewardTokens,
    fetchingClaim,
    claimData,
    onRefreshTokens: () => {
      onQuery();
      onRefreshUserData();
      queryBalance();
    },
    onRefreshWithdrawData: () => {
      onRefreshWithdrawData();
      queryBalance();
    }
  };

  useEffect(() => {
    if (
      props.round.status === "ended" ||
      props.round.end_time < Date.now() / 1000
    ) {
      setModalType(10);
    }
  }, [props.round]);

  return (
    <>
      {isMobile ? (
        <Mobile {...props} {...params} />
      ) : (
        <Laptop {...props} {...params} />
      )}
      {!!modalData && modalType === 1 && (
        <StakeModal
          open={modalType === 1}
          data={modalData}
          userData={userData}
          onOpenModal={onOpenModal}
          onClose={() => {
            setModalType(0);
          }}
          onSuccess={() => {
            setModalType(0);
            onQuery();
            onRefreshUserData();
            queryBalance();
          }}
        />
      )}
      {!!modalData && modalType === 2 && (
        <UnstakeModal
          open={modalType === 2}
          data={modalData}
          userData={userData}
          onClose={() => {
            setModalType(0);
          }}
          onSuccess={() => {
            setModalType(0);
            onQuery();
            onRefreshUserData();
            queryBalance();
          }}
        />
      )}
      {modalType === 3 && (
        <ClaimRewardsModal
          open={modalType === 3}
          data={{ ...props.round, rewardTokens }}
          onClose={() => {
            setModalType(0);
          }}
          onSuccess={() => {
            setModalType(0);
            onQueryClaim();
          }}
        />
      )}
      {modalType === 4 && (
        <WithdrawalModal
          open={modalType === 4}
          list={withdrawList}
          onSuccess={() => {
            onRefreshWithdrawData();
            queryBalance();
          }}
          onClose={() => {
            setModalType(0);
          }}
        />
      )}
      {!!modalData && innerModalType === 1 && (
        <SwapModal
          defaultOutputCurrency={modalData}
          outputCurrencyReadonly={true}
          show={innerModalType === 1}
          onClose={() => {
            setInnerModalType(0);
          }}
        />
      )}
      {!!modalData && modalType === 5 && (
        <IncentivesModal
          open={modalType === 5}
          data={modalData}
          rewardTokens={rewardTokens}
          onOpenModal={onOpenModal}
          onClose={() => {
            setModalType(0);
          }}
        />
      )}
      {!!modalData && modalType === 6 && (
        <VoteModal
          open={modalType === 6}
          data={modalData}
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
      {modalType === 10 && (
        <EndTips
          open={modalType === 10}
          onOpenModal={onOpenModal}
          onClose={() => {
            setModalType(0);
          }}
        />
      )}
      {modalType === 11 && (
        <MemeRank
          open={modalType === 11}
          tokens={tokens}
          onClose={() => {
            setModalType(0);
          }}
        />
      )}
    </>
  );
}
