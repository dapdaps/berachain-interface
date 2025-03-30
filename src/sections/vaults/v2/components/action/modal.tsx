import Modal from "@/components/modal";
import Index from "./union";
import Card from "@/components/card";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";

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
      <Card className="rounded-[20px] !p-[46px_30px_54px] md:!p-[23px_15px_27px] w-[970px] md:w-full md:max-h-[80dvh] md:overflow-y-auto">
        <Index />
      </Card>
    </Modal>
  );
};

export default ActionModal;
