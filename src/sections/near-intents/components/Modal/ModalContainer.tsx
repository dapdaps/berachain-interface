import { useModalStore } from "../../providers/ModalStoreProvider"

import { ModalType } from "../../stores/modalStore"

import { ModalSelectAssets } from "./ModalSelectAssets"
import ModalReviewDeposit from "./ModalReviewDeposit"
import ModalReviewWithdraw from "./ModalReviewWithdraw"


export const ModalContainer = () => {
  const { modalType } = useModalStore((state) => state)

  switch (modalType) {
    case ModalType.MODAL_SELECT_ASSETS:
      return <ModalSelectAssets />
    case ModalType.MODAL_REVIEW_DEPOSIT:
      return <ModalReviewDeposit />
    case ModalType.MODAL_REVIEW_WITHDRAW:
      return <ModalReviewWithdraw />
    default:
      return null
  }
}
