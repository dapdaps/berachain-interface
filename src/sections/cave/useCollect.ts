import { useBearEqu } from '@/stores/useBearEqu';
import { get } from '@/utils/http';
import { useCallback, useEffect, useState } from 'react';
import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';
import useCustomAccount from '@/hooks/use-account';
import { CosmeticCategory, CosmeticsList } from '@/configs/cosmetic';

export const hat_categories = ["elf_hat", "santa_hat"]
export const cloth_cateogries = ["elf_jacket", "santa_coat"]
export const car_cateogries = ["sleigh", "snowboard"]
export const necklace_categories = ["scarf"]

export const sockTips = [
  {
    isChristmas: true,
    category: 'elf_hat',
    name: 'Elf’s Hat',
    content: 'Join BeraTown Xmas campaign to get a random gift box.',
    img: '/images/cave/christmas/elf_hat.png',
    link: '/swap',
    btnText: 'Join',
  },
  {
    isChristmas: true,
    category: 'santa_hat',
    name: 'Santa Hat',
    content: 'Join BeraTown Xmas campaign to get a random gift box.',
    img: '/images/cave/christmas/santa_hat.png',
    link: '/swap',
    btnText: 'Join',
  },
  {
    isChristmas: true,
    category: 'elf_jacket',
    name: 'Elf’s Jacket',
    content: 'Join BeraTown Xmas campaign to get a random gift box.',
    img: '/images/cave/christmas/elf_jacket.png',
    link: '/activity/christmas',
    btnText: 'Join',
  },
  {
    isChristmas: true,
    category: 'santa_coat',
    name: 'Santa Coat',
    content: 'Join BeraTown Xmas campaign to get a random gift box.',
    img: '/images/cave/christmas/santa_coat.png',
    link: '/activity/christmas',
    btnText: 'Join',
  },
  {
    isChristmas: true,
    category: 'scarf',
    name: 'Scarf',
    content: 'Join BeraTown Xmas campaign to get a random gift box.',
    img: '/images/cave/christmas/scarf.png',
    link: '/activity/christmas',
    btnText: 'Join',
  },

]
export const giftBoxTips = [
  {
    isChristmas: true,
    category: 'sleigh',
    name: 'Sleigh',
    content: 'Join BeraTown Xmas campaign to get a random gift box.',
    img: '/images/cave/christmas/sleigh.png',
    link: '/activity/christmas',
    btnText: 'Join',
  },
  {
    isChristmas: true,
    category: 'snowboard',
    name: 'Snowboard',
    content: 'Join BeraTown Xmas campaign to get a random gift box.',
    img: '/images/cave/christmas/snowboard.png',
    link: '/activity/christmas',
    btnText: 'Join',
  },
]

