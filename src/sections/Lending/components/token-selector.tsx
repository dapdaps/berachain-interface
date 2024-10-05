import { motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import { numberFormatter } from '@/utils/number-formatter';
import { useRef } from 'react';

const TokenSelector = (props: Props) => {
  const { visible, tokens, selected, onSelect, onClose } = props;

  const modalRef = useRef<any>(null);

  const handleSelect = (token: any) => {
    if (token.address === selected.address) return;
    onSelect(token);
    onClose();
  };

  if (!visible) return null;

  return ReactDOM.createPortal((
    <div
      className="fixed z-[50] w-full h-full left-0 top-0 bg-[rgba(0,_0,_0,_.5)] backdrop-blur-md"
      onClick={(e) => {
        if (modalRef.current.contains(e.target)) {
          return;
        }
        onClose();
      }}
    >
      <div
        ref={modalRef}
        className="absolute p-[20px] w-[520px] h-[543px] rounded-[20px] bg-[#FFFDEB] border border-[#000] shadow-shadow1 z-[51] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        <div className="flex items-center gap-[21px]">
          <button type="button" onClick={onClose} className="font-[400] p-[2px_5px]">
            <svg
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="translate-y-[1px]"
            >
              <path d="M7 2L2.2 8L7 14" stroke="black" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </button>
          <div className="text-[20px] text-black font-[400] font-CherryBomb">Select Token</div>
        </div>
        <ul className="m-0 p-0 list-none mt-[25px]">
          {
            tokens.map((token: any, idx: number) => (
              <motion.li
                key={idx}
                className="flex justify-between items-center p-[11px] rounded-[10px] gap-1"
                style={{
                  background: selected.address === token.address ? '#F0EEDF' : '#FFFDEB',
                }}
                onClick={() => handleSelect(token)}
                whileHover={{
                  background: '#F0EEDF',
                }}
              >
                <div className="flex items-center gap-[12px]">
                  <img src={token.icon} alt="" width={30} height={30} />
                  <div className="leading-[90%]">
                    <div className="text-[16px] text-black font-[600]">{token.symbol}</div>
                    <div className="text-[10px] text-black font-[400] mt-[4px]">{token.name}</div>
                  </div>
                </div>
                <div className="text-black text-[16px] font-[600]">
                  {numberFormatter(token.balance, 2, true)}
                </div>
              </motion.li>
            ))
          }
        </ul>
      </div>
    </div>
  ), document.body);
};

export default TokenSelector;

interface Props {
  visible: boolean;
  tokens: any;
  selected: any;

  onClose(): void;

  onSelect(token: any): void;
}
