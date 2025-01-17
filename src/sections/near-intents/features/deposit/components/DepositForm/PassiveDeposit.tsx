import { CheckIcon } from "@radix-ui/react-icons"
import { Button, Spinner } from "@radix-ui/themes"
import { QRCodeSVG } from "qrcode.react"
import { Copy } from "../../../../components/IntentCard/CopyButton"
import type { BaseTokenInfo } from "../../../../types/base"
import type { BlockchainEnum } from "../../../../types/interfaces"
import { renderDepositHint } from "./renderDepositHint"
import Loading from "@/components/loading"

export type PassiveDepositProps = {
  network: BlockchainEnum
  depositAddress: string | null
  minDepositAmount: bigint | null
  token: BaseTokenInfo
}

export function PassiveDeposit({
  network,
  depositAddress,
  minDepositAmount,
  token,
}: PassiveDepositProps) {
  const truncatedAddress = truncateAddress(depositAddress ?? "")

  return (
    <div className="flex flex-col items-stretch">
      {/* <div className="font-bold text-label text-sm">
        Use this deposit address
      </div> */}
      <div className="mt-1 py-2.5 px-2 rounded-xl font-Montserrat font-[400] text-[12px] bg-[#FFDC50] bg-opacity-30 text-center">
         <span className="font-[600]">Always double-check your deposit address</span> <br/>- it may change without notice.
      </div>

      <div className="mt-[14px] flex items-center justify-center">
        <div className="flex size-36 items-center justify-center rounded-lg border border-black p-2 bg-white">
          {depositAddress != null ? (
            <QRCodeSVG value={depositAddress} />
          ) : (
            <Loading size={24} />
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-gray-3 px-4">
        <div className="flex justify-center">
          <span className="relative">
            {/* Visible truncated address */}
            <span className="pointer-events-none font-bold font-Montserrat text-sm">
              {truncatedAddress}
            </span>

            {/* Hidden full address for copy functionality */}
            <input
              type="text"
              value={depositAddress ?? ""}
              readOnly
              style={{
                // It's easier to make the input transparent using CSS instead of Tailwind
                all: "unset",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                color: "transparent",
              }}
            />
          </span>
        </div>
        <Copy text={depositAddress ?? ""}>
            {(copied) => (
              <Button
                type="button"
                size="4"
                variant="solid"
                className="box-border size-8 p-0"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            )}
          </Copy>
      </div>

      {renderDepositHint(network, minDepositAmount, token)}
    </div>
  )
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}


const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3469 12.596C13.512 12.7611 13.736 12.8538 13.9694 12.8538C14.6617 12.8523 15.3252 12.5766 15.8147 12.0871C16.3042 11.5976 16.5799 10.9341 16.5814 10.2419V2.61199C16.5799 1.91972 16.3042 1.25624 15.8147 0.766734C15.3252 0.277223 14.6617 0.00153804 13.9694 0H6.33958C5.64731 0.00153804 4.98383 0.277223 4.49432 0.766734C4.00481 1.25624 3.72912 1.91972 3.72758 2.61199C3.72758 2.84548 3.82033 3.06941 3.98544 3.23451C4.15054 3.39961 4.37446 3.49236 4.60795 3.49236C4.84144 3.49236 5.06536 3.39961 5.23047 3.23451C5.39557 3.06941 5.48832 2.84548 5.48832 2.61199C5.48832 2.38623 5.57801 2.16971 5.73765 2.01006C5.89729 1.85042 6.11381 1.76074 6.33958 1.76074H13.9694C14.1952 1.76074 14.4117 1.85042 14.5714 2.01006C14.731 2.16971 14.8207 2.38623 14.8207 2.61199V10.2419C14.8207 10.4676 14.731 10.6841 14.5714 10.8438C14.4117 11.0034 14.1952 11.0931 13.9694 11.0931C13.736 11.0931 13.512 11.1859 13.3469 11.351C13.1818 11.5161 13.0891 11.74 13.0891 11.9735C13.0891 12.207 13.1818 12.4309 13.3469 12.596ZM2.75873 16.6698H10.066C11.5927 16.6698 12.8539 15.4366 12.8247 13.9099V6.5735C12.8252 6.21109 12.7542 5.85215 12.6157 5.51724C12.4772 5.18233 12.274 4.87803 12.0178 4.62177C11.7615 4.3655 11.4572 4.16231 11.1223 4.02384C10.7874 3.88536 10.4284 3.81432 10.066 3.81478H2.75873C2.39622 3.81432 2.03718 3.8854 1.7022 4.02395C1.36721 4.1625 1.06285 4.36579 0.806576 4.62218C0.550299 4.87856 0.347134 5.183 0.208727 5.51805C0.07032 5.85309 -0.000609213 6.21216 3.94161e-06 6.57467V13.9111C-0.000455872 14.2735 0.0705866 14.6324 0.209062 14.9673C0.347538 15.3022 0.550727 15.6065 0.806989 15.8628C1.06325 16.1191 1.36755 16.3223 1.70246 16.4607C2.03738 16.5992 2.39632 16.6703 2.75873 16.6698ZM2.37553 5.64927C2.4971 5.5995 2.62737 5.57443 2.75873 5.57552H10.066C10.1974 5.57443 10.3276 5.5995 10.4492 5.64927C10.5708 5.69904 10.6812 5.77251 10.7741 5.8654C10.867 5.95829 10.9405 6.06874 10.9902 6.19031C11.04 6.31188 11.0651 6.44214 11.064 6.5735V13.9099C11.0651 14.0413 11.04 14.1715 10.9902 14.2931C10.9405 14.4147 10.867 14.5251 10.7741 14.618C10.6812 14.7109 10.5708 14.7844 10.4492 14.8341C10.3276 14.8839 10.1974 14.909 10.066 14.9079H2.75873C2.62737 14.909 2.4971 14.8839 2.37553 14.8341C2.25396 14.7844 2.14351 14.7109 2.05062 14.618C1.95773 14.5251 1.88426 14.4147 1.8345 14.2931C1.78473 14.1715 1.75966 14.0413 1.76074 13.9099V6.5735C1.75966 6.44214 1.78473 6.31188 1.8345 6.19031C1.88426 6.06874 1.95773 5.95829 2.05062 5.8654C2.14351 5.77251 2.25396 5.69904 2.37553 5.64927Z" fill="black"/>
  </svg>
)