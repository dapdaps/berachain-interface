import { useState } from 'react'
import { useStatus } from '../Hooks/Stargate/useStatus'
import List from './list'
import Simple from './simple'

export default function History({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const { pendingCount, historyCount, list } = useStatus()

    const [activeTab, setActiveTab] = useState('pending')
    return (
        <div className="fixed bottom-[60px] w-[350px] right-4 z-50 border border-[#000] rounded-2xl bg-[#FFFDEB] lg:shadow-[10px_10px_0px_0px_#00000040]">
            {
                isOpen ? <List setIsOpen={setIsOpen} activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={pendingCount} historyCount={historyCount} list={list} /> : <Simple setActiveTab={setActiveTab} setIsOpen={setIsOpen} pendingCount={pendingCount} historyCount={historyCount} />
            }
        </div>
    )
}

