import Modal from "@/components/modal";
import Index from "./index";
import Card from "@/components/card";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";

const StrategyModal = (props: any) => {
  const { className, pool } = props;

  const { strategyVisible, toggleStrategyVisible } = useVaultsV2Context();

  return (
    <Modal
      open={strategyVisible}
      onClose={toggleStrategyVisible}
      className={className}
    >
      <Card className="!rounded-[20px] w-[473px] md:w-full !p-0">
        <Index pool={pool} />
      </Card>
    </Modal>
  );
};

export default StrategyModal;
