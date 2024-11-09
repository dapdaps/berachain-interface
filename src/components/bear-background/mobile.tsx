'use client';

import { motion } from 'framer-motion';
import { use, useEffect, useState } from 'react';
import clsx from 'clsx'
import { usePathname } from 'next/navigation';
const Clouds = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.screen.availWidth);
    }
  }, []);
  return (
    <>
      <motion.div
        initial={{
          x: screenWidth
        }}
        animate={{
          x: -screenWidth
        }}
        transition={{
          duration: 14,
          ease: 'linear',
          repeat: Infinity
        }}
        className='absolute top-[109px] '
      >
        <svg
          width='204'
          height='102'
          viewBox='0 0 204 102'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M28.1442 80.5126C26.3502 80.9725 24.4698 81.217 22.5324 81.217C10.0881 81.217 0 71.1289 0 58.6847C0 46.2404 10.0881 36.1523 22.5324 36.1523C28.2279 36.1523 33.4299 38.2655 37.397 41.7506C37.3951 41.6426 37.3941 41.5343 37.3941 41.4258C37.3941 31.6292 45.3358 23.6875 55.1324 23.6875C61.0179 23.6875 66.2339 26.5539 69.4607 30.9669C72.578 13.8639 92.4489 0.675781 116.497 0.675781C142.014 0.675781 162.827 15.5238 163.914 34.1418C167.544 32.3592 171.627 31.3582 175.944 31.3582C191.036 31.3582 203.271 43.5926 203.271 58.6846C203.271 73.7766 191.036 86.0111 175.944 86.0111C172.11 86.0111 168.461 85.2217 165.15 83.7964C153.103 94.189 127.686 101.352 98.2795 101.352C65.8669 101.352 38.3013 92.6498 28.1442 80.5126Z'
            fill='#F7F9EA'
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{
          x: window?.screen?.availWidth
        }}
        animate={{
          x: -window?.screen?.availWidth
        }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
          delay: 10
        }}
        className='absolute top-[200px]'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='51'
          height='30'
          viewBox='0 0 51 30'
          fill='none'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9.10562 11.3949C9.95726 4.97253 15.8532 0 23 0C29.5126 0 34.9865 4.12925 36.5511 9.72206C38.1861 8.0429 40.4712 7 43 7C47.9705 7 52 11.0294 52 16C52 18.9403 50.59 21.5512 48.4094 23.1936C44.8506 27.1703 35.7121 30 25 30C11.1929 30 -3.05176e-05 25.299 -3.05176e-05 19.5C-3.05176e-05 16.2365 3.54485 13.3208 9.10562 11.3949Z'
            fill='#F7F9EA'
          />
        </svg>
      </motion.div>
    </>
  );
};

export default function Mobile({ children, showGrassland = false }: any) {

  const pathname = usePathname()
  const routes = ['/dapps', '/cave']

  return (
    <div className='relative hidden md:block min-w-full h-full'>
      {/* <Clouds /> */}
      {showGrassland && (
        <div className='bg-[#B6DF5D] h-[75.384vw] w-full absolute bottom-0 border-t border-[#4B371F]' />
      )}
      <div className={clsx('relative z-10 h-full', routes.includes(pathname) ? 'overflow-y-auto overflow-x-hidden' : '')}>{children}</div>
    </div>
  );
}
