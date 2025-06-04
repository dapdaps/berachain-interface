import clsx from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MENU_LIST = [
  {
    label: "Home",
    bg: "#FFDC50",
    href: "/"
  },
  {
    label: "Swap",
    bg: "#D8FF8D",
    href: "/swap"
  },
  {
    label: "Bridge",
    bg: "#FFF5A9",
    href: "/bridge"
  },
  {
    label: "Lending",
    bg: "#98F6CD",
    href: "/lending"
  },
  {
    label: "Vaults",
    bg: "#F3BBAB",
    href: "/vaults"
  },
  {
    label: "Tokens",
    bg: "#C0FF96",
    href: "/marketplace"
  },
  {
    label: "Portfolio",
    bg: "#FFF5A9",
    href: "/portfolio"
  }
];

const NavigationMenu = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx("fixed z-[51] right-0 top-[150px] flex flex-col gap-[10px] items-end", className)}>
      {
        MENU_LIST.map((menu, index) => (
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
