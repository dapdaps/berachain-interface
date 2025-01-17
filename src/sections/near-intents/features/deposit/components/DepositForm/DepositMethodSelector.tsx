import clsx from "clsx"

type DepositMethod = "active" | "passive"

interface DepositMethodSelectorProps {
  selectedDepositOption: DepositMethod
  onSelectDepositOption: (method: DepositMethod) => void
}

export function DepositMethodSelector({
  selectedDepositOption,
  onSelectDepositOption,
}: DepositMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-Montserrat font-semibold text-sm text-[#8A8A8A]">Choose deposit method</div>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => onSelectDepositOption("passive")}
          className={clsx(
            "flex h-12 flex-1 items-center justify-center rounded-xl font-semibold font-Montserrat border border-black",
            selectedDepositOption === "passive"
              ? "bg-[#FFDC50] ring-inset"
              : "bg-white"
          )}
        >
          Exchange
        </button>

        <button
          type="button"
          onClick={() => onSelectDepositOption("active")}
          className={clsx(
            "flex h-12 flex-1 items-center justify-center rounded-xl font-semibold font-Montserrat border border-black",
            selectedDepositOption === "active"
              ? "bg-[#FFDC50]"
              : "bg-white"
          )}
        >
          Wallet
        </button>
      </div>
    </div>
  )
}
