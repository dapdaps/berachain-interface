import { get, post } from "@/utils/http";
import { useEffect, useState } from "react";

export interface TreasureData {
    balance: number;
    total: number;
    rewards: {
        Gem: number;
        Spin: number;
    };
}

export const useTreasure = () => {
    const [questionLoading, setQuestionLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [treasure, setTreasure] = useState<TreasureData | null>(null);
    const [question, setQuestion] = useState<any>(null);

    useEffect(() => {
        getUser();
        getQuestion();
    }, []);

    const openBox = async (boxAmount: number): Promise<any> => {
        const res = await post('/api/go/treasure/draw', {
            box_amount: boxAmount,
        });
        if (res.code === 200) {
            return res.data;
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

    return {
        treasure,
        openBox,
        question,
        getQuestion,
        completeViewQuest,
        questionLoading,
        userLoading,
    };
};