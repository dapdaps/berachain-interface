import { memo, useEffect } from "react";

import {
  StyledNetworkDelay,
  StyledRpcContainer,
  StyledRpcItem,
  StyledRpcList,
  StyledRpcListDesc,
  StyledRpcRadio
} from "./styles";
import { renderPing, renderPingConfig } from "@/utils/rpc";
import { useRpc } from "@/hooks/use-rpc";
import { useRpcStore } from "@/stores/rpc";
import { RPC_LIST } from "@/configs/rpc";

const RpcList = (props: Props) => {
  const list = Object.values(RPC_LIST);
  const keys = Object.keys(RPC_LIST) as any[];
  const rpcStore = useRpcStore();
  const { pingList, getPingList } = useRpc();

  const handleSelected = (rpc: any) => {
    if (rpc === rpcStore.selected) return;
    rpcStore.setSelected(rpc);
    rpcStore.setVisible(false);
    window.history.go(0);
  };

  useEffect(() => {
    getPingList();
  }, []);

  return (
    <StyledRpcContainer className="bg-[#FFFDEB] rounded-[8px] p-[20px]">
      <StyledRpcListDesc>
        Select the available RPC service below and the page will be
        automatically refreshed
      </StyledRpcListDesc>
      <StyledRpcList>
        {list.map((it: any, idx) => (
          <StyledRpcItem key={idx} onClick={() => handleSelected(keys[idx])}>
            {it.simpleName}
            <div className="flex gap-[10px] items-center">
              <StyledNetworkDelay
                $color={renderPingConfig(pingList[keys[idx]]).color}
              >
                {renderPing(pingList[keys[idx]])}
              </StyledNetworkDelay>
              <StyledRpcRadio $selected={rpcStore.selected === keys[idx]} />
            </div>
          </StyledRpcItem>
        ))}
      </StyledRpcList>
    </StyledRpcContainer>
  );
};

export default memo(RpcList);

export interface Props {}
