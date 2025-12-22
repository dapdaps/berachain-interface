import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_LIST = [
  {
    label: "Game",
    icon: "/images/home-earth/v3/icon-entry-game.png",
    link: "/",
    sort: 1,
    linkReg: /^\/$/,
  },
  {
    label: "Trade",
    icon: "/images/home-earth/v3/icon-entry-trade.png",
    link: "/trade",
    sort: 2,
    linkReg: /^\/trade/,
  },
  {
    label: "Explore",
    icon: "/images/home-earth/v3/icon-entry-explore.png",
    link: "/explore",
    sort: 3,
    linkReg: /^\/explore/,
  },
];

const MenuV3 = (props: any) => {
  const { className, isCursor = true } = props;

  const pathname = usePathname();

  const is2Top = ["/carnival/guess-who"].includes(pathname);

  return (
    <div
      className={clsx(
        "fixed z-[51] right-[10px] flex flex-col gap-[15px] items-end",
        is2Top ? "top-[220px]" : "top-[280px]",
        className
      )}
    >
      {
        MENU_LIST.sort((a, b) => a.sort - b.sort).map((menu, index) => (
          <Link
            key={index}
            href={menu.link}
            prefetch={true}
            className="group w-[82px] h-[62px] shrink-0 relative flex items-center"
          >
            <img
              src={menu.icon}
              alt=""
              className="w-full h-full object-center object-contain group-hover:scale-110 transition-all duration-150"
            />
            {
              isCursor && (
                <div
                  className={clsx(
                    "opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 w-[30px] h-[30px] z-[1] absolute left-[-25px] bg-no-repeat bg-center bg-contain bg-[url('/images/home-earth/v3/icon-entry-arrow.png')]",
                    menu.linkReg.test(pathname) ? "!opacity-100 !translate-x-0" : "opacity-0 translate-x-[-10px]",
                  )}
                />
              )
            }
          </Link>
        ))
      }
    </div>
  );
};

export default MenuV3;
