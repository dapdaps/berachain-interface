import { useEffect, useMemo, useState } from 'react';
import type { GameItem } from './useCollect'

interface Props {
    cars: GameItem[];
    hats: GameItem[];
    clothes: GameItem[];
    necklaces: GameItem[];
}

export default function Bear({
    cars, hats, clothes, necklaces
}: Props) {
    const hasCars = useMemo(() => {
        if (cars) {
            return cars.some(item => item.checked)
        }

        return false
    }, [cars])


    return <div className=" absolute bottom-[10%] left-[50%] translate-x-[-50%] w-[395px] h-[359px]">
        { !hasCars && <img src="/images/cave/bear/bear-empty.png" className="absolute left-0 top-[0px] max-w-[395px]"/> }
        {/* <img src="/images/cave/bear/bear-empty.png" className="w-[395px] h-[359px]"/> */}

        { !!cars.length && cars[0].checked && <img src="/images/cave/bear/car/car-1.png" className=" absolute left-0 top-[0px] max-w-[395px]"/> }
        { !!cars.length && cars[1].checked && <img src="/images/cave/bear/car/car-2.png" className="absolute left-[42px] top-[0px] max-w-[350px] "/> }
        { !!cars.length && cars[2].checked && <img src="/images/cave/bear/car/car-3.png" className="absolute left-[-17px] top-[0px] max-w-[400px] " /> }
        { !!cars.length && cars[3].checked && <img src="/images/cave/bear/car/car-4-2.png" className="absolute left-[78px] top-[0px] max-w-[306px]" /> }

        {/* <img src="/images/cave/bear/car/car-1.png" className=" absolute left-0 top-0 w-[395px]"/> */}
        {/* <img src="/images/cave/bear/car/car-2.png" className="absolute left-[42px] top-[-5px] max-w-[365px] h-[359px]"/> */}
        {/* <img src="/images/cave/bear/car/car-3.png" className="absolute left-[-28px] top-0 max-w-[425px] h-[359px]" /> */}

        {/* <img src="/images/cave/bear/car/car-4-2.png" className="absolute left-[78px] top-[0px] max-w-[306px]" /> */}

        { !!hats.length && hats[0].checked && <img src="/images/cave/bear/hat/hat-1.png" className=" absolute w-[117px] left-[210px] top-[-30px]" /> }
        { !!hats.length && hats[1].checked && <img src="/images/cave/bear/hat/hat-2.png" className=" absolute w-[135px] left-[230px] top-[-35px]" /> }
        { !!hats.length && hats[2].checked && <img src="/images/cave/bear/hat/hat-3.png" className=" absolute w-[110px] left-[230px] top-[-20px]" />  }
        { !!hats.length && hats[3].checked && <img src="/images/cave/bear/hat/hat-4.png" className=" absolute w-[120px] left-[230px] top-[-25px]" /> }

        {/* <img src="/images/cave/bear/hat/hat-1.png" className=" absolute w-[117px] left-[210px] top-[-30px]" /> */}
        {/* <img src="/images/cave/bear/hat/hat-2.png" className=" absolute w-[135px] left-[230px] top-[-35px]" /> */}
        {/* <img src="/images/cave/bear/hat/hat-3.png" className=" absolute w-[110px] left-[230px] top-[-20px]" /> */}
        {/* <img src="/images/cave/bear/hat/hat-4.png" className=" absolute w-[120px] left-[230px] top-[-25px]" /> */}

        { !!clothes.length && clothes[0].checked && <img src="/images/cave/bear/cloth/cloth-1.png" className=" absolute w-[226px] left-[89px] top-[26px]" /> }
        { !!clothes.length && clothes[1].checked && <img src="/images/cave/bear/cloth/cloth-2.png" className=" absolute w-[235px] left-[87px] top-[45px]" />  }
        { !!clothes.length && clothes[2].checked && <img src="/images/cave/bear/cloth/cloth-3.png" className=" absolute w-[235px] left-[85px] top-[43px]" /> }
        { !!clothes.length && clothes[3].checked && <img src="/images/cave/bear/cloth/cloth-4.png" className=" absolute w-[235px] left-[85px] top-[44px]" /> }


        {/* <img src="/images/cave/bear/cloth/cloth-2.png" className=" absolute w-[235px] left-[87px] top-[45px]" /> */}

        {/* <img src="/images/cave/bear/cloth/cloth-3.png" className=" absolute w-[235px] left-[85px] top-[43px]" /> */}

        {/* <img src="/images/cave/bear/cloth/cloth-4.png" className=" absolute w-[235px] left-[85px] top-[44px]" /> */}

        { !!necklaces.length && necklaces[0].checked && <img src="/images/cave/bear/necklace/neck-1.png" className="absolute w-[110px] left-[205px] top-[16px]" /> }
        { !!necklaces.length && necklaces[1].checked && <img src="/images/cave/bear/necklace/neck-2.png" className="absolute w-[120px] left-[205px] top-[16px]" /> }
        { !!necklaces.length && necklaces[2].checked && <img src="/images/cave/bear/necklace/neck-3.png" className="absolute w-[110px] left-[205px] top-[16px]" /> }
        { !!necklaces.length && necklaces[3].checked && <img src="/images/cave/bear/necklace/neck-4.png" className="absolute w-[110px] left-[205px] top-[38px]" /> }

        {/* <img src="/images/cave/bear/necklace/neck-1.png" className="absolute w-[110px] left-[205px] top-[16px]" /> */}
        {/* <img src="/images/cave/bear/necklace/neck-2.png" className="absolute w-[120px] left-[205px] top-[16px]" /> */}

        {/* <img src="/images/cave/bear/necklace/neck-3.png" className="absolute w-[110px] left-[205px] top-[16px]" /> */}

        {/* <img src="/images/cave/bear/necklace/neck-4.png" className="absolute w-[110px] left-[205px] top-[38px]" /> */}

        { !!cars.length && cars[3].checked && <img src="/images/cave/bear/car/car-4-1.png" className="absolute left-[-170px] bottom-0 max-w-[757px]" />  }

        {/* <img src="/images/cave/bear/car/car-4-1.png" className="absolute left-[-170px] bottom-0 max-w-[757px]" /> */}
    </div>
}  