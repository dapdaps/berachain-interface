import clsx from "clsx";
import { numberFormatter } from "@/utils/number-formatter";
import * as dateFns from "date-fns";
import { useRouter } from "next/navigation";
import { useBera } from '@/sections/ramen/hooks/use-bera';
import Big from 'big.js';
import Avatar from '@/sections/ramen/components/item/avatar';
import useIsMobile from '@/hooks/use-isMobile';
import ItemMobile from '@/sections/ramen/components/item/mobile';
import TotalRaised from '@/sections/ramen/components/item/total-raised';
import SalePrice from '@/sections/ramen/components/item/sale-price';

const Item = (props: any) => {
  const { className, project } = props;

  const isMobile = useIsMobile();
  const router = useRouter();
  const [beraPrice] = useBera();

  const onClick = () => {
    if (!project) return;
    router.push(`/ramen/${project?.slug}`);
  };

  return (
    <div
      className={clsx(
        "cursor-pointer text-black font-[500] text-[16px] leading-[90%] font-Montserrat bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[10px_15px_7px] md:p-[17px_14px_20px] grid grid-cols-[280px_115px_180px_130px_90px_1fr] md:grid-cols-1 items-center",
        className
      )}
      onClick={onClick}
    >
      {
        isMobile ? (
          <ItemMobile project={project} beraPrice={beraPrice} />
        ) : (
          <>
            <Avatar project={project} />
            <div className="">{numberFormatter(project?.participants, 2, true)}</div>
            <TotalRaised project={project} beraPrice={beraPrice} />
            <SalePrice project={project} beraPrice={beraPrice} />
            <div className="opacity-50">Pending</div>
            <div className="">
              {project?.date_ended ? dateFns.format(project?.date_ended, "MM/dd/yyyy") : '-'}
            </div>
          </>
        )
      }
    </div>
  );
};

export default Item;
