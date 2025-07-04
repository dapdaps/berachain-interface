import { useStatus } from "../Hooks/Stargate/useStatus";
import List from "./list";
import Simple from "./simple";
import { useAccount } from "wagmi";
import useIsMobile from "@/hooks/use-isMobile";
import { getStatus } from "../lib/index";

export default function History({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { pendingCount, historyCount, list } = useStatus({
    getStatus: getStatus
  });
  const { address, chainId } = useAccount();
  const isMobile = useIsMobile();

  if (!address) {
    return null;
  }

  const cls = isMobile
    ? "m-auto mt-[10px] md:w-[92.307vw] border border-[#000] rounded-2xl bg-[#FFFDEB]"
    : "fixed bottom-[60px] w-[350px] left-4 z-50 border border-[#000] rounded-2xl bg-[#FFFDEB] lg:shadow-[10px_10px_0px_0px_#00000040] xl:left-auto xl:right-[110px]";

  return (
    <div className={cls}>
      {isOpen ? (
        <List
          setIsOpen={setIsOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={pendingCount}
          historyCount={historyCount}
          list={list}
        />
      ) : (
        <Simple
          setActiveTab={setActiveTab}
          setIsOpen={setIsOpen}
          pendingCount={pendingCount}
          historyCount={historyCount}
        />
      )}
    </div>
  );
}
