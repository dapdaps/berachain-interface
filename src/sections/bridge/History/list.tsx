import { useStatus } from '../Hooks/Stargate/useStatus'
import { useState } from 'react'
import { icons } from '@/configs/chains'
import { formatEnglishDate } from '@/utils/date'
import useIsMobile from '@/hooks/use-isMobile';
import chains from '../lib/util/chainConfig'

import allTokens from '../lib/allTokens'
import { tokenPairs } from '../lib/bridges/stargate/config'
import { balanceFormated } from '@/utils/balance';
import useBridgeType from '../Hooks/useBridgeType';

const _allTokens: any = {};

Object.keys(allTokens).forEach((chainId: string) => {
    allTokens[Number(chainId)].forEach((item: any) => {
        _allTokens[Number(chainId)] = _allTokens[Number(chainId)] || {}
        _allTokens[Number(chainId)][item.symbol.toUpperCase()] = item
    })
})


export default function History({ pendingCount, historyCount, list, setIsOpen, activeTab, setActiveTab }: { pendingCount: number, historyCount: number, list: any[], setIsOpen: (isOpen: boolean) => void, activeTab: string, setActiveTab: (tab: string) => void }) {
    const isMobile = useIsMobile();
    const { bridgeType } = useBridgeType()

    const filteredList = list.filter((item: any) =>
        activeTab === 'pending' ? Number(item.bridge_status) !== 4 : Number(item.bridge_status) === 4
    )

    const cls = isMobile
        ? 'm-auto md:w-[92.307vw] border border-[#000] rounded-2xl bg-[#FFFDEB]'
        : 'fixed bottom-[60px] w-[350px] right-4 z-50 border border-[#000] rounded-2xl bg-[#FFFDEB] lg:shadow-[10px_10px_0px_0px_#00000040]'

    return (
        <div className={cls}>
            <div className="rounded-2xl p-4 relative">
                <div className="absolute top-[20px] cursor-pointer right-[10px]" onClick={() => setIsOpen(false)}>
                    <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2.19995L8 6.99995L2 2.19995" stroke="black" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
                <h2 className="text-black text-[16px] font-[600] text-xl mb-3">My transactions</h2>
                <div className="flex gap-3 mb-4 bg-white border border-[#000] rounded-xl p-1">
                    <div
                        className={`flex flex-1 items-center gap-2 cursor-pointer rounded-xl px-4 py-2 ${activeTab === 'pending' ? 'bg-[#FFDC50]' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.81266 18.2862C10.9438 18.285 12.0626 18.0523 13.1004 17.6023C14.1381 17.1523 15.0727 16.4945 15.8466 15.6697C16.6205 14.8448 17.2173 13.8701 17.6003 12.8058C17.9832 11.7416 18.1442 10.6101 18.0733 9.48125C18.0024 8.35238 17.7012 7.24997 17.1881 6.24194C16.675 5.23392 15.9609 4.34162 15.0899 3.62001C14.2189 2.89841 13.2094 2.36278 12.1235 2.04613C11.0377 1.72947 9.89845 1.6385 8.77609 1.77881L8.56352 0.0782351C10.306 -0.141007 12.0754 0.102491 13.6939 0.784227C15.3123 1.46596 16.7227 2.5619 17.7831 3.96178C18.8435 5.36166 19.5166 7.01611 19.7346 8.75871C19.9526 10.5013 19.7078 12.2706 19.0249 13.8885C18.342 15.5065 17.2451 16.9161 15.8444 17.9755C14.4438 19.0349 12.7889 19.7068 11.0461 19.9235C9.30336 20.1403 7.53426 19.8943 5.91678 19.2102C5.05279 18.8448 4.24834 18.3613 3.52502 17.7766L2.83418 18.6638H2.83304C2.50047 19.0901 1.76675 18.8627 1.67189 18.3038L1.1279 15.1153C1.11226 15.0351 1.11397 14.9526 1.13293 14.8732C1.15188 14.7937 1.18763 14.7193 1.23777 14.6549C1.28791 14.5904 1.35127 14.5375 1.42359 14.4996C1.49592 14.4617 1.57552 14.4398 1.65704 14.4353L4.88332 14.1827C5.44904 14.137 5.84675 14.793 5.51532 15.2204L4.57746 16.4249C5.05087 16.811 5.56716 17.1447 6.11763 17.4188C7.26543 17.9904 8.5304 18.2874 9.81266 18.2862ZM0.204405 11.9146C0.286692 12.286 0.374691 12.6346 0.46612 12.9546L2.18269 12.4689C2.09537 12.1596 2.01724 11.8479 1.9484 11.534C1.8843 11.236 1.83736 10.9345 1.80783 10.6311L0.0318336 10.8026C0.0672626 11.1774 0.125547 11.5477 0.204405 11.9111V11.9146ZM0.452406 6.86314C0.199961 7.65618 0.0486679 8.47791 0.00211906 9.30885H0.000976562L1.78383 9.40943C1.82184 8.72797 1.94588 8.05405 2.15298 7.40371L0.452406 6.86314ZM2.79755 2.97629C2.15367 3.63028 1.60505 4.37165 1.16783 5.17857H1.16898L2.73812 6.02771C3.09536 5.36827 3.54356 4.76234 4.06955 4.22772L2.79755 2.97629ZM6.6364 0.560287C5.76863 0.857082 4.94659 1.27368 4.19412 1.798L5.2124 3.262C5.82866 2.83298 6.50183 2.49216 7.2124 2.24943L6.6364 0.560287ZM10.1547 4.12963C9.96182 3.93674 9.7002 3.82837 9.4274 3.82837C9.15461 3.82837 8.89299 3.93674 8.70009 4.12963C8.5072 4.32253 8.39883 4.58415 8.39883 4.85694V10.4261L11.5577 13.5838C11.6519 13.6849 11.7654 13.7659 11.8916 13.8221C12.0177 13.8783 12.154 13.9086 12.2921 13.911C12.4302 13.9134 12.5673 13.888 12.6954 13.8363C12.8235 13.7846 12.9398 13.7076 13.0375 13.6099C13.1352 13.5122 13.2122 13.3959 13.2639 13.2678C13.3156 13.1397 13.3411 13.0026 13.3386 12.8644C13.3362 12.7263 13.3059 12.5901 13.2497 12.464C13.1935 12.3378 13.1125 12.2242 13.0114 12.1301L10.456 9.57351V4.85694C10.456 4.58415 10.3476 4.32253 10.1547 4.12963Z" fill="#76500D" />
                        </svg>

                        <span className="font-medium">{pendingCount} Pending</span>
                    </div>

                    <div
                        className={`flex flex-1 items-center gap-2 cursor-pointer rounded-xl  px-4 py-2 ${activeTab === 'history' ? 'border border-[#000] bg-[#FFDC50]' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="16.8" height="18" rx="3" stroke="#76500D" stroke-width="2" />
                            <path d="M5.7998 6.99976H12.9998" stroke="#76500D" stroke-width="2" stroke-linecap="round" />
                            <path d="M5.7998 11.8003H10.5998" stroke="#76500D" stroke-width="2" stroke-linecap="round" />
                        </svg>

                        <span className="font-medium">{historyCount} History</span>
                    </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                    {filteredList.map((item: any) => {
                        if (item.template.toLowerCase() !== 'stargate') {
                            return <HistorySingleBridgeItem item={item} key={item.tx_id} />
                        }

                        return <HistoryItem item={item} key={item.tx_id} />
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

function HistoryItem({ item }: { item: any }) {
    const action_tokens = JSON.parse(item.action_tokens)
    const fromToken = _allTokens[item.chain_id][action_tokens[0].toUpperCase()]
    let toToken = _allTokens[item.to_chain_id]?.[tokenPairs[item.chain_id]?.[action_tokens[0].toUpperCase()]?.toUpperCase()]

    if (Number(item.chain_id) === 80094
        && fromToken?.symbol === 'WETH'
        && [5000, 43114, 56].includes(Number(item.to_chain_id))
    ) {
        toToken = _allTokens[item.to_chain_id]?.['WETH']
    }


    // console.log(_allTokens[item.chain_id], action_tokens)

    return <div className="border-b border-gray-200 py-3">
        <div className="flex justify-between items-center">
            <div className='flex-1'>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-[30px] h-[30px] relative">
                            <img className='w-full h-full object-contain' src={fromToken?.icon} />
                            <img className='w-[10px] h-[10px] object-contain border border-[#000] rounded-full absolute bottom-0 right-0' src={chains[item.chain_id].icon} />
                        </div>
                        <div>
                            {balanceFormated(item.action_amount)}<br />{fromToken?.symbol}
                        </div>
                    </div>
                    <span>→</span>
                    <div className="flex items-center gap-2">
                        <div className="w-[30px] h-[30px] relative">
                            <img className='w-full h-full object-contain' src={toToken?.icon} />
                            <img className='w-[10px] h-[10px] object-contain border border-[#000] rounded-full absolute bottom-0 right-0' src={chains[item.to_chain_id].icon} />
                        </div>
                        <div>
                            {balanceFormated(item.action_amount)}<br />{toToken?.symbol}
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500 flex justify-between items-center">
                    <div>
                        {formatEnglishDate(new Date(item.create_time).getTime())}
                        {
                            <a target='_blank' href={`${chains[item.chain_id].blockExplorers}/tx/${item.tx_id}`} className="ml-2 text-blue-500 underline">Tx</a>
                        }
                    </div>
                    <div>
                        {Number(item.bridge_status) !== 4 && <span className="text-[#006BFF]">Processing~3min</span>}
                        {Number(item.bridge_status) === 4 && <span className="text-[#006BFF]">Success</span>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function HistorySingleBridgeItem({ item }: { item: any }) {
    const extra_data = JSON.parse(item.extra_data)

    return <div className="border-t border-[#958FBC] py-3">
        <div className="flex justify-between items-center">
            <div className='flex-1'>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-[30px] h-[30px] relative">
                            <img className='w-full h-full object-contain' src={extra_data?.fromTokenLogo} />
                            <img className='w-[10px] h-[10px] object-contain border border-[#000] rounded-full absolute bottom-0 right-0' src={extra_data?.fromChainLogo} />
                        </div>
                        <div>
                            {balanceFormated(extra_data.fromAmount)}<br />{extra_data?.fromTokenSymbol}
                        </div>
                    </div>
                    <span>→</span>
                    <div className="flex items-center gap-2">
                        <div className="w-[30px] h-[30px] relative">
                            <img className='w-full h-full object-contain' src={extra_data?.toTokenLogo} />
                            <img className='w-[10px] h-[10px] object-contain border border-[#000] rounded-full absolute bottom-0 right-0' src={extra_data?.toChainLogo} />
                        </div>
                        <div>
                            {balanceFormated(extra_data.toAmout)}<br />{extra_data?.toTokenSymbol}
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500 flex justify-between items-center">
                    <div>
                        {formatEnglishDate(extra_data.time)}
                        {
                            <a target='_blank' href={`${chains[extra_data?.fromChainId].blockExplorers}/tx/${item.tx_id}`} className="ml-2 text-blue-500 underline">Tx</a>
                        }
                    </div>
                    <div>
                        {Number(item.bridge_status) !== 4 && <span className="text-[#006BFF]">Processing~3min</span>}
                        {Number(item.bridge_status) === 4 && <span className="text-[#006BFF]">Success</span>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}