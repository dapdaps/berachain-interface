import Modal from "@/components/modal";
import Bg from "./bg";
import OpenStatus from "./open";

export default function BoxModal({
  open: show,
  onClose,
  remainBox,
  onOpen,
  data,
  loading
}: any) {
  return (
    <Modal
      open={show}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <Bg>
        <OpenStatus
          data={data}
          remainBox={remainBox}
          loading={loading}
          onClick={() => {
            if (remainBox > 0) {
              onOpen(false);
            } else {
              onClose();
            }
          }}
        />
      </Bg>
    </Modal>
  );
}
