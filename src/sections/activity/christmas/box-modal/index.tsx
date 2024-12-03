import Modal from "@/components/modal";
import Bg from "./bg";
import CloseStatus from "./close";
import OpenStatus from "./open";
import { useState } from "react";

export default function BoxModal() {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      open={true}
      onClose={() => {}}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <Bg>
        {!open ? (
          <CloseStatus
            onOpen={() => {
              setOpen(true);
            }}
          />
        ) : (
          <OpenStatus />
        )}
      </Bg>
    </Modal>
  );
}
