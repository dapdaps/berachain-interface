import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import CheckInModal from "../check-in/modal";
import useUser from "@/hooks/use-user";


export default function GetMore({ question, completeViewQuest, questionLoading, getQuestion }: { question: any, completeViewQuest: (quest: any) => Promise<any>, questionLoading: boolean, getQuestion: () => Promise<void> }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [openCheckInModal, setOpenCheckInModal] = useState(false);

    const { userInfo } = useUser();

    const inviteLink = useMemo(() => {
        return window.location.origin + '/referral/' + userInfo?.invite_code;
    }, [userInfo]);

    const handleShare = () => {
        const text = `McBera went full degen…
🎁 Lootboxes everywhere
🎰 Games in the arcade
💸 Rewards on every move
I’m already farming + spinning in Beratown — join me 👉 [${inviteLink}]`

        window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
    }

    return <div>
        <div className="text-[36px] font-CherryBomb text-[#FDD54C]  text-center" style={{
            WebkitTextStroke: "2px #000000",
        }} >How To Get More?</div>

        {
            question && question.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between pl-[60px] pr-[40px] gap-[30px] font-Montserrat mb-[20px] mt-[10px]">
                    <div className={clsx("relative", index % 2 === 0 ? "order-[1]" : "order-[2]")}>
                        <img src={item.icon} className="h-[164px]" />
                        <div style={{
                            WebkitTextStroke: "2px #000000",
                        }} className="absolute top-[-10px] right-[-15px] w-[65px] flex justify-center  h-[65px] text-[36px] font-CherryBomb text-[#FFF4CD] bg-[url('/images/treasure-book/quest-step.png')] bg-no-repeat bg-center bg-contain">{index + 1}</div>
                    </div>

                    <div className={clsx("flex-1", index % 2 !== 0 ? "order-[1]" : "order-[2]")}>
                        <LinkItem config={Config[item.id]} onClick={() => {
                            if (item.url) {
                                const url = item.url; 
                                const match = url.match(/^https?:\/\/[^/]+(\/[^?#]*)/);
                                const path = match ? match[1] : item.url;
                                window.open(`${window.location.origin}${path}`, '_blank');
                            }

                            if (item.category.toLowerCase() === 'share') {
                                handleShare();
                            }

                            if (item.category.toLowerCase() === 'checkin') {
                                setOpenCheckInModal(true);
                            }

                            if ((item.category.toLowerCase() === 'view' && item.page) || (item.category.toLowerCase() === 'share')) {
                                completeViewQuest(item);
                            }
                        }} />
                        <RewardItem data={item} questionLoading={questionLoading} getQuestion={getQuestion} loadingId={loadingId} setLoadingId={setLoadingId} />
                    </div>
                </div>
            ))
        }
        <CheckInModal open={openCheckInModal} onClose={() => setOpenCheckInModal(false)} />
    </div>;
}

function RewardItem({ data, questionLoading, getQuestion, loadingId, setLoadingId }: { data: any, questionLoading: boolean, getQuestion: () => Promise<void>, loadingId: string | null, setLoadingId: (id: string | null) => void }) {
    const isLoading = useMemo(() => {
        return loadingId === data.id && questionLoading;
    }, [loadingId, data, questionLoading]);

    return <div className="flex items-center justify-between mt-[10px] bg-[#FFFFFF33] rounded-[10px] p-[10px] border border-dashed border-[#8B6A45]">
        <div className="flex items-center gap-[5px]">
            {
                data.reward_box_amount > 0 && <>
                    <div className="text-[18px] font-bold">1</div>
                    <img src="/images/treasure-book/box.png" className="w-[30px]" alt="item" />
                </>
            }
            {
                data.reward_gem_amount > 0 && <>
                    <div className="text-[18px] font-bold">
                        {data.reward_box_amount > 0 && '+'}
                        {data.reward_gem_amount}</div>
                    <img src="/images/treasure-book/gem.png" className="w-[30px]" alt="item" />
                </>
            }

        </div>

        {
            data.complete ? <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#7EA82B" />
                <path d="M16.625 28.4375L24.0625 35.875L39.8125 20.125" stroke="white" strokeWidth="6" strokeLinecap="round" />
            </svg> : <div
                className="cursor-pointer"
                onClick={() => {
                    if (questionLoading) return;
                    setLoadingId(data.id);
                    getQuestion();
                }}
            >
                <motion.svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    key={isLoading ? "loading" : "normal"}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={isLoading ? { rotate: 360 } : undefined}
                    transition={isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : undefined}
                    style={{ display: "block" }}
                >
                    <path d="M12.415 0.21582C12.6709 -0.122817 13.1998 -0.0504184 13.3545 0.344727L15.5801 6.03613C15.7275 6.41323 15.4252 6.81357 15.0225 6.77441L8.94043 6.18652C8.51794 6.14562 8.30368 5.65705 8.55957 5.31836L9.41113 4.18945C8.98618 4.09236 8.54959 4.04102 8.11035 4.04102C4.95844 4.04102 2.39459 6.55521 2.39453 9.64551C2.39453 12.7366 4.9584 15.251 8.11035 15.251C10.7164 15.251 12.9919 13.5248 13.6436 11.0537C13.8134 10.4148 14.4697 10.0337 15.1074 10.2012C15.7463 10.3703 16.1282 11.0249 15.96 11.6641C15.0292 15.1851 11.8015 17.6455 8.11035 17.6455C3.63832 17.6455 0 14.0567 0 9.64551C6.12127e-05 5.23513 3.63835 1.64648 8.11035 1.64648C9.08129 1.64649 10.0454 1.82081 10.9502 2.15332L12.415 0.21582Z" fill="#D39924" />
                </motion.svg>
            </div>
        }

    </div>;
}

function LinkItem({ config, onClick }: { config: any, onClick: () => void }) {
    return <div onClick={onClick}>{config}</div>;
}

const Config: any = {
    1: <><div className="text-[24px] font-bold cursor-pointer underline inline">Bridge</div><div className="text-[18px] font-bold">$100 to Berachain</div></>,
    2: <><div className="text-[18px] font-bold">Stake at least $100 in <div className="text-[24px] font-bold cursor-pointer underline inline">Vaults</div></div></>,
    3: <><div className="text-[18px] font-bold">Check your <div className="text-[24px] font-bold cursor-pointer underline inline">portfolio</div> page</div></>,
    4: <>
        <div className="text-[18px] font-bold">
            Make a swap on <div className="text-[24px] font-bold cursor-pointer underline inline">Superswap</div>
        </div>
    </>,
    5: <>
        <div className="text-[18px] font-bold">
            Stake at least $10 for <div className="text-[24px] font-bold cursor-pointer underline inline">BERA</div>
        </div>
    </>,
    6: <>
        <div className="text-[18px] font-bold">
            Stake at least <span className="text-[24px] font-bold cursor-pointer underline inline">$10</span> for <div className="text-[24px] font-bold cursor-pointer underline inline">iBGT</div>
        </div>
    </>,
    7: <>
        <div className="text-[18px] font-bold">
            Complete 1 daily <div className="text-[24px] font-bold cursor-pointer underline inline">check-in</div>
        </div>
    </>,
    8: <>
        <div className="text-[18px] font-bold">
            Play 1 <div className="text-[24px] font-bold cursor-pointer underline inline">Carnival</div> game
        </div>
    </>,
    9: <>
        <div className="text-[18px] font-bold">
        Swap $100+ in $HENLO on <div className="text-[24px] font-bold cursor-pointer underline inline">Kodiak</div>
        </div>
    </>,
    10: <>
        <div className="text-[24px] font-bold cursor-pointer underline">
            Share Beratown on x
        </div>
    </>,
    11: <>
        <div className="text-[18px] font-bold">
            <div className="text-[24px] font-bold cursor-pointer underline inline">Invite</div> a new user and need him to complete a transaction
        </div>
    </>,
}