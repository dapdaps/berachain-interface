import { useModalStore } from "../../providers/ModalStoreProvider"

import { ModalType } from "../../stores/modalStore"

import { ModalSelectAssets } from "./ModalSelectAssets"
import ModalReviewDeposit from "./ModalReviewDeposit"
import ModalReviewWithdraw from "./ModalReviewWithdraw"
import { ModalConfirmAddPubkey } from "./ModalConfirmAddPubkey"


export const ModalContainer = () => {
  const { modalType } = useModalStore((state) => state)

  switch (modalType) {
    case ModalType.MODAL_SELECT_ASSETS:
      return <ModalSelectAssets />
    case ModalType.MODAL_REVIEW_DEPOSIT:
      return <ModalReviewDeposit />
    case ModalType.MODAL_REVIEW_WITHDRAW:
      return <ModalReviewWithdraw />
      case ModalType.MODAL_CONFIRM_ADD_PUBKEY:
        return <ModalConfirmAddPubkey />
    default:
      return null
  }
}
