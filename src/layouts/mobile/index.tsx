import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IconMenu from '@public/images/mobile/menu.svg';
import IconClose from '@public/images/mobile/close.svg';
import MenuButton from '@/components/mobile/menuButton';

const menuItems = [
  { id: 1, title: 'Bridge' },
  { id: 2, title: 'DApps' },
  { id: 3, title: 'Marketplace' },
  { id: 4, title: 'Vaults' },
  { id: 5, title: 'Dashboard' },
  { id: 6, title: 'Bear Cave' }
];

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#F7EED4] flex flex-col">

      <main className="flex-1">
        {children}
      </main>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-[#F6EFC8] z-40 flex flex-col items-center pt-12 pb-24"
          >
            <div className="w-full max-w-md px-6 flex flex-col gap-4 items-center">
              {menuItems.map((item) => (
                <MenuButton
                  key={item.id}
                  className="w-full text-left text-xl font-bold py-3"
                  hasDropdown={item.title === 'DApps'}
                >
                  {item.title}
                </MenuButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-[#F6EFC8] z-50">
        <img
          src="/images/mobile/town.png"
          alt="Town"
          className="w-[15.9vw] h-auto"
        />
        <motion.button
          onClick={toggleMenu}
          whileTap={{ scale: 0.95 }}
          className="w-6 h-[4.6vw]"
        >
          {isMenuOpen ? <IconClose className="w-full h-full" /> : <IconMenu className="w-full h-full" />}
        </motion.button>
      </div>
    </div>
  );
};

export default MobileLayout;