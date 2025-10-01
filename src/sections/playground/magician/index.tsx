import { AnimatePresence } from "framer-motion";
import { useMagician } from "./hooks";
import { useCreate } from "./hooks/use-create";
import { useJoin } from "./hooks/use-join";
import List from "./sections/list";
import Join from "./sections/join";
import HistoryModal from "./sections/history";
import Notify from "./sections/notify";
import ClaimModal from "./sections/claim";
import { useClaim } from "./hooks/use-claim";
import Audios from "./sections/audios";

const Magician = () => {
  const magician = useMagician();
  const create = useCreate(magician);
  const join = useJoin(magician);
  const claim = useClaim(magician);

  return (
    <>
      <AnimatePresence>
        {
          join.open ? (
            <Join
              magician={magician}
              create={create}
              join={join}
              claim={claim}
            />
          ) : (
            <List
              magician={magician}
              create={create}
              join={join}
              claim={claim}
            />
          )
        }
      </AnimatePresence>
      <HistoryModal
        open={magician.historyOpen}
        onClose={() => {
          magician.setHistoryOpen(false);
        }}
      />
      <Notify
        open={true}
        betToken={magician.betToken}
        userLatest={magician.userLatest}
        userLatestLoading={magician.userLatestLoading}
        getUserLatest={magician.getUserLatest}
      />
      <ClaimModal
        account={magician.account}
        open={claim.claimData.open}
        room={claim.claimData.room}
        onClose={() => {
          claim.onClaimOpen(false);
        }}
        onClaim={claim.onClaim}
        claiming={claim.claiming}
      />
      <Audios audioRefs={magician.audioRefs} />
    </>
  );
};

export default Magician;
