"use client";
import { useState, useEffect, useMemo } from 'react';
import Modal from '@/components/modal';
import FlexTable, { Column } from '@/components/flex-table';
import { get } from '@/utils/http';
import { formatSimpleDate } from '@/utils/date';
import useToast from '@/hooks/use-toast';
import useUser from '@/hooks/use-user';
import Empty from '../empty';
import Loading from '../loading';
import Pagination from "@/components/pager/pagination";

interface InviteModalProps {
    open: boolean;
    onClose: () => void;
    invitedUsers: any[];
    totalRewards: number;
    loading: boolean;
    claimLoading: boolean;
    handleClaim: () => void;
    setPage: (page: number) => void;
    page: number;
    totalPage: number;
    totalInvitedCount: number;
}

export default function InviteModal({ open, onClose, invitedUsers, totalRewards, loading, claimLoading, handleClaim, setPage, page, totalPage, totalInvitedCount }: InviteModalProps) {
    const toast = useToast();
    const { userInfo } = useUser();
    const [sort, setSort] = useState('joinedTime');
    const [sortType, setSortType] = useState(-1);

    const inviteLink = useMemo(() => {
        return window.location.origin + '/referral/' + userInfo?.invite_code;
    }, [userInfo]);
    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink as string);
        toast.success({
            title: `Copied link ${inviteLink}`
        });
    };
    ;

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="flex items-center justify-center"
            isShowCloseIcon={false}
            innerClassName="w-[568px] max-h-[80vh] bg-[#FFFDEB] rounded-[20px] shadow-2xl"
        >
            <div className="py-[30px] relative">

                <button
                    onClick={onClose}
                    className="absolute top-[20px] right-[20px] w-[24px] h-[24px] flex items-center justify-center text-[#666] hover:text-[#333] transition-colors"
                >
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_39009_29999)">
                            <circle cx="15" cy="15" r="13" fill="#E9E3B5" />
                            <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" stroke-linejoin="round" />
                        </g>
                        <path d="M19.78 18.3356C17.9376 16.4934 17.9376 13.5064 19.7799 11.6642C20.0307 11.4133 20.0735 11.0494 19.8756 10.8516L19.1482 10.1242C18.9503 9.92632 18.5869 9.96974 18.3356 10.2204C16.4935 12.0627 13.5066 12.0627 11.6643 10.2205C11.4135 9.96941 11.0496 9.92632 10.8517 10.1245L10.1243 10.8519C9.92648 11.0495 9.96931 11.4134 10.2205 11.6642C12.0628 13.5065 12.0628 16.4936 10.2205 18.336C9.96973 18.5866 9.92631 18.9503 10.1243 19.1482L10.8517 19.8756C11.0496 20.0735 11.4135 20.0306 11.6643 19.7799C13.5064 17.9377 16.4936 17.9372 18.3357 19.7794C18.587 20.0307 18.9504 20.0735 19.1483 19.8756L19.8757 19.1482C20.0735 18.9503 20.0307 18.5866 19.78 18.3356Z" fill="black" />
                        <defs>
                            <filter id="filter0_d_39009_29999" x="0" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="3" dy="3" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_39009_29999" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_39009_29999" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </button>


                <div className="flex items-center gap-[15px] mb-[25px] px-[24px]">

                    <div className="w-[65px] h-[65px] rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
                        {userInfo?.address && userInfo?.avatar ? (
                            <img
                                src={userInfo?.avatar}
                                alt=""
                                className="w-[65px] h-[65px] rounded-full"
                            />
                        ) : (
                            <div className="w-[65px] h-[65px] rounded-[50%] border-[2px] border-black bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
                        )}
                    </div>

                    <div>
                        <div className="text-black font-[600] text-[18px] mb-[5px]">{userInfo?.address && userInfo.address.slice(0, 5) + '...' + userInfo.address.slice(-5)}</div>
                        <div className="flex items-center gap-[10px]">
                            <span className="text-black text-[16px] font-medium">Invite link:</span>
                            <div className="flex items-center gap-[20px] bg-[#00000014] px-[12px] py-[6px] rounded-[8px]">
                                <span className="text-black text-[16px] font-medium">{inviteLink?.length > 30
                                    ? '...' + inviteLink.slice(-30)
                                    : inviteLink}</span>
                                <button
                                    onClick={handleCopyLink}
                                    className="w-[16px] h-[16px] flex items-center justify-center text-[#666] hover:text-[#333] transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="1" y="4.73047" width="9.62531" height="10.2668" rx="2" stroke="black" stroke-width="2" />
                                        <path d="M5.375 3.33336V3C5.375 1.89543 6.27043 1 7.375 1H13.0003C14.1049 1 15.0003 1.89543 15.0003 3V9.26676C15.0003 10.3713 14.1049 11.2668 13.0003 11.2668H12.3752" stroke="black" stroke-width="2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-gradient-to-r from-[#FFF9CD] to-[#FFE5B4] rounded-[15px] p-[20px] mb-[10px] px-[24px]">
                    <div className="text-black font-[500] text-[16px]">Your Point Rewards</div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[10px]">
                            <span className="text-black font-[600] text-[20px]">{totalRewards}</span>
                            <img src="/images/treasure-book/gem.png" alt="gem" className="w-[22px] h-[22px]" />
                        </div>
                        <button
                            onClick={handleClaim}
                            disabled={claimLoading || Number(totalRewards) <= 1}
                            className="bg-[#FFDC50] hover:bg-[#FFC700] text-black text-[18px] font-[600] px-[20px] py-[10px] rounded-[10px] border border-black disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {claimLoading ? <Loading size={14} /> : null} Claim
                        </button>
                    </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto rounded-[12px]">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="sticky top-0 bg-[#FFFDEB] font-[Gantari] z-10 border-b border-[#20232912] text-[14px] font-bold">
                                <th className="px-2 py-4 pl-[24px]"><span className='font-[600]'>{totalInvitedCount || 0}</span> Invited</th>
                                <th className="px-2 py-4 whitespace-nowrap" onClick={() => {
                                    setSort('joinedTime')
                                    setSortType(-sortType)
                                }}>
                                    <div className='flex items-center gap-1'>
                                        Joined time
                                        {/* <SortIcon sortType={sortType} isActive={sort === 'joinedTime'} /> */}
                                    </div>
                                </th>
                                <th className="px-2 py-4 whitespace-nowrap" onClick={() => {
                                    setSort('rewards')
                                    setSortType(-sortType)
                                }}>
                                    <div className='flex items-center gap-1'>
                                        Rewards
                                        {/* <SortIcon sortType={sortType} isActive={sort === 'rewards'} /> */}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {invitedUsers?.map((user, idx) => (
                                <tr key={user.id} className="hover:bg-[#FFF3B0] transition text-[14px] font-[600]" >
                                    <td className="px-2 py-4 pl-[24px]">
                                        {user.address}
                                    </td>
                                    <td className="px-2 py-4">
                                        {user.joinedTime}
                                    </td>
                                    <td className="px-2 py-4">
                                        {user.hasRewards ? (
                                            <span className="flex items-center gap-1">
                                                {user.rewards}
                                                <img src="/images/treasure-book/gem.png" alt="gem" className="w-[18px] h-[18px] inline" />
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[#E5C9B0]">
                                                -
                                                <img src="/images/treasure-book/gem.png" alt="gem" className="w-[18px] h-[18px] opacity-40 inline" />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {invitedUsers?.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={3} className="px-2 py-[40px] text-center">
                                        <Empty desc="No data" />
                                    </td>
                                </tr>
                            )}
                            
                            {
                                loading && (
                                    <tr>
                                        <td colSpan={3} className="px-2 py-[40px] text-center">
                                            <Loading size={24} />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    {
                        totalPage > 1 && (
                            <div className="flex justify-end mt-[30px] pr-[24px]">
                                <Pagination
                                    totalPage={totalPage}
                                    page={page}
                                    onPageChange={(page: number) => {
                                        setPage(page);
                                    }}
                                />
                            </div>
                        )
                    }

                </div>
            </div>
        </Modal>
    );
}


const SortIcon = ({ sortType, isActive }: { sortType: number, isActive: boolean }) => {
    if (isActive) {
        return (
            <svg
                className={`${sortType === 1 ? 'rotate-180' : ''} transition-transform duration-200`}
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M5.26795 11C6.03775 12.3333 7.96225 12.3333 8.73205 11L13.0622 3.5C13.832 2.16666 12.8697 0.5 11.3301 0.5H2.66987C1.13027 0.5 0.168022 2.16667 0.937822 3.5L5.26795 11Z" fill="#FDD54C" />
            </svg>
        );
    }

    return (
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.26795 11C6.03775 12.3333 7.96225 12.3333 8.73205 11L13.0622 3.5C13.832 2.16666 12.8697 0.5 11.3301 0.5H2.66987C1.13027 0.5 0.168022 2.16667 0.937822 3.5L5.26795 11Z" fill="black" fill-opacity="0.2" />
        </svg>
    );

}