import { useChristmas } from '@/hooks/use-christmas';
import { useMemo } from 'react';
import type { GameItem } from './useCollect';
import clsx from 'clsx';
interface Props {
  cars: GameItem[];
  hats: GameItem[];
  clothes: GameItem[];
  necklaces: GameItem[];
  items: GameItem[];
  className?: string;
}

export default function Bear({
  cars,
  hats,
  clothes,
  necklaces,
  items,
  className,
}: Props) {
  const { isChristmas } = useChristmas();
  const hasCars = useMemo(() => {
    if (items[5]?.checked || items[6]?.checked) {
      return true
    }
    if (cars) {
      return cars.some(item => item.checked)
    }

    return false
  }, [cars, items])

  return (
    <div className={clsx("origin-bottom scale-75 pointer-events-none absolute bottom-[5%] left-[50%] translate-x-[-50%] w-[395px] h-[359px] z-10", className)}>
      {!hasCars && <img src="/images/cave/bear/bear-empty.png" className="absolute left-0 top-[0px] max-w-[395px]" />}

      {!!cars.length && cars[0].checked && <img src="/images/cave/bear/car/car-1.png" className=" absolute left-0 top-[0px] max-w-[395px]" />}
      {!!cars.length && cars[1].checked && <img src="/images/cave/bear/car/car-2.png" className="absolute left-[42px] top-[0px] max-w-[350px] " />}
      {!!cars.length && cars[2].checked && <img src="/images/cave/bear/car/car-3.png" className="absolute left-[-17px] top-[0px] max-w-[400px] " />}
      {!!cars.length && cars[3].checked && <img src="/images/cave/bear/car/car-4-2.png" className="absolute left-[78px] top-[0px] max-w-[306px]" />}


      {!!hats.length && hats[0].checked && <img src="/images/cave/bear/hat/hat-1.png" className=" absolute w-[111px] left-[220px] top-[-30px] z-[21]" />}
      {!!hats.length && hats[1].checked && <img src="/images/cave/bear/hat/hat-2.png" className=" absolute w-[121px] left-[230px] top-[-37px] z-[21]" />}
      {!!hats.length && hats[2].checked && <img src="/images/cave/bear/hat/hat-3.png" className=" absolute w-[111px] left-[230px] top-[-37px] z-[21]" />}
      {!!hats.length && hats[3].checked && <img src="/images/cave/bear/hat/hat-4.png" className=" absolute w-[111px] left-[230px] top-[-37px] z-[21]" />}


      {!!clothes.length && clothes[0].checked && <img src="/images/cave/bear/cloth/cloth-1.png" className=" absolute w-[210px] left-[89px] top-[37px] z-20" />}
      {!!clothes.length && clothes[1].checked && <img src="/images/cave/bear/cloth/cloth-2.png" className=" absolute w-[248px] left-[88px] top-[-18px] z-20" />}
      {!!clothes.length && clothes[2].checked && <img src="/images/cave/bear/cloth/cloth-3.png" className=" absolute w-[235px] left-[85px] top-[43px] z-20" />}
      {!!clothes.length && clothes[3].checked && <img src="/images/cave/bear/cloth/cloth-4.png" className=" absolute w-[235px] left-[85px] top-[44px] z-20" />}



      {!!necklaces.length && necklaces[0].checked && <img src="/images/cave/bear/necklace/neck-1.png" className="absolute w-[110px] left-[205px] top-[16px] z-20" />}
      {!!necklaces.length && necklaces[1].checked && <img src="/images/cave/bear/necklace/neck-2.png" className="absolute w-[120px] left-[205px] top-[16px] z-20" />}
      {!!necklaces.length && necklaces[2].checked && <img src="/images/cave/bear/necklace/neck-3.png" className="absolute w-[110px] left-[205px] top-[16px] z-20" />}
      {!!necklaces.length && necklaces[3].checked && <img src="/images/cave/bear/necklace/neck-4.png" className="absolute w-[110px] left-[205px] top-[38px] z-20" />}


      {!!cars.length && cars[3].checked && <img src="/images/cave/bear/car/car-4-1.png" className="absolute left-[-170px] bottom-0 max-w-[757px]" />}
      {
        (items[5]?.checked || items[6]?.checked) && (
          <div className='absolute w-full h-full left-[102px] top-[25px] scale-[1.15]'>
            <div className='absolute left-0 top-0 z-0'>
              <img src="/images/cave/christmas/bear/bear.svg" alt="bear" />
            </div>
          </div>
        )
      }
      <div className={clsx('absolute w-full h-full left-[102px] top-[25px] scale-[1.15]', items[5]?.checked ? 'z-20' : 'z-10')}>
        {
          !!items.length && items[1].checked && (
            <div className='absolute left-[102px] top-[-42px] z-[1]'>
              <img src="/images/cave/christmas/bear/santa_hat.svg" alt="santa_hat" />
            </div>
          )
        }
        {
          !!items.length && items[3].checked && (
            <div className='absolute left-[6px] top-[40px] z-[1]'>
              <img src="/images/cave/christmas/bear/santa_coat.svg" alt="santa_coat" />
            </div>
          )
        }
        {
          !!items.length && items[5].checked && (
            <div className="absolute left-[-108px] top-[30px] z-20">
              <img src="/images/cave/christmas/bear/sleigh.svg" alt="sleigh" />
            </div>
          )
        }
        {
          !!items.length && items[0].checked && (
            <div className='absolute left-[92px] top-[-78px] z-[1]'>
              <img src="/images/cave/christmas/bear/elf_hat.svg" alt="elf_hat" />
            </div>
          )
        }
        {
          !!items.length && items[2].checked && (
            <div className="absolute left-[12px] top-[42px] z-[1]">
              <img src="/images/cave/christmas/bear/elf_jacket.svg" alt="elf_jacket" />
            </div>
          )
        }
        {
          !!items.length && items[6].checked && (
            <div className="absolute left-[-66px] top-[0px]">
              <img src="/images/cave/christmas/bear/snowboard.svg" alt="snowboard" />
            </div>
          )
        }
        {
          !!items.length && items[4].checked && (
            <div className='absolute left-0 top-[30px] z-[2]'>
              <img src="/images/cave/christmas/bear/scarf.svg" alt="scarf" />
            </div>
          )
        }
      </div>
    </div>
  );
}  