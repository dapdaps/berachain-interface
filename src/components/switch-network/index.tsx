'use client';

import { useAccount, useSwitchChain } from 'wagmi';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/button';
import Loading from '@/components/circle-loading';

const SwitchNetwork = (props: Props) => {
  const { targetChain } = props;

  const { chainId } = useAccount();
  const { isPending, switchChain } = useSwitchChain();

  const handleSwitch = () => {
    switchChain({ chainId: targetChain.id });
  };

  if (targetChain.id === chainId) return null;

  return ReactDOM.createPortal((
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed left-0 top-0 w-full h-full z-50 bg-[rgba(0,_0,_0,_.5)] flex justify-center items-center"
        variants={{
          visible: {
            opacity: 1,
          },
          hidden: {
            opacity: 0,
          },
        }}
        initial="hidden"
        exit="hidden"
        animate="visible"
      >
        <div className="w-[420px] h-[240px] rounded-[20px] bg-[#FFFDEB] border border-black shadow-shadow1 p-[25px_20px] flex flex-col items-center gap-[30px]">
          <div className="flex justify-center items-center gap-[10px]">
            <img src={targetChain.icon} alt="" className="w-[30px] h-[30px]" />
            <div className="text-[20px] font-[600]">{targetChain.name}</div>
          </div>
          <div className="text-[18px] font-[500]">
            Please connect to {targetChain.name}
          </div>
          <Button
            type="primary"
            onClick={handleSwitch}
            className="w-full h-[60px] mt-auto flex justify-center items-center"
          >
            {isPending ? <Loading size={20} /> : 'Switch Network'}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  ), document.body);
};

export default SwitchNetwork;

interface Props {
  targetChain: {
    id: number;
    name: string;
    icon: string;
  };
}
