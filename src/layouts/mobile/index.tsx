'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IconMenu from '@public/images/mobile/menu.svg';
import IconClose from '@public/images/mobile/close.svg';
import MenuButton from '@/components/mobile/menuButton';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';



const menuItems = [
  { id: 1, title: 'Bridge', href: '/bridge' },
  { id: 2, title: 'DApps', hasDropdown: true },
  { id: 3, title: 'Marketplace', href: '/marketplace' },
  { id: 4, title: 'Vaults', href: '/bgt' },
  { id: 5, title: 'Dashboard', href: '/dashboard' },
  { id: 6, title: 'Bear Cave', href: '/cave' }
];

interface DApp {
  id: string;
  name: string;
  icon: string;
  href?: string;
}

const dapps: DApp[] = [
  {
    id: 'infrared',
    name: 'Infrared',
    icon: '/images/dapps/infrared.svg',
    href: '/liquidity/infrared'
  },
  { id: 'bex', name: 'Bex', icon: '/images/dapps/bex.png', href: '/dapp/bex' },
  {
    id: 'bend',
    name: 'Bend',
    icon: '/images/dapps/bend.svg',
    href: '/lending/bend'
  },
  {
    id: 'kodiak',
    name: 'Kodiak',
    icon: '/images/dapps/kodiak.svg',
    href: '/dex/kodiak'
  },
  {
    id: 'dolomite',
    name: 'Dolomite',
    icon: '/images/dapps/dolomite.svg',
    href: '/lending/dolomite'
  },
  {
    id: 'stargate',
    name: 'Stargate',
    icon: '/images/dapps/stargate.svg',
    href: '/bridge/stargate'
  },
  {
    id: 'ooga',
    name: 'Ooga Booga',
    icon: '/images/dapps/ooga-booga.svg',
    // href: '/dapp/ooga'
  }
];

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDappsOpen, setIsDappsOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDapps = () => setIsDappsOpen(!isDappsOpen);

  const DAppIcon: React.FC<{ dapp: DApp }> = ({ dapp }) => {
    if (dapp.href) {
      return (
        <Link href={dapp.href} className="flex flex-col items-center gap-1">
          <div className="w-[12.82vw] h-[12.82vw] rounded-[2.56vw] flex items-center justify-center">
            <Image src={dapp.icon} alt={dapp.name} className="w-[10.769vw] h-[10.769vw]" width={'42'} height={'42'}/>
          </div>
          <span className='font-CherryBomb text-base font-normal leading-[14.4px] text-center text-black'>
            {dapp.name}
          </span>
        </Link>
      )
    }
    return (
      <div className="flex flex-col items-center gap-1 blur-[2px]">
        <div className="w-[12.82vw] h-[12.82vw] rounded-[2.56vw] flex items-center justify-center">
          <Image src={dapp.icon} alt={dapp.name} className="w-[10.769vw] h-[10.769vw]" width={'42'} height={'42'}/>
        </div>
        <span className='font-CherryBomb text-base font-normal leading-[14.4px] text-center text-black'>
          {dapp.name}
        </span>
      </div>
    )
  };

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, setIsMenuOpen]);

  return (
    <div className='h-screen relative overflow-hidden'>
      <main className='h-full'>{children}</main>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed inset-0 bg-[#F6EFC8] flex flex-col items-center pt-12 pb-24 z-[99]'
          >
            <div className='w-full max-w-md flex justify-center items-center flex-col gap-4'>
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className='w-full flex justify-center items-center flex-col relative z-0'
                >
                  <MenuButton
                    href={item.href}
                    hasDropdown={item.hasDropdown}
                    isActive={item.hasDropdown && isDappsOpen}
                    onClick={item.hasDropdown ? toggleDapps : undefined}
                  >
                    {item.title}
                  </MenuButton>

                  <AnimatePresence>
                    {item.hasDropdown && isDappsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
                        exit={{ opacity: 0, height: 0 }}
                        className='w-full -mt-6 px-4 py-6 bg-[#D5CDA1] overflow-hidden z-[-1] pt-[13.84vw]'
                      >
                        <div className='grid grid-cols-4 gap-x-4 gap-y-6'>
                          {dapps.map((dapp) => (
                            <DAppIcon key={dapp.id} dapp={dapp} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-[#F6EFC8] z-[99]'>
        <img
          src='/images/mobile/town.png'
          alt='Town'
          className='w-[15.9vw] h-auto'
          onClick={() => router.push('/')}
        />
        <motion.button
          onClick={toggleMenu}
          whileTap={{ scale: 0.95 }}
          className='w-6 h-[4.6vw]'
        >
          {isMenuOpen ? (
            <IconClose className='w-full h-full' />
          ) : (
            <IconMenu className='w-full h-full' />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default MobileLayout;
