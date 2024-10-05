import { forwardRef } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  token: any;
}

const Action = forwardRef<HTMLDivElement, IProps>(({ isOpen, onClose, action, token }: IProps, ref) => {
  if (!isOpen) return null;
  const isDeposit = action === "deposit";
  const balance = isDeposit ? token.inWallet : token.deposited;
  const isDisabled = balance === 0;

  return (
    <div className={`absolute z-50 top-[40px]`} ref={ref}>
      <div className="w-[302px] h-[160px] bg-[#FFFDEB] shadow-shadow1 border border-black rounded-[20px] p-5">
        <h2 className="font-Montserrat text-base font-semibold leading-[14.4px] text-left mb-[18px]">
          {isDeposit ? "Deposit" : "Withdraw"}
        </h2>
        <input
          type="text"
          placeholder="Enter amount"
          className="w-full h-[40px] border border-[#373A53] rounded-[12px] px-3
                     font-Montserrat text-base font-semibold leading-[19.5px] text-left
                     placeholder-black placeholder-opacity-30
                     focus:outline-none focus:ring-2 focus:ring-[#373A53]"
        />
        <div className="flex justify-between items-center mt-3">
          <div className="font-Montserrat text-sm font-normal leading-[17px] text-left">
            {isDeposit ? "Balance: " : "Available: "}
            <span className="underline">
              {balance.toFixed(2)}
            </span>
          </div>
          <button
            className={`px-4 py-2 rounded-full font-Montserrat text-sm font-medium leading-[17.07px] text-center
                        bg-[#FFDC50] border border-black text-black
                        ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#FFD700]'}`}
            disabled={isDisabled}
            onClick={onClose}
          >
            {isDeposit ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default Action;
