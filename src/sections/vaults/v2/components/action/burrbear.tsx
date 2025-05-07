import AddLiquidity from "@/sections/pools/burrbear/add-liquidity";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { ACTION_TYPE } from "../../config";
import RemoveLiquidity from "@/sections/pools/burrbear/remove-liquidity";
import { useMemo } from "react";

const POOLS_TYPE = {
  "0xbe09e71bdc7b8a50a05f7291920590505e3c7744": "ComposableStable"
};

export default function BurrBear() {
  const { currentProtocol, actionType, toggleActionVisible } =
    useVaultsV2Context();

  const record = useMemo(
    () => currentProtocol.vault_address,
    [currentProtocol]
  );

  return actionType.value === ACTION_TYPE.DEPOSIT ? (
    <AddLiquidity
      data={currentProtocol}
      onSuccess={() => {
        toggleActionVisible({ visible: false });
      }}
      showLabel={false}
      from="vaults"
    />
  ) : (
    <div className="mt-[10px]">
      <RemoveLiquidity
        data={currentProtocol}
        onSuccess={() => {
          toggleActionVisible({ visible: false });
        }}
        from="vaults"
      />
    </div>
  );
}
