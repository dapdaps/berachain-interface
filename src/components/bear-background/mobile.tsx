'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
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
        className='absolute top-[109px] right-0'
      >
        <svg width="103" height="75" viewBox="0 0 103 75" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.0727 58.7755C19.7519 59.1141 18.3676 59.2941 16.9413 59.2941C7.77983 59.2941 0.353027 51.8673 0.353027 42.7059C0.353027 33.5445 7.77983 26.1176 16.9413 26.1176C21.1343 26.1176 24.964 27.6734 27.8846 30.2391C27.8832 30.1596 27.8824 30.0799 27.8824 30C27.8824 22.7878 33.7291 16.9412 40.9413 16.9412C45.2742 16.9412 49.1142 19.0514 51.4897 22.3003C53.7847 9.70909 68.4135 0 86.1177 0C104.903 0 120.226 10.931 121.026 24.6375C123.698 23.3252 126.704 22.5882 129.882 22.5882C140.993 22.5882 150 31.5952 150 42.7059C150 53.8166 140.993 62.8235 129.882 62.8235C127.06 62.8235 124.373 62.2423 121.936 61.1931C113.067 68.8441 94.3551 74.1176 72.706 74.1176C48.8439 74.1176 28.5502 67.7109 21.0727 58.7755Z" fill="#F7F9EA"/>
        </svg>
      </motion.div>
      <motion.div
        className='absolute top-[109px] z-[10] left-[-20px]'
      >
      <svg width="192" height="102" viewBox="0 0 192 102" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.1442 80.5131C14.3502 80.973 12.4698 81.2175 10.5324 81.2175C-1.91192 81.2175 -12 71.1294 -12 58.6851C-12 46.2409 -1.91192 36.1528 10.5324 36.1528C16.2279 36.1528 21.4299 38.266 25.397 41.7511C25.3951 41.6431 25.3941 41.5348 25.3941 41.4263C25.3941 31.6297 33.3358 23.688 43.1324 23.688C49.0179 23.688 54.2339 26.5544 57.4607 30.9674C60.578 13.8644 80.4489 0.67627 104.497 0.67627C130.014 0.67627 150.827 15.5243 151.914 34.1423C155.544 32.3597 159.627 31.3587 163.944 31.3587C179.036 31.3587 191.271 43.5931 191.271 58.6851C191.271 73.7771 179.036 86.0116 163.944 86.0116C160.11 86.0116 156.461 85.2221 153.15 83.7969C141.103 94.1895 115.686 101.353 86.2795 101.353C53.8669 101.353 26.3013 92.6503 16.1442 80.5131Z" fill="#F7F9EA"/>
      </svg>
      </motion.div>
    </>
  );
};

export default function Mobile({ children, showGrassland = false, type }: any) {

  const pathname = usePathname()
  const routes = ['/cave', '/']

  console.log('====type', type)
  return (
    <div className='relative hidden md:block w-full h-full'>
      <Clouds />
      {showGrassland && (
        <div className='bg-[#B6DF5D] h-[75.384vw] w-full absolute bottom-0 border-t border-[#4B371F]' />
      )}
      <div className={clsx('relative z-[10] h-full', routes.includes(pathname) ? 'scrollbar-hide h-dvh overflow-y-scroll overflow-x-hidden' : '')}>{children}</div>
    </div>
  );
}
