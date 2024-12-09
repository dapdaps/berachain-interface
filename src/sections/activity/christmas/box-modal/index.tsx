import Modal from "@/components/modal";
import Bg from "./bg";
import CloseStatus from "./close";
import OpenStatus from "./open";
import { useState } from "react";
import useOpenBox from "../hooks/use-open-box";
import OpenModalYap from "./open-modal-yap";

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

  return data?.yap ? (
    <OpenModalYap open={show} onClose={onClose} texts={[data.yap]} />
  ) : (
    <Modal
      open={show}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <Bg>
        {!open ? (
          <CloseStatus
            box={remainBox}
            onOpen={() => {
              onOpen(false);
            }}
            onClose={onClose}
            loading={loading}
          />
        ) : (
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
        )}
      </Bg>
    </Modal>
  );
}
