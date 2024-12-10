import Modal from "@/components/modal";
import Bg from "./bg";
import OpenStatus from "./open";
import OpenModalYap from "./open-modal-yap";
import useIsMobile from "@/hooks/use-isMobile";

export default function BoxModal({
  open: show,
  onClose,
  remainBox,
  onOpen,
  data,
  loading
}: any) {
  const isMobile = useIsMobile()
  return !!data?.yap ? (
    <OpenModalYap open={show} onClose={onClose} texts={[data.yap]} />
  ) : (
    <Modal
      open={show}
      onClose={onClose}
      isForceNormal={isMobile}
      className={isMobile ? "flex justify-center items-center" : ""}
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
