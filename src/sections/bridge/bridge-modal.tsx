import Modal from "@/components/modal";
import BridgeContent from "./content";

export default function BridgeModal({
  onCallback,
  onClose,
  open,
  defaultFromToken,
  defaultToToken
}: any) {
  return (
    <Modal
      onClose={onClose}
      open={open}
      closeIconClassName="right-[-10px] top-[-10px]"
    >
      <BridgeContent
        onCallback={onCallback}
        defaultFromToken={defaultFromToken}
        defaultToToken={defaultToToken}
        showRoute={true}
      />
    </Modal>
  );
}
