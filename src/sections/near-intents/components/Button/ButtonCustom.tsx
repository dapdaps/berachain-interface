import { ReloadIcon } from "@radix-ui/react-icons"
import { Button, type ButtonProps, Flex, Text } from "@radix-ui/themes"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import clsx from 'clsx'
import Loading from "@/components/loading"

interface ButtonCustomProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children?: ReactNode
  variant?: "primary" | "secondary" | "base" | "soft" | "solid"
  size?: "sm" | "base" | "lg"
  fullWidth?: boolean
  isLoading?: boolean
}

export const ButtonCustom = ({
  children,
  variant = "primary",
  size = "base",
  fullWidth,
  disabled,
  isLoading = false,
  ...rest
}: ButtonCustomProps) => {
  
  return (
      <Button
        disabled={disabled || isLoading}
        className={
          clsx({
            sm: "h-8",
            base: "h-10",
            lg: "h-14",
          }[size], 'bg-[#FFDC50] rounded-[10px] font-Montserrat font-[600] flex items-center gap-2 justify-center !border !border-black', fullWidth ? 'w-full' : '', {
            "opacity-30 cursor-not-allowed bg-[#FFDC50]": disabled || isLoading,
          })
        }
        style={{ border: '1px solid #000' }}
        {...rest}
      >
        {isLoading ? <Loading size={18}/> : null}
        <Text weight="bold">{children}</Text>
      </Button>
  )
}
