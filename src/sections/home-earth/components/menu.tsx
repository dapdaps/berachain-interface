"use client";

import clsx from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_LIST = [
  {
    label: "Home",
    bg: "#FFDC50",
    href: "/",
    sort: 1
  },
  {
    label: "Bridge",
    bg: "#FFF5A9",
    href: "/bridge",
    sort: 2
  },
  {
    label: "Swap",
    bg: "#D8FF8D",
    href: "/super-swap",
    sort: 3
  },
  {
    label: "Stake",
    bg: "#FDA975",
    href: "/stake",
    sort: 4
  },
  {
    label: "Lend",
    bg: "#98F6CD",
    href: "/lend",
    sort: 5
  },
  {
    label: "Vaults",
    bg: "#F3BBAB",
    href: "/vaults",
    sort: 6
  },
  {
    label: "Tokens",
    bg: "#C0FF96",
    href: "/tokens",
    sort: 7
  },
  {
    label: "Portfolio",
    bg: "#FFF5A9",
    href: "/portfolio",
    sort: 8
  },
  {
    label: "Boost",
    bg: "#DAA56B",
    href: "/validators",
    sort: 9
  }
];

const NavigationMenu = (props: any) => {
  const { className } = props;

  const pathname = usePathname();
  const isSmall = ["/bintent"].includes(pathname);
  const isHide = ["/belong"].includes(pathname);

  if (isHide) {
    return null;
  }

  return (
    <div
      className={clsx(
        "fixed z-[51] top-[150px] flex flex-col gap-[10px] items-end",
        isSmall ? "right-[-20px]" : "right-0",
        className
      )}
    >
      {
        MENU_LIST.sort((a, b) => a.sort - b.sort).map((menu, index) => (
          <motion.div
            initial={{ x: 20 }}
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Link
              key={index}
              href={menu.href}
              prefetch={true}
              className="rounded-[12px] rounded-r-[0] border border-black w-[110px] shrink-0 flex items-center shadow-[2px_2px_0px_0px_#000] text-black text-center font-CherryBomb text-base font-normal leading-none py-2 px-4"
              style={{
                background: menu.bg,
              }}
            >
              {menu.label}
            </Link>
          </motion.div>
        ))
      }
    </div>
  );
};

export default NavigationMenu;
