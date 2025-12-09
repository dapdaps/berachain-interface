import { balanceFormated } from '@/utils/balance';
import Big from 'big.js';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { TOKEN_MAP } from '../config';

interface SuccessOpenProps {
  visible?: boolean;
  onClose?: () => void;
  data?: any;
}

export default function SuccessOpen({ visible = false, onClose, data }: SuccessOpenProps) {
  if (!visible || !data) return null;

  const rewardType = useMemo(() => {
    return data?.rewardType;
  }, [data]);

  const rewardAmount = useMemo(() => {
    if (rewardType === 0) {
      return balanceFormated(new Big(data?.rewardAmount?.toString() || 0).div(10 ** 18).toFixed(18), 4);
    }

    if (rewardType === 1) {
      return '1'
    }

    return '0'
  }, [data]);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full z-[100] bg-[#00000080]"
      onClick={onClose}
    >
        <div 
          className="absolute w-[700px] h-[700px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
        >
            <motion.img 
              src="/images/gacha/ball-light.png" 
              className="absolute left-0 top-0 w-full h-full z-[1]"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <img src="/images/gacha/ball-bottom-back.png" className="absolute left-1/2 -translate-x-1/2 bottom-[69px] w-[365px] h-[265px] z-[1]" />
            <motion.img 
              src="/images/gacha/ball-top.png" 
              className="absolute left-[185px] bottom-[379px] w-[329px] h-[257px] z-[2]"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.img 
              src="/images/gacha/ball-inner.png" 
              className="absolute left-[215px] bottom-[199px] w-[269px] h-[255px] z-[2]"
              animate={{ 
                y: [-30, 30, -30, 30, -30, 30, -30, 30, -30],
                rotateY: [0, 0, 0, 0, 0, 0, 0, 0, 90]
              }}
              transition={{ 
                duration: 5,
                times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className='absolute z-[2] top-[150px] left-[200px] text-center w-[300px]'
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 5, duration: 0.5, ease: "easeOut" }}
            >
                <div 
                  className='text-[36px] font-CherryBomb font-bold text-[#FDD54C]'
                  style={{
                    textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, 4px 4px 8px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Good Luck!
                </div>
                <div className='text-[16px] font-medium text-white mt-[10px]'>You've received</div>
                <motion.div 
                  className='text-[46px] font-CherryBomb text-[#FDD54C] mt-[-10px]'
                  style={{
                    textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, 4px 4px 8px rgba(0, 0, 0, 0.5)'
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ delay: 5.5, duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {rewardAmount} {rewardType === 0 ? "BERA" : "NFT"}
                </motion.div>
                <img src={TOKEN_MAP[data?.rewardToken?.toLowerCase()]} className='w-[160px] h-[160px] border-[6px] border-[#FFC551] rounded-full object-center object-contain shrink-0 mx-auto' />
            </motion.div>


            <img src="/images/gacha/ball-bottom-front.png" className="absolute left-1/2 -translate-x-1/2 bottom-[100px] w-[365px] h-[183px] z-[3]" />
        </div>
    </div>
  );
}