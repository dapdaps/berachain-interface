import { useEffect } from "react";
import styled from "styled-components";

import RpcAlert from "./alert";
import RpcSelector from "./selector";
import { renderPing, renderPingConfig } from "@/utils/rpc";
import { useRpc } from "@/hooks/use-rpc";
import { useRpcStore } from "@/stores/rpc";
import useCustomAccount from "@/hooks/use-account";

const StyledRpcs = styled.div<{ $color?: string }>`
  position: fixed;
  z-index: 62;
  bottom: 30px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ $color }) => $color || "#57DB64"};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s linear;

  @media (max-width: 1394px) {
    bottom: 60px;
  }

  &:hover {
    opacity: 1;
  }

  &&::after {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    flex-shrink: 0;
    background: ${({ $color }) => $color || "#57DB64"};
    border-radius: 50%;
  }
`;

const Rpc = ({ className }: { className?: string }) => {
  const rpcStore = useRpcStore();
  const { account } = useCustomAccount();
  const { ping, getCurrentPing } = useRpc();

  const handleRpc = () => {
    rpcStore.setVisible(true);
  };

  useEffect(() => {
    getCurrentPing();
  }, []);

  return (
    account && (
      <div className="md:hidden">
        <StyledRpcs
          $color={renderPingConfig(ping).color}
          onClick={handleRpc}
          className={className}
        >
          {renderPing(ping)}
        </StyledRpcs>
        <RpcSelector
          visible={rpcStore.visible}
          onClose={() => {
            rpcStore.setVisible(false);
          }}
        />
        <RpcAlert visible={rpcStore.alert} />
      </div>
    )
  );
};

export default Rpc;
