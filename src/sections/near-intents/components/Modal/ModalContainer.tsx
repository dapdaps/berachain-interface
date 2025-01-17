import { useModalStore } from "../../providers/ModalStoreProvider"

import { ModalType } from "../../stores/modalStore"

import { ModalSelectAssets } from "./ModalSelectAssets"
import ModalReviewDeposit from "./ModalReviewDeposit"


export const ModalContainer = () => {
  const { modalType } = useModalStore((state) => state)
  console.log(modalType, 'modalType')
  switch (modalType) {
    case ModalType.MODAL_SELECT_ASSETS:
      return <ModalSelectAssets />
    case ModalType.MODAL_REVIEW_DEPOSIT:
      return <ModalReviewDeposit />
    default:
      return null
  }
}
