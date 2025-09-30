import { AnimatePresence } from "framer-motion";
import { useMagician } from "./hooks";
import { useCreate } from "./hooks/use-create";
import { useJoin } from "./hooks/use-join";
import List from "./sections/list";
import Join from "./sections/join";
import HistoryModal from "./sections/history";
import Notify from "./sections/notify";

const Magician = () => {
  const magician = useMagician();
  const create = useCreate(magician);
  const join = useJoin(magician);

  return (
    <>
      <AnimatePresence>
        {
          join.open ? (
            <Join
              magician={magician}
              create={create}
              join={join}
            />
          ) : (
            <List
              magician={magician}
              create={create}
              join={join}
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
      />
    </>
  );
};

export default Magician;
