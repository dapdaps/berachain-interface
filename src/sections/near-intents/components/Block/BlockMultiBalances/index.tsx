import { Flex, Text } from "@radix-ui/themes"
import clsx from "clsx"
import { formatTokenValue } from "../../../utils/format"

export interface BlockMultiBalancesProps {
  balance: bigint
  decimals: number
  handleClick?: () => void
  disabled?: boolean
  className?: string
  balanceStyleType?: IBalanceStyleType
}

type IBalanceStyleType = 'primary' | 'secondary'

const styleConfigs = {
  primary: {
    containerClassName: "font-Montserrat text-[12px] text-[#3D405A]",
    prefix: "balance:",
    showIcon: false
  },
  secondary: {
    containerClassName: "font-Montserrat text-[12px] text-[#3D405A] bg-[#FFDC50] bg-opacity-30 rounded-[47px] py-1 px-1.5 flex items-center gap-1",
    prefix: "",
    showIcon: true
  }
} as const

export const BlockMultiBalances = ({
  balance,
  decimals,
  handleClick,
  disabled,
  className,
  balanceStyleType = 'primary',
}: BlockMultiBalancesProps) => {
  const active = balance > 0n && !disabled
  const config = styleConfigs[balanceStyleType]

  const formattedBalance = formatTokenValue(balance, decimals, {
    min: 0.0001,
    fractionDigits: 4,
  })

  return (
    <Flex gap="1" asChild className={className}>
      <button 
        className={config.containerClassName}
        type="button" 
        onClick={handleClick} 
        disabled={!active}
      >
        {config.showIcon && <IconWallet />}
        {config.prefix}
        <Text size="1" className="font-Montserrat text-[12px] text-[#3D405A]">
          {formattedBalance}
        </Text>
      </button>
    </Flex>
  )
}

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
    <g clip-path="url(#clip0_0_615)">
    <path d="M9.53996 8.63002C9.53996 8.75669 9.5183 8.87502 9.47496 8.98502C9.43163 9.09502 9.36996 9.19169 9.28996 9.27502C9.20996 9.35836 9.11663 9.42336 9.00996 9.47002C8.9033 9.51669 8.78663 9.54002 8.65996 9.54002H1.39996C1.27329 9.54002 1.15329 9.51669 1.03996 9.47002C0.926628 9.42336 0.826628 9.35836 0.739961 9.27502C0.653294 9.19169 0.584961 9.09502 0.534961 8.98502C0.484961 8.87502 0.459961 8.75669 0.459961 8.63002V3.64002C0.459961 3.38669 0.548294 3.17169 0.724961 2.99502C0.901628 2.81836 1.11663 2.73002 1.36996 2.73002H8.62996C8.8833 2.73002 9.0983 2.81836 9.27496 2.99502C9.45163 3.17169 9.53996 3.38669 9.53996 3.64002V5.00002H7.26996C7.01663 5.00002 6.80163 5.08669 6.62496 5.26002C6.4483 5.43336 6.35996 5.64669 6.35996 5.90002C6.36663 6.07336 6.4033 6.22669 6.46996 6.36002C6.52329 6.47336 6.61163 6.57669 6.73496 6.67002C6.85829 6.76336 7.03663 6.81002 7.26996 6.81002H9.53996V8.63002ZM8.17996 2.27002H3.63996C3.99996 2.08336 4.33996 1.90336 4.65996 1.73002C4.93996 1.58336 5.21663 1.43669 5.48996 1.29002C5.7633 1.14336 5.97663 1.03002 6.12996 0.950023C6.36329 0.823357 6.57163 0.765023 6.75496 0.775023C6.93829 0.785023 7.0933 0.81669 7.21996 0.870023C7.36663 0.943357 7.49329 1.04002 7.59996 1.16002L8.17996 2.27002ZM6.81996 5.90002C6.81996 5.77336 6.86329 5.66669 6.94996 5.58002C7.03663 5.49336 7.14329 5.45002 7.26996 5.45002C7.39663 5.45002 7.50329 5.49336 7.58996 5.58002C7.67663 5.66669 7.71996 5.77336 7.71996 5.90002C7.71996 6.02669 7.67663 6.13502 7.58996 6.22502C7.50329 6.31502 7.39663 6.36002 7.26996 6.36002C7.14329 6.36002 7.03663 6.31502 6.94996 6.22502C6.86329 6.13502 6.81996 6.02669 6.81996 5.90002Z" fill="#3D405A"/>
    </g>
    <defs>
    <clipPath id="clip0_0_615">
    <rect width="10" height="10" fill="white"/>
    </clipPath>
    </defs>
    </svg>
)