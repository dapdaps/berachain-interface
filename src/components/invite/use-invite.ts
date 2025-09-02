import useToast from "@/hooks/use-toast";
import useUser from "@/hooks/use-user";
import { get, post } from "@/utils/http";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export function useInvite() {
    const { userInfo } = useUser();
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [totalRewards, setTotalRewards] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [claimLoading, setClaimLoading] = useState(false);
    const toast = useToast();
    const getInvitedRewards = async () => {
        const res = await get('/api/go/invite/user');
        setTotalRewards(res.data?.reward_amount || 0);
    }
    const getInvitedUsers = async () => {
        if (loading) return;
        setLoading(true);
        const res = await get('/api/go/invite/records', {
            page,
            page_size: PAGE_SIZE,
        });
        setInvitedUsers(res.data.data || []);
        setTotalPage(res.data.total_page || 0);
        setLoading(false);
    }

    const handleClaim = async () => {
        if (claimLoading) return;
        try {
            setClaimLoading(true);
            const res = await post('/api/go/invite/claim');
            setClaimLoading(false);
            getInvitedRewards();
            getInvitedUsers();
        } catch (err) {
            setClaimLoading(false);
        }
    }


    useEffect(() => {
        if (userInfo && userInfo.address) {
            getInvitedRewards();
            getInvitedUsers();
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo && userInfo.address) {
            getInvitedUsers();
        }
    }, [page, userInfo]);

    return {
        invitedUsers,
        totalRewards,
        loading,
        totalPage,
        page,
        claimLoading,
        handleClaim,
        setPage,
    }
}