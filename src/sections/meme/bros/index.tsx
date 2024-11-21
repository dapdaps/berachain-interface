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
import SwapModal from "@/sections/swap/SwapModal";
import { useState } from "react";
import useTokens from "./hooks/use-tokens";
import useWithdrawData from "./hooks/use-withdraw-data";
import useUserData from "./hooks/use-user-data";
import useTokensBalance from "@/hooks/use-tokens-balance";

export default function Meme(props: any) {
  const isMobile = useIsMobile();
  const [modalType, setModalType] = useState(0);
  const [modalData, setModalData] = useState<any>();
  const { loading, totalStaked, tokens, onQuery } = useTokens();
  const { list: withdrawList, onQuery: onRefreshWithdrawData } =
    useWithdrawData(tokens);
  const {
    loading: userDataLoading,
    userData,
    onQuery: onRefreshUserData
  } = useUserData(tokens);

  const {
    loading: balancesLoading,
    balances = {},
    queryBalance
  } = useTokensBalance(tokens);

  const onOpenModal = (type: any, data: any) => {
    setModalData(data);
    setModalType(type);
  };

  const params = {
    onOpenModal,
    tokens,
    loading,
    totalStaked,
    withdrawList,
    userData,
    balancesLoading,
    balances,
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

  return (
    <>
      {isMobile ? (
        <Mobile {...props} {...params} />
      ) : (
        <Laptop {...props} {...params} />
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

          <SwapModal
            defaultOutputCurrency={modalData}
            outputCurrencyReadonly={true}
            show={modalType === 8}
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
