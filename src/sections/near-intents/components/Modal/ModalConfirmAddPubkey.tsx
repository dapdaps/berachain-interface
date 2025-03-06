import { Button, Flex, Text } from "@radix-ui/themes"
import { useModalStore } from "../../providers/ModalStoreProvider"
import { ModalDialog } from "./ModalDialog"


export type ModalConfirmAddPubkeyPayload = {
  accountId: string
  onConfirm: () => void
  onAbort: () => void
}

export const ModalConfirmAddPubkey = () => {
  const { onCloseModal, payload } = useModalStore((state) => state)
  const { accountId, onConfirm, onAbort } =
    payload as ModalConfirmAddPubkeyPayload

  return (
    <ModalDialog
      isMaskClose={false}
      onClose={() => {
        onAbort()
      }}
    >
      <Flex className="p-5 flex-col gap-4">
        <Flex className="justify-center gap-4">
          <Text size="8" className="font-Montserrat">Confirm Your Account</Text>
        </Flex>

        <Text className="font-Montserrat">
          {/* biome-ignore lint/nursery/useConsistentCurlyBraces: space is needed here */}
          To verify your account (NEAR ID:{" "}
          <Text weight="bold" className="font-[700]">{accountId}</Text>), please send a one-time
          transaction.
        </Text>

        <Flex className="gap-4 justify-center">
          <Button
            color="gray"
            variant="outline"
             className="font-Montserrat p-2 rounded-xl"
            onClick={() => {
              // `onCloseModal` does not call `onClose` prop passed to `ModalDialog`, so we need to call abort manually
              onAbort()
              onCloseModal()
            }}
          >
            Cancel
          </Button>

          <Button
           className="font-Montserrat p-2 rounded-xl border border-[#4B371F] bg-[#FFDC50] text-[#4B371F]"
            onClick={() => {
              onConfirm()
            }}
          >
            Confirm Account
          </Button>
        </Flex>
      </Flex>
    </ModalDialog>
  )
}
