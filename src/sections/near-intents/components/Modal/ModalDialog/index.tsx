import Modal from "@/components/modal"
import {
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useModalStore } from "../../../providers/ModalStoreProvider"
import { WidgetContext } from "../../WidgetRoot"
import useIsMobile from "@/hooks/use-isMobile"
import Drawer from "@/components/drawer"

export const ModalDialog = ({
  children,
  onClose,
  isMaskClose=true,
}: PropsWithChildren<{
  onClose?: () => void
  isMaskClose?: boolean
}>) => {
  const { onCloseModal } = useModalStore((state) => state)
  const [open, setOpen] = useState(true)
  const divRef = useRef<HTMLDivElement>(null)
  const { portalContainer } = useContext(WidgetContext)

  const handleClose = () => {
    setOpen(false)
    onCloseModal()
    onClose?.()
  }

  const isMobile = useIsMobile()

  if (isMobile) {
    return <Drawer visible={open} onClose={handleClose} className="!bg-[#FFFDEB]">
      {children}
    </Drawer>
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      isMaskClose={isMaskClose}
      className="z-[60]"
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="bg-[#FFFDEB] border border-black shadow-shadow1 w-[364px] rounded-[30px]" ref={divRef}>
        {children}
      </div>
    </Modal>
  )
}
