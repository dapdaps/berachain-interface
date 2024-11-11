import { useBearEqu } from '@/stores/useBearEqu'
import { get } from '@/utils/http' 
import { useCallback, useEffect, useState } from 'react'

export default function useCollect({ address }: { address: string }) {
    const [collection, setCollection] = useState<any>()
    const [cars, setCars] = useState<GameItem[]>([])
    const [clothes, setClothes] = useState<GameItem[]>([])
    const [necklaces, setNecklaces] = useState<GameItem[]>([])
    const [hats, setHats] = useState<GameItem[]>([])

    const hat = useBearEqu((store: any) => store.hat)
    const cloth = useBearEqu((store: any) => store.cloth)
    const car = useBearEqu((store: any) => store.car)
    const necklace = useBearEqu((store: any) => store.necklace)

    useEffect(() => {
        // if (!address) {
        //     return
        // }
        
        get(`/api/game/items?game_category=bera&address=${address || '1'}`).then(res => {
            if (res.code === 0) {
                // setCollection(res.data)
                const cars: GameItem[] = []
                const clothes: GameItem[] = []
                const necklaces: GameItem[] = []
                const hats: GameItem[] = []

                res.data?.forEach((item: GameItem) => {
                    // item.pc_item = true
                    item.checked = false
                    switch(item.category) {
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

                setCars(cars)
                setClothes(clothes)
                setNecklaces(necklaces)
                setHats(hats)
                setCollection({
                    cars,
                    clothes,
                    necklaces,
                    hats,
                })
            }
        })
    }, [address])

    const initEqu = useCallback((list: GameItem[], setList: any, itemNo: number) => {
        list.forEach((hatItem: GameItem) => {
            if (hatItem.pc_item) {
                hatItem.checked = hatItem.level === itemNo
            } else {
                hatItem.checked = false
            }
        })
        setList([
            ...list
        ])
    }, [])

    useEffect(() => {
        if (collection?.hats) {
            initEqu(collection.hats, setHats, hat)
        }
    }, [hat, collection, initEqu])

    useEffect(() => {
        if (collection?.clothes) {
            initEqu(collection.clothes, setClothes, cloth)
        }
    }, [cloth, collection])

    useEffect(() => {
        if (collection?.cars) {
            initEqu(collection.cars, setCars, car)
        }
    }, [car, collection])


    useEffect(() => {
        if (collection?.necklaces) {
            initEqu(collection.necklaces, setClothes, necklace)
        }
    }, [necklace, collection])
    
    return {
        collection,
        cars,
        clothes,
        necklaces,
        hats,
        setCars,
        setClothes,
        setHats,
        setNecklaces,
    }
}

export type GameItem = {
    level: number;
    category: string;
    pc_item: boolean;
    checked: boolean;
}