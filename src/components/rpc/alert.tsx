import { memo } from "react";

import Modal from "@/components/modal";
import Button from "@/components/button";
import { StyledAlertText } from "./styles";
import { useRpcStore } from "@/stores/rpc";

const RpcAlert = (props: Props) => {
  const { visible } = props;

  const rpcStore = useRpcStore();

  const handleClose = () => {
    rpcStore.setAlert(false);
  };

  const handleSwitch = () => {
    rpcStore.setVisible(true);
    handleClose();
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="flex flex-col items-center gap-[22px] bg-[#FFFDEB] rounded-[8px] p-[20px]">
        <svg
          width="38"
          height="34"
          viewBox="0 0 38 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.9597 1.28906C17.7295 -0.0442715 19.654 -0.0442702 20.4238 1.28906L37.1125 30.1948C37.8823 31.5281 36.9201 33.1948 35.3805 33.1948H2.00298C0.463382 33.1948 -0.498867 31.5281 0.270933 30.1948L16.9597 1.28906ZM16.9018 14.3999C16.9018 13.4113 17.7033 12.6099 18.6919 12.6099C19.6805 12.6099 20.4819 13.4113 20.4819 14.3999V21.5601C20.4819 22.5487 19.6805 23.3501 18.6919 23.3501C17.7033 23.3501 16.9018 22.5487 16.9018 21.5601V14.3999ZM18.6919 25.1397C17.7033 25.1397 16.9018 25.9411 16.9018 26.9297C16.9018 27.9183 17.7033 28.7197 18.6919 28.7197C19.6805 28.7197 20.4819 27.9183 20.4819 26.9297C20.4819 25.9411 19.6805 25.1397 18.6919 25.1397Z"
            fill="#FF547D"
          />
        </svg>
        <StyledAlertText>
          <p>RPC Error!</p>
          <p>Click to switch to another node</p>
        </StyledAlertText>
        <Button
          className="w-[200px] h-[50px]"
          type="primary"
          onClick={handleSwitch}
        >
          Switch
        </Button>
      </div>
    </Modal>
  );
};

export default memo(RpcAlert);

export interface Props {
  visible: boolean;
}