export default function useCollect({ address }: { address: string; }) {
  const { accountWithAk } = useCustomAccount();

  const [collection, setCollection] = useState<any>()
  const [cars, setCars] = useState<GameItem[]>([])
  const [clothes, setClothes] = useState<GameItem[]>([])
  const [necklaces, setNecklaces] = useState<GameItem[]>([])
  const [hats, setHats] = useState<GameItem[]>([])

  const [items, setItems] = useState<GameItem[]>([
    {
      category: 'elf_hat',
      name: 'Elf’s Hat',
      level: 1,
    },
    {
      category: 'santa_hat',
      name: 'Santa Hat',
      level: 1,
    },
    {
      category: 'elf_jacket',
      name: 'Elf’s Jacket',
      level: 1,
    },
    {
      category: 'santa_coat',
      name: 'Santa Coat',
      level: 1,
    },
    {
      category: 'scarf',
      name: 'Scarf',
      level: 1,

    },
    {
      category: 'sleigh',
      name: 'Sleigh',
      level: 1,
    },
    {
      category: 'snowboard',
      name: 'Snowboard',
      level: 1,
    },
  ])
  const [nfts, setNfts] = useState<GameItem[]>([])

  const hat = useBearEqu((store: any) => store.hat)
  const cloth = useBearEqu((store: any) => store.cloth)
  const car = useBearEqu((store: any) => store.car)
  const necklace = useBearEqu((store: any) => store.necklace)
  // const { setTransferItems } = useTransferItemsStore();

  const getAllItems = async () => {
    return {
      code: 200,
      data: CosmeticsList,
    };
  };

  const getItems = () => {
    const promiseArray = [
      getAllItems(),
      get("/api/go/beracave/user")
    ]
    Promise.all(promiseArray).then((result: any) => {
      const [firstResponse, secondResponse] = result;

      const allCosmetics = firstResponse.data || [];
      const userCosmetics = secondResponse.data.cosmetic || [];

      const cars: GameItem[] = []
      const clothes: GameItem[] = []
      const necklaces: GameItem[] = []
      const hats: GameItem[] = []

      // const _transferItems: any[] = [];
      // let necklacesIdx = 1;
      allCosmetics.forEach((item: GameItem) => {
        switch (item.category) {
          case CosmeticCategory.Hats:
            hats.push({
              ...item,
              pc_item: userCosmetics.findIndex((_item: any) => _item === item.name) > -1,
            })
            break;
          case CosmeticCategory.Jackets:
            clothes.push({
              ...item,
              pc_item: userCosmetics.findIndex((_item: any) => _item === item.name) > -1,
            })
            break;
          case CosmeticCategory.Necklaces:
            necklaces.push({
              ...item,
              pc_item: userCosmetics.findIndex((_item: any) => _item === item.name) > -1,
            })
            break;
          case CosmeticCategory.Cars:
            cars.push({
              ...item,
              pc_item: userCosmetics.findIndex((_item: any) => _item === item.name) > -1,
            })
            break;
        }
        // if (item.pc_item) {
        //   switch (item.category) {
        //     case CosmeticCategory.Hats:
        //       item.img = `/images/cave/hat/hat-${item.level}-${item.level}.png`;
        //       break;
        //     case CosmeticCategory.Jackets:
        //       item.img = `/images/cave/clothing/cloth-${item.level}-${item.level}.png`;
        //       break;
        //     case CosmeticCategory.Necklaces:
        //       item.img = `/images/cave/neck/neck-${necklacesIdx}-${necklacesIdx}.png`;
        //       necklacesIdx += 1;
        //       break;
        //     case CosmeticCategory.Cars:
        //       item.img = `/images/cave/key/key-${item.level}-${item.level}.png`;
        //       break;
        //   }
        // _transferItems.push(item);
        // }
      });
      // setTransferItems(_transferItems.filter((it) => !it.transfer_to));


      // const _items = items?.map(item => {
      //   return {
      //     ...item,
      //     christmas: true,
      //     pc_item: userCosmetics.findIndex((_item: any) => _item.category === item.category) > -1,
      //   }
      // })

      // const _nfts = userCosmetics.nfts?.map((item: any) => {
      //   return {
      //     ...item,
      //     pc_item: true,
      //   }
      // })

      setCars(cars.sort((a: any, b: any) => a.level - b.level))
      setClothes(clothes.sort((a: any, b: any) => a.level - b.level))
      setNecklaces(necklaces.sort((a: any, b: any) => a.level - b.level))
      setHats(hats.sort((a: any, b: any) => a.level - b.level))

      // setItems(_items)
      // setNfts(_nfts)
      setCollection({
        cars,
        clothes,
        necklaces,
        hats,
        // items: _items,
        // nfts: _nfts,
      })
    });
  };

  useEffect(() => {
    if (!accountWithAk) {
      return;
    }
    getItems();
  }, [accountWithAk])


  const initEqu = useCallback((list: GameItem[], setList: any, itemNo: number | string, type?: "hat" | "cloth" | "car" | "necklace") => {
    if (type) {
      const TypeMapping = {
        hat: hat_categories,
        cloth: cloth_cateogries,
        car: car_cateogries,
        necklace: necklace_categories
      }
      const cateogries = TypeMapping[type] || necklace_categories
      cateogries.forEach(category => {
        const idx = list.findIndex(item => item.category === category)
        list[idx].checked = address ? list[idx].category === itemNo : false
      })
    } else {
      list.forEach((hatItem: GameItem) => {
        if (hatItem.pc_item) {
          hatItem.checked = hatItem.level === itemNo
        } else {
          hatItem.checked = false
        }
      })
    }
    setList([
      ...list
    ].sort((a: any, b: any) => a.level - b.level))
  }, [address])

  useEffect(() => {
    if (collection?.hats) {
      initEqu(collection.hats, setHats, hat)
    }
    if (collection?.items) {
      initEqu(collection.items, setItems, hat, "hat")
    }
  }, [hat, collection, address])

  useEffect(() => {
    if (collection?.clothes) {
      initEqu(collection.clothes, setClothes, cloth)
    }
    if (collection?.items) {
      initEqu(collection.items, setItems, cloth, "cloth")
    }
  }, [cloth, collection, address])

  useEffect(() => {
    if (collection?.cars) {
      initEqu(collection.cars, setCars, car)
    }
    if (collection?.items) {
      initEqu(collection.items, setItems, car, "car")
    }
  }, [car, collection, address])


  useEffect(() => {
    if (collection?.necklaces) {
      initEqu(collection.necklaces, setNecklaces, necklace)
    }
    if (collection?.items) {
      initEqu(collection.items, setItems, necklace, "necklace")
    }
  }, [necklace, collection, address])


  // useEffect(() => {
  //     if (collection?.nfts) {
  //         initEqu(collection.nfts, setNfts, nfts)
  //     }
  // }, [nfts, collection])

  return {
    collection,
    cars,
    clothes,
    necklaces,
    hats,
    items,
    nfts,
    setCars,
    setClothes,
    setHats,
    setNecklaces,
    setItems,
    setNfts,
    getItems,
  }
}

export type GameItem = {
  level: number;
  category: string;
  pc_item?: boolean;
  checked?: boolean;
  christmas?: boolean;
  name?: string;
  // Transfer Address
  // If the address belongs to someone else, it means the funds are being transferred out
  // if the address is yours, it means the funds are being received
  transfer_to?: string;
  img?: string;
  img_not_owned?: string;
  style?: React.CSSProperties;
  styleNotOwned?: React.CSSProperties;
}
