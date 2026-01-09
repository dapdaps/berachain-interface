import { balanceFormated } from '@/utils/balance';
import Big from 'big.js';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { playRewardSound } from '../sound';
import LightButton from '@/components/check-in/button';
import BearAmountTabs from './bear-amount-tabs';
import { on } from 'events';

interface SuccessOpenProps {
  visible?: boolean;
  onPlayAgain?: () => void;
  onClose?: () => void;
  data?: any;
  activeTabId?: any;
  setActiveTabId?: (tabId: any) => void;
  tokenMap?: Record<string, string>;
}

export default function SuccessOpen({ visible = false, onPlayAgain, onClose, data, activeTabId, setActiveTabId, tokenMap }: SuccessOpenProps) {
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

  const nftTokenId = useMemo(() => {
    return data?.rewardNftId?.toString();
  }, [data]);

  const [scale, setScale] = useState(1);
  const [needsScale, setNeedsScale] = useState(false);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        playRewardSound();
      }, 5000);
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const containerTotalHeight = 700 + 130 + 20 + 20; // 870px
      const topMargin = 20; 
      const bottomMargin = 20; 
      const availableHeight = viewportHeight - topMargin - bottomMargin;
      
      if (availableHeight < containerTotalHeight) {
        const newScale = availableHeight / containerTotalHeight;
        setScale(Math.max(newScale, 0.5));
        setNeedsScale(true);
      } else {
        setScale(1);
        setNeedsScale(false);
      }
    };

    if (visible) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [visible]);

  

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[100] bg-[#00000080] backdrop-blur-[20px]"
      // onClick={onClose}
    >
      <div
        className="absolute w-[700px] h-[700px] left-1/2"
        style={{
          ...(needsScale ? {
            top: '20px',
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'top center',
          } : {
            top: '50%',
            transform: `translate(-50%, -50%) translateY(-100px)`,
          }),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 cursor-pointer" onClick={onClose}>
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_1035_17884)">
              <circle cx="15" cy="15" r="13" fill="#E9E3B5" />
              <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" stroke-linejoin="round" />
            </g>
            <path d="M16.444 15L19.7799 11.6642C20.0307 11.4133 20.0735 11.0494 19.8756 10.8516L19.1482 10.1242C18.9503 9.92632 18.5869 9.96974 18.3356 10.2204L15.0001 13.5561L11.6643 10.2205C11.4135 9.96941 11.0496 9.92632 10.8517 10.1245L10.1243 10.8519C9.92648 11.0495 9.96931 11.4134 10.2205 11.6642L13.5563 15L10.2205 18.336C9.96973 18.5866 9.92631 18.9503 10.1243 19.1482L10.8517 19.8756C11.0496 20.0735 11.4135 20.0306 11.6643 19.7799L15.0003 16.4439L18.3357 19.7794C18.587 20.0307 18.9504 20.0735 19.1483 19.8756L19.8757 19.1482C20.0735 18.9503 20.0307 18.5866 19.78 18.3356L16.444 15Z" fill="black" />
            <defs>
              <filter id="filter0_d_1035_17884" x="0" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="3" dy="3" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1035_17884" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1035_17884" result="shape" />
              </filter>
            </defs>
          </svg>

        </div>
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
            {rewardAmount} {rewardType === 0 ? "BERA" : "NFT #" + nftTokenId}
          </motion.div>
          <img src={tokenMap?.[data?.rewardToken?.toLowerCase()] || '/assets/tokens/bera.svg'} className='w-[160px] h-[160px] border-[6px] border-[#FFC551] rounded-full object-center object-contain shrink-0 mx-auto' />
        </motion.div>

        <div className='absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[354px] z-[3]'>
          <BearAmountTabs activeTabId={activeTabId} setActiveTabId={(tabId) => {
            setActiveTabId?.(tabId)
            // onClose?.()
            // onPlayAgain?.()
          }} />
        </div>

        <div className="absolute bottom-[-130px] left-1/2 -translate-x-1/2 w-[354px] z-[3]">
          <LightButton className="w-full !h-[60px]" onClick={() => {
            onClose?.()
            onPlayAgain?.()
            
          }}>
            <div 
              className="text-[24px] font-CherryBomb font-[400] text-[#F7F9EA]"
              style={{
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -1px 0 0 #000, 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000'
              }}
            >
              Play Again
            </div>
          </LightButton>
          <div onClick={onClose} className="text-[16px] font-medium text-white mt-[20px] w-[100px] mx-auto text-center cursor-pointer">Go Back</div>
        </div>


        <img src="/images/gacha/ball-bottom-front.png" className="absolute left-1/2 -translate-x-1/2 bottom-[100px] w-[365px] h-[183px] z-[3]" />


      </div>
    </div>
  );
}