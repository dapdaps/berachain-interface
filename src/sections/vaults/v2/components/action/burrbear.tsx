import AddLiquidity from "@/sections/pools/burrbear/add-liquidity";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { ACTION_TYPE } from "../../config";
import RemoveLiquidity from "@/sections/pools/burrbear/remove-liquidity";

export default function Burrbear() {
  const { currentRecord, actionType, toggleActionVisible } =
    useVaultsV2Context();

  return actionType.value === ACTION_TYPE.DEPOSIT ? (
    <AddLiquidity
      data={currentRecord}
      onSuccess={() => {
        toggleActionVisible({ visible: false });
      }}
    />
  ) : (
    <RemoveLiquidity
      data={currentRecord}
      onSuccess={() => {
        toggleActionVisible({ visible: false });
      }}
    />
  );
}
