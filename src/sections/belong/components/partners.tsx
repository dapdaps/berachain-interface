import clsx from "clsx";
import BelongTitle from "./title";

const PARTNERS = [
  {
    key: 1,
    logo: "/images/belong/v2/logo-smlee.png",
    name: "sm:)ee",
  },
  {
    key: 2,
    logo: "/images/belong/v2/logo-infrared.png",
    name: "Infrared",
  },
  {
    key: 3,
    logo: "/images/belong/v2/logo-kodiak.png",
    name: "Kodiak",
  },
  {
    key: 4,
    logo: "/images/belong/v2/logo-beraborrow.png",
    name: "BeraBorrow",
  },
  {
    key: 5,
    logo: "/images/belong/v2/logo-dapdap.png",
    name: "DapDap",
  },
  {
    key: 6,
    logo: "/images/belong/v2/logo-steady-teddys.png",
    name: "Steady Teddys",
  },
];

const Partners = (props: any) => {
  const { className, style } = props;

  return (
    <div className={clsx("", className)} style={style}>
      <BelongTitle>
        Partners
      </BelongTitle>
      <div className="grid grid-cols-3 md:grid-cols-2 gap-[10px] mt-[54px] md:mt-[15px]">
        {
          PARTNERS.map((item) => {
            return (
              <img
                key={item.key}
                src={item.logo}
                alt={item.name}
                className="w-full h-[94px] md:h-[69px] object-contain object-center shrink-0 pointer-events-none"
              />
            );
          })
        }
      </div>
      <div className="text-center text-[#FFF5A9] font-Montserrat text-[16px] font-normal leading-[120%] mt-[53px]">
        More to come
      </div>
    </div>
  );
};

export default Partners;
