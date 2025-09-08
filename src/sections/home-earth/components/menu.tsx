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
    label: "Carnival",
    bg: "#FF8284",
    href: "/carnival/lucky-bera",
    sort: 7,
    isBlink: true,
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
              className="relative rounded-[12px] rounded-r-[0] border border-black w-[110px] shrink-0 flex items-center shadow-[2px_2px_0px_0px_#000] text-black text-center font-CherryBomb text-base font-normal leading-none py-2 px-4"
              style={{
                background: menu.bg,
              }}
            >
              {menu.label}
              {
                menu.isBlink && (
                  <div className="absolute left-[0px] top-[0px] w-full h-full pointer-events-none">
                    <motion.img
                      src="/images/check-in/star.svg"
                      alt=""
                      className="w-[16px] h-[16px] object-center object-contain absolute left-[5px] top-[-8px]"
                      animate={{
                        transform: ["scale(1)", "scale(0.5)", "scale(1)"],
                        opacity: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 0,
                      }}
                    />
                    <motion.img
                      src="/images/check-in/star.svg"
                      alt=""
                      className="w-[24px] h-[24px] object-center object-contain absolute left-[60px] top-[-10px]"
                      animate={{
                        transform: ["scale(1)", "scale(0.8)", "scale(1)"],
                        opacity: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 0.2,
                      }}
                    />
                    <motion.img
                      src="/images/check-in/star.svg"
                      alt=""
                      className="w-[16px] h-[16px] object-center object-contain absolute left-[-2px] bottom-[-6px]"
                      animate={{
                        transform: ["scale(1)", "scale(0.7)", "scale(1)"],
                        opacity: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 0.15,
                      }}
                    />
                    <motion.img
                      src="/images/check-in/star.svg"
                      alt=""
                      className="w-[16px] h-[16px] object-center object-contain absolute left-[50px] bottom-[-8px]"
                      animate={{
                        transform: ["scale(1)", "scale(0.8)", "scale(1)"],
                        opacity: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 0.1,
                      }}
                    />
                  </div>
                )
              }
            </Link>
          </motion.div>
        ))
      }
    </div>
  );
};

export default NavigationMenu;
