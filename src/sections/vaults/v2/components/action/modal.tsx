import Modal from "@/components/modal";
import Index from "./index";
import KodiakUnstake from "./kodiak-unstake";
import Card from "@/components/card";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { ACTION_TYPE } from "../../config";

const ActionModal = (props: any) => {
  const { className } = props;

  const { actionVisible, toggleActionVisible, currentRecord, actionType } =
    useVaultsV2Context();

  return (
    <Modal
      open={actionVisible}
      onClose={toggleActionVisible}
      className={className}
    >
      <Card className="!rounded-[20px] w-[496px] md:w-full">
        {currentRecord?.protocol === "Kodiak" &&
        actionType.value === ACTION_TYPE.WITHDRAW ? (
          <KodiakUnstake />
        ) : (
          <Index />
        )}
      </Card>
    </Modal>
  );
};

export default ActionModal;
