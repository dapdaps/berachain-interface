import useUser from "@/hooks/use-user";
import { useHall } from "@/stores/hall";
import { useInviteModal } from "@/stores/use-invite-modal";
import { usePlaygroundStore } from "@/stores/use-playground";
import { useUserStore } from "@/stores/user";
import { get, post } from "@/utils/http";
import Big from "big.js";
import { useEffect, useMemo, useState } from "react";

export interface TreasureData {
    balance: number;
    total: number;
    rewards: {
        Gem: number;
        Spin: number;
        Cosmetic: number;
    };
}

export const useTreasure = ({ show, tab }: { show: boolean; tab: string; }) => {
    const [questionLoading, setQuestionLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [treasure, setTreasure] = useState<TreasureData | null>(null);
    const [question, setQuestion] = useState<any>(null);
    const { userInfo, getUserInfo } = useUser();
    const [openCheckInModal, setOpenCheckInModal] = useState(false);
    const [utcRemain, setUtcRemain] = useState<{ minutes: string, seconds: string, hours: string }>({ minutes: "00", seconds: "00", hours: "00" });

    const hallStore: any = useHall()
    const inviteModalStore: any = useInviteModal();
    const { spinUserData, setSpinUserData } = usePlaygroundStore();

    useEffect(() => {
        if (!userInfo || !userInfo.address) return;
        getUser();
        getQuestion();
    }, [userInfo, show]);

    const openBox = async (boxAmount: number): Promise<any> => {
        const res = await post('/api/go/treasure/draw', {
            box_amount: boxAmount,
        });
        if (res.code === 200) {
            getUser();
            if (res.data?.reward_spin_amount) {
                setSpinUserData({
                    spin_balance: Big(spinUserData?.spin_balance || 0).plus(res.data.reward_spin_amount).toNumber(),
                });
            }
            return res;
        }

        return null;
    };

    const getQuestion = async (): Promise<void> => {
        try {
            setQuestionLoading(true);
            const res = await get('/api/go/treasure/quest');
            if (res.code === 200) {
                setQuestion(res.data);
            }
            setQuestionLoading(false);
        } catch (error) {
            setQuestionLoading(false);
        }
    };

    const getUser = async (): Promise<void> => {
        try {
            setUserLoading(true);
            const res = await get('/api/go/treasure/user');
            if (res.code === 200) {
                setTreasure(res.data);
            }
            setUserLoading(false);
        } catch (error) {
            setUserLoading(false);
        }
    };

    const completeViewQuest = async (quest: any): Promise<any> => {
        const res = await post('/api/go/treasure/quest', {
            quest_id: quest.id,
        });
        if (res.code === 200) {
            getQuestion();
            return res.data;
        }

        return null;
    };

    const qoutionProgress = useMemo(() => {
        if (!question) return 0;
        return question.filter((item: any) => item.complete).length;
    }, [question]);

    const unCompleteQuestion = useMemo(() => {
        if (!question) return [];
        const unCompleteList = question.filter((item: any) => !item.complete);
        const unCompleteItem = unCompleteList.length > 0 ? unCompleteList[0] : null;
        return unCompleteItem;
    }, [question]);


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

    const handleQuestionComplete = async (quest: any): Promise<any> => {
        if (quest.url) {
            const url = quest.url;
            const match = url.match(/^https?:\/\/[^/]+(\/[^?#]*)/);
            const path = match ? match[1] : '/' + quest.url;

            if (quest.id === 6) {
                hallStore.set({
                    currentTab: 'ibgt',
                });
            }

            window.open(`${window.location.origin}${path}`, '_blank');
        }

        if (quest.category.toLowerCase() === 'share') {
            handleShare();
        }

        if (quest.category.toLowerCase() === 'checkin') {
            setOpenCheckInModal(true);
        }

        if ((quest.category.toLowerCase() === 'view' && quest.url) || (quest.category.toLowerCase() === 'share')) {
            completeViewQuest(quest);
        }

        if (quest.id === 11) {
            inviteModalStore.set({ showInviteModal: true });
        }

         
    };

    function calcUtcRemain() {
        const now = new Date();
        const utcNow = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );
        const utcTomorrow = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + 1,
            0, 0, 0
        );
        const diffMs = utcTomorrow.getTime() - utcNow.getTime();
        let totalSeconds = Math.floor(diffMs / 1000);
        if (totalSeconds < 0) totalSeconds = 0;
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const hours = Math.floor(totalSeconds / 3600);
        const seconds = totalSeconds % 60;
        return {
            hours: hours < 10 ? `0${hours}` : `${hours}`,
            minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
            seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
        };
    }

    useEffect(() => {
        if (unCompleteQuestion) {
            return;
        }
        setUtcRemain(calcUtcRemain());
        const timer = setInterval(() => {
            setUtcRemain(calcUtcRemain());
        }, 1000 * 60);
        return () => clearInterval(timer);
    }, [unCompleteQuestion]);

    const refreshQuestion = (): void => {
        if (!userInfo?.address) {
            return;
        }
        getQuestion();
        getUser();
        getUserInfo();
    };

    return {
        treasure,
        openBox,
        question,
        getQuestion,
        completeViewQuest,
        questionLoading,
        userLoading,
        qoutionProgress,
        utcRemain,
        unCompleteQuestion,
        handleQuestionComplete,
        handleShare,
        inviteLink,
        openCheckInModal,
        setOpenCheckInModal,
        refreshQuestion,
    };
};