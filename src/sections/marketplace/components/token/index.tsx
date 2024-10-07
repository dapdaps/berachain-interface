import { useState } from "react";
import Dropdown from "../dropdown";
import SearchBox from "../searchbox";
import List from "../list";

export default function Token() {
    const [list, setList] = useState([{ key: 'ETH', name: 'ETH' }, { key: 'WETH', name: 'WETH' }])

    return <div>
        <div className="flex justify-between items-center">
            <Dropdown list={list} value={'ETH'} onChange={() => { }} placeholder="" />
            <SearchBox />
        </div>

        <div className="mt-[20px]">
            <List meta={[{
                title: '#',
                key: '#',
                sort: false,
                render: (item: any, index: number) => {
                    return index + 1
                }
            }, {
                title: 'Token',
                key: 'token',
                sort: false,
                render: (item: any, index: number) => {
                    return item['token']
                }
            }, {
                title: 'Protocol',
                key: 'Protocol',
                sort: false,
                render: (item: any, index: number) => {
                    return item['token']
                }
            }, {
                title: 'TVL',
                key: 'TVL',
                sort: true,
                render: (item: any, index: number) => {
                    return item['token']
                }
            }, {
                title: 'Yours',
                key: 'Yours',
                sort: true,
                render: (item: any, index: number) => {
                    return item['token']
                }
            }, {
                title: 'Action',
                key: 'Action',
                sort: false,
                render: (item: any, index: number) => {
                    return <div className="hover:bg-[#FFDC50] text-[16px] font-medium border border-[#000] w-[95px] h-[32px] text-center leading-[32px] bg-white rounded-[10px]">Swap</div>
                }
            }]} list={[{
                token: 'ETH',
                id: 1
            }, {
                token: 'WETH',
                id: 2
            }]} />
        </div>
    </div>
}