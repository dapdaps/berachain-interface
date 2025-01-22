import { ChevronDownIcon } from "@radix-ui/react-icons"
import * as RadixSelect from "@radix-ui/react-select"
import { Theme } from "@radix-ui/themes"
import { useMemo, type ReactNode } from "react"

type Props<T extends string> = {
  name: string
  options: {
    [key in T extends string ? T : never]: {
      label: string
      icon: ReactNode
      value: string 
      key?: string
    }
  }
  placeholder: { label: string; icon: ReactNode }
  label?: string
  disabled?: boolean
  value?: string
  hint?: ReactNode
  portalContainer?: HTMLElement
  onChange?: (value: string) => void
  selectedOption?: {
    label: string;
    icon: ReactNode;
    value: string;
  } | null;
}

export function Select<T extends string>({
  name,
  options,
  placeholder,
  label,
  disabled,
  value,
  hint,
  onChange,
  portalContainer,
  selectedOption,
}: Props<T>) {

  return (
    <RadixSelect.Root
      onValueChange={onChange}
      value={value}
      name={name}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        className="h-[50px] bg-white gap-3 border border-[#373A53] p-2.5 rounded-lg bg-gray-3 text-gray-12 leading-6 ring-accent-9 ring-inset transition-all duration-100 ease-in-out hover:bg-gray-4 data-[state=open]:bg-gray-4 data-[state=open]:ring-2 outline-none focus:outline-none"
        aria-label={label ?? "Not specified"}
        disabled={disabled}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="hidden items-center gap-2 [[data-placeholder]_&]:flex">
            {placeholder?.icon && <div>{placeholder.icon}</div>}
            <div className="font-medium text-gray-11 text-sm">
              {placeholder?.label}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-between [[data-placeholder]_&]:hidden">
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption ? (
                <div className="flex items-center gap-2">
                  {selectedOption.icon}
                  {selectedOption.label}
                </div>
              ) : (
                <RadixSelect.Value />
              )}
            </div>
            {hint != null ? hint : null}
          </div>

          {Object.keys(options).length > 1 ? (
            <RadixSelect.Icon>
              <ChevronDownIcon className="size-7" />
            </RadixSelect.Icon>
          ) : null}
        </div>
      </RadixSelect.Trigger>

      <RadixSelect.Portal container={portalContainer}>
        <RadixSelect.Content
          className="border border-[#373A53] max-h-[400px] w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] overflow-y-scroll rounded-md z-[9999] bg-[#FFFDEB]"
          position="popper"
          side="bottom"
          align="start"
          sideOffset={4}
          alignOffset={0}
          avoidCollisions={false}
        >
            <RadixSelect.Viewport className="flex flex-col gap-1 p-2">
              {Object.keys(options).map((key: string) => (
                <SelectItem
                  key={key}
                  value={options[key as keyof typeof options].value}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    {options[key as keyof typeof options]?.icon && (
                      <>
                        {options[key as keyof typeof options].icon}
                      </>
                    )}
                    <div>{options[key as keyof typeof options].label}</div>
                  </div>
                </SelectItem>
              ))}
            </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

interface SelectItemProps {
  value: string
  children: ReactNode
}

function SelectItem({ value, children }: SelectItemProps) {
  return (
    <RadixSelect.Item
      className="relative flex w-full select-none items-center justify-between gap-3 self-stretch rounded-md p-2 font-bold text-gray-12 text-sm data-[disabled]:pointer-events-none data-[highlighted]:bg-black data-[highlighted]:bg-opacity-5 data-[state=checked]:bg-black data-[state=checked]:bg-opacity-5 data-[disabled]:text-[#57534e] data-[highlighted]:outline-none hover:cursor-pointer"
      value={value}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  )
}

Select.Hint = function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="rounded bg-gray-a3 px-2 py-1 font-medium text-gray-a11 text-xs">
      {children}
    </div>
  )
}
