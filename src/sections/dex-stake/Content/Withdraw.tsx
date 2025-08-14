import Card from "@/components/card";
import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { balanceFormated } from "@/utils/balance";
import useAccount from "@/hooks/use-account";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSwitchChain } from 'wagmi';
import useIsMobile from "@/hooks/use-isMobile";
import clsx from "clsx";
import Empty from "@/components/empty";

dayjs.extend(duration);

interface WithdrawalItem {
    id: string | number;
    amount: number | string;
    symbol: string;
    icon?: React.ReactNode;
    timeLeft: string;
    onWithdraw: () => void;
}

interface WithdrawListProps {
    data: WithdrawalItem[];
    onWithdraw: (item: WithdrawalItem) => void;
}

const WithdrawList: React.FC<WithdrawListProps> = ({ data, onWithdraw }) => {
    const isMobile = useIsMobile();
    return (
        <div className={clsx(isMobile ? "w-full mt-4" : "w-[400px] absolute top-0 right-[-410px]")}>
            <Card className={isMobile ? "rounded-none" : ""}>
                <div className="text-[#222] text-[20px] font-semibold mb-4">Position</div>
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white border border-[#D9D9D9] rounded-[12px] px-4 py-3 mb-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[#3D405A] text-[14px] font-medium">My Queued Withdrawal</span>
                            <span className="text-[#3D8AFF] text-[14px] font-semibold">
                                {
                                    (() => {
                                        const totalSeconds = Number(item.timeLeft) || 0;
                                        const d = dayjs.duration(totalSeconds, "seconds");
                                        if (d.asSeconds() <= 0) {
                                            return "0M";
                                        }
                                        const days = d.days();
                                        const hours = d.hours();
                                        const minutes = d.minutes();
                                        let str = "";
                                        if (days > 0) str += `${days}D `;
                                        if (hours > 0 || days > 0) str += `${hours}H `;
                                        str += `${minutes}M`;
                                        return str.trim();
                                    })()
                                }
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {item.icon ? (
                                    item.icon
                                ) : (
                                    <span className="w-7 h-7 flex items-center justify-center rounded-full">
                                        <img src="/assets/tokens/bera.svg" alt="" className="real-image w-full h-full" />
                                    </span>
                                )}
                                <span className="text-[#3D405A] text-[20px] font-bold">{balanceFormated(item.amount)}</span>
                                {/* <span className="text-[#3D405A] text-[16px] font-semibold">{item.symbol}</span> */}
                            </div>
                            <WithdrawBtn item={item} onWithdraw={onWithdraw} />
                        </div>
                    </div>
                ))}

                {
                    (!data || data.length === 0) && <div className="text-center text-[#3D405A] text-[16px] font-semibold py-[20px]">
                        <Empty desc="No withdrawals" />
                    </div>
                }
            </Card>
        </div>
    );
};

const cls = 'bg-[#FFD600] text-[#3D405A] font-semibold rounded-[8px] px-5 py-2 text-[15px] shadow transition'
const WithdrawBtn = ({ item, onWithdraw }: { item: WithdrawalItem, onWithdraw: (item: WithdrawalItem) => void }) => {
    const { account, chainId } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { isPending: switching, switchChain } = useSwitchChain();

    if (!account || !chainId) {
        return (
            <button
                className={cls}

                onClick={() => {
                    openConnectModal?.();
                }}
            >
                Connect wallet
            </button>
        );
    }

    if (chainId !== 80094) {
        return (
            <button
                className={cls}

                onClick={() => {
                    switchChain({
                        chainId: chainId
                    });
                }}
            >
                Switch Network
            </button>
        );
    }

    return (
        <button disabled={Number(item.timeLeft) > 0}
            className={`${cls} ${Number(item.timeLeft) > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
                if (Number(item.timeLeft) > 0) {
                    return;
                }
                onWithdraw(item);
            }}>
            Withdraw
        </button>
    )
}

export default WithdrawList;
