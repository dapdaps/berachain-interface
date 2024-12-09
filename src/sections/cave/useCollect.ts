import { useBearEqu } from '@/stores/useBearEqu'
import { get } from '@/utils/http'
import { useCallback, useEffect, useState } from 'react'


export const hat_categories = ["elf_hat", "santa_hat"]
export const cloth_cateogries = ["elf_jacket", "santa_coat"]
export const car_cateogries = ["sleigh", "snowboard"]
export const necklace_categories = ["scarf"]

export default function useCollect({ address }: { address: string }) {
    const [collection, setCollection] = useState<any>()
    const [cars, setCars] = useState<GameItem[]>([])
    const [clothes, setClothes] = useState<GameItem[]>([])
    const [necklaces, setNecklaces] = useState<GameItem[]>([])
    const [hats, setHats] = useState<GameItem[]>([])

    const [items, setItems] = useState<GameItem[]>([
        {
            category: 'elf_hat',
            name: 'Elf’s Hat',
        },
        {
            category: 'santa_hat',
            name: 'Santa Hat',
        },
        {
            category: 'elf_jacket',
            name: 'Elf’s Jacket',
        },
        {
            category: 'santa_coat',
            name: 'Santa Coat',
        },
        {
            category: 'scarf',
            name: 'Scarf',

        },
        {
            category: 'sleigh',
            name: 'Sleigh',
        },
        {
            category: 'snowboard',
            name: 'Snowboard',
        },
    ])
    const [nfts, setNfts] = useState<GameItem[]>([])
    const [updater, setUpdater] = useState(-1)

    const hat = useBearEqu((store: any) => store.hat)
    const cloth = useBearEqu((store: any) => store.cloth)
    const car = useBearEqu((store: any) => store.car)
    const necklace = useBearEqu((store: any) => store.necklace)
    useEffect(() => {
        // if (!address) {
        //     return
        // }
        const promiseArray = [
            get(`/api/game/items?game_category=bera&address=${address || '1'}`),
            get(`/api/mas/user/${address || '1'}`)
        ]
        Promise.all(promiseArray).then((result: any) => {

            const [firstResponse, secondResponse] = result


            if (firstResponse.code === 0 || secondResponse.code === 0) {

                const cars: GameItem[] = []
                const clothes: GameItem[] = []
                const necklaces: GameItem[] = []
                const hats: GameItem[] = []



                firstResponse.data?.forEach((item: GameItem) => {
                    switch (item.category) {
                        case 'hats':
                            hats.push(item)
                            break;
                        case 'jackets':
                            clothes.push(item)
                            break;
                        case 'necklaces':
                            necklaces.push(item)
                            break;
                        case 'cars':
                            cars.push(item)
                            break;
                    }
                })

                const _items = items?.map(item => {
                    return {
                        ...item,
                        christmas: true,
                        pc_item: secondResponse?.data?.items?.findIndex(_item => _item.category === item.category) > -1,
                    }
                })
                const _nfts = secondResponse?.data?.nfts?.map(item => {
                    return {
                        ...item,
                        pc_item: true,
                    }
                })


                setCars(cars)
                setClothes(clothes)
                setNecklaces(necklaces)
                setHats(hats)

                setItems(_items)
                setNfts(_nfts)
                // setUpdater(Date.now())
                setCollection({
                    cars,
                    clothes,
                    necklaces,
                    hats,
                    items: _items,
                    nfts: _nfts,
                })
            }
        })

    }, [address, updater])

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
                list[idx].checked = list[idx].category === itemNo
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
        ])
    }, [])

    useEffect(() => {
        if (collection?.hats) {
            initEqu(collection.hats, setHats, hat)
        }
        if (collection?.items) {
            initEqu(collection.items, setItems, hat, "hat")
        }
    }, [hat, collection, updater])

    useEffect(() => {
        if (collection?.clothes) {
            initEqu(collection.clothes, setClothes, cloth)
        }
        if (collection?.items) {
            initEqu(collection.items, setItems, cloth, "cloth")
        }
    }, [cloth, collection, updater])

    useEffect(() => {
        if (collection?.cars) {
            initEqu(collection.cars, setCars, car)
        }
        if (collection?.items) {
            initEqu(collection.items, setItems, car, "car")
        }
    }, [car, collection, updater])


    useEffect(() => {
        if (collection?.necklaces) {
            initEqu(collection.necklaces, setNecklaces, necklace)
        }
        if (collection?.items) {
            initEqu(collection.items, setItems, necklace, "necklace")
        }
    }, [necklace, collection, updater])


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
        setNfts
    }
}

export type GameItem = {
    level: number;
    category: string;
    pc_item: boolean;
    checked: boolean;
    christmas?: boolean;
}