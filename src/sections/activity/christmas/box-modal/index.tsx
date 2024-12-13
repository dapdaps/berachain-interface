import Modal from "@/components/modal";
import Bg from "./bg";
import CloseStatus from "./close";
import OpenStatus from "./open";
import { useState } from "react";
import useOpenBox from "../hooks/use-open-box";
import OpenModalYap from "./open-modal-yap";
import useIsMobile from "@/hooks/use-isMobile";

export default function BoxModal({
  open: show,
  onClose,
  remainBox,
  onSuccess
}: any) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>();
  const { loading, onOpen } = useOpenBox((args: any) => {
    setOpen(true);
    onSuccess();
    setData(args);
  });
  const isMobile = useIsMobile();

  const handleBoxOpen = () => {
    onOpen(false);
  };

  const handleClose = () => {
    setData(void 0);
    setOpen(false);
    onClose?.();
  };

  return data?.yap ? (
    <OpenModalYap
      isMobile={isMobile}
      open={show}
      onClose={handleClose}
      texts={[data.yap]}
    />
  ) : (
    <Modal
      open={show}
      onClose={handleClose}
      isForceNormal={isMobile}
      isMaskClose={!isMobile}
      className={isMobile ? "flex justify-center items-center" : ""}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <Bg>
        {!open ? (
          <CloseStatus
            box={remainBox}
            onOpen={handleBoxOpen}
            onClose={handleClose}
            loading={loading}
          />
        ) : (
          <OpenStatus
            data={data}
            remainBox={remainBox}
            loading={loading}
            onClick={() => {
              if (remainBox > 0) {
                handleBoxOpen();
              } else {
                handleClose();
              }
            }}
          />
        )}
      </Bg>
    </Modal>
  );
}
