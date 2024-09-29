import { useEffect, useMemo } from 'react';
import { motion, useAnimate } from 'framer-motion';
import Loading from '../loading';

const ProgressColors: Record<string, string> = {
  success: '#7DF188',
  error: '#FF70A3',
  info: '',
  loading: '',
};

export default function Toast({ type, title, text, tx, closeToast, duration }: any) {
  const txLink = useMemo(() => {
    if (!tx) return '';
    return `https://bartio.beratrail.io/tx/${tx}`;
  }, [tx]);
  const [scope, animate] = useAnimate();

  const isIcon = useMemo(() => {
    return ['success', 'error', 'pending'].includes(type);
  }, [type]);

  useEffect(() => {
    if (!scope.current) return;
    animate(scope.current, {
      transform: [`translateX(0%)`, `translateX(${-100}%)`],
    }, {
      duration: duration / 1000,
      ease: 'linear',
      delay: 0.1,
    });
  }, []);

  return (
    <div className="p-[0_5px_10px]">
      <div
        className="bg-white border border-[#F0F0F0] rounded-[12px] p-[15px_39px_15px_15px] shadow-[0_5px_20px_0_rgba(0,_0,_0,_0.10)] relative"
      >
        <div className="flex items-start justify-start gap-[9px]">
          {
            isIcon && (
              <div className="shrink-0">
                {type === 'success' && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#7DF188" />
                    <path d="M6 9.5L9 12.5L14.5 7" stroke="black" strokeWidth="2" />
                  </svg>
                )}
                {type === 'error' && (
                  <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.49817 1C9.26797 -0.333334 11.1925 -0.333333 11.9623 1L20.1895 15.25C20.9593 16.5833 19.9971 18.25 18.4575 18.25H2.00298C0.463382 18.25 -0.498867 16.5833 0.270933 15.25L8.49817 1Z"
                      fill="#FF70A3"
                    />
                    <line x1="10.7305" y1="6" x2="10.7305" y2="12" stroke="black" strokeWidth="2" />
                    <line x1="10.7305" y1="13" x2="10.7305" y2="15" stroke="black" strokeWidth="2" />
                  </svg>
                )}
                {type === 'pending' && (
                  <div className="text-black">
                    <Loading size={20} />
                  </div>
                )}
              </div>
            )
          }
          <div className="text-[16px] font-normal text-black leading-[20px]">{title}</div>
        </div>
        <div className="flex flex-col gap-[5px] mt-[5px]">
          <div
            className="text-[16px] font-normal text-black"
            style={{ paddingLeft: isIcon ? 29 : 0 }}
          >
            {text}
          </div>
          {tx && (
            <div
              className="text-[16px] font-normal text-black underline cursor-pointer"
              style={{ paddingLeft: isIcon ? 29 : 0 }}
              onClick={() => {
                window.open(txLink, '_blank');
              }}
            >
              View Transaction
            </div>
          )}
        </div>
        <div
          className="shrink-0 cursor-pointer absolute right-[12px] top-[20px]"
          onClick={closeToast}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.28293 4.87503L9.5354 1.62257C9.77989 1.378 9.82165 1.02318 9.62868 0.830292L8.91952 0.121135C8.72655 -0.0718351 8.37222 -0.0295036 8.12724 0.214899L4.8751 3.46728L1.62272 0.21498C1.37815 -0.0298285 1.02333 -0.0718352 0.830361 0.121379L0.121204 0.830617C-0.071685 1.02326 -0.029922 1.37808 0.214968 1.62265L3.46743 4.87503L0.214968 8.12766C-0.0295158 8.37206 -0.0718475 8.72664 0.121204 8.91961L0.830361 9.62885C1.02333 9.82182 1.37815 9.77998 1.62272 9.53549L4.87527 6.28287L8.12733 9.53501C8.3723 9.78006 8.72663 9.82182 8.9196 9.62885L9.62876 8.91961C9.82165 8.72664 9.77989 8.37207 9.53548 8.12734L6.28293 4.87503Z"
              fill="black"
            />
          </svg>
        </div>
        {
          ProgressColors[type] && (
            <div className="w-[90%] h-[3px] absolute bottom-0 left-[14px] overflow-hidden">
              <motion.div
                ref={scope}
                role="progressbar"
                className="h-full w-full"
                initial={{
                  transform: `translateX(-100%)`,
                  background: ProgressColors[type],
                }}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}
