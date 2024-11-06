import { get } from '@/utils/http' 
import { useEffect, useState } from 'react'

export default function useCollect({ address }: { address: string }) {
    const [collection, setCollection] = useState([])
    const [cars, setCars] = useState<GameItem[]>([])
    const [clothes, setClothes] = useState<GameItem[]>([])
    const [necklaces, setNecklaces] = useState<GameItem[]>([])
    const [hats, setHats] = useState<GameItem[]>([])

    useEffect(() => {
        if (!address) {
            return
        }
        
        get(`/api/game/items?game_category=bera&address=${address}`).then(res => {
            if (res.code === 0) {
                setCollection(res.data)
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
            }
        })
    }, [address])
    
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