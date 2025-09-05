"use client";
import { useMemo, useState } from 'react';
import Modal from '@/components/modal';
import Loading from '../loading';
import useUser from '@/hooks/use-user';
import { useNft } from './use-nft';

interface NFTHolderPerksModalProps {
    open: boolean;
    onClose: () => void;
    onClaim?: () => void;
}

export default function NFTHolderPerksModal({
    open,
    onClose,
}: NFTHolderPerksModalProps) {

    const { userInfo } = useUser();
    const { nft, claimLoading, handleClaim } = useNft();

    const hasNft = useMemo(() => {
        for (const key of Object.keys(nft)) {
            if (nft[key]) {
                return true;
            }
        }
        return false;
    }, [nft]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="flex items-center justify-center"
            innerClassName="w-[424px] bg-[#FFFDEB] rounded-[20px] shadow-lg border border-[#333648]"
        >
            <div className="p-[30px] relative">
                <div className="text-center mb-[25px]">
                    <h2 className="text-[#FDD54C] font-CherryBomb text-[26px] mb-[20px] relative [text-shadow:0_2px_0_#000] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
                        NFT Holder Perks
                    </h2>
                </div>

                <div className="text-center mb-[30px] font-Montserrat">
                    <p className="text-black text-[16px] font-[600] leading-relaxed">
                        Holding Steady Teddy or Honey Comb gives you an extra 10% points
                    </p>
                </div>

                <div className="flex justify-center gap-[20px] mb-[30px]">
                    <div className="w-[120px] h-[120px] rounded-[15px] overflow-hidden shadow-lg">
                        <img src="/images/nft-holder/nft-1.png" className="w-full h-full" alt="nft" />
                    </div>

                    <div className="w-[120px] h-[120px] rounded-[15px] overflow-hidden shadow-lg">
                        <img src="/images/nft-holder/nft-2.png" className="w-full h-full" alt="nft" />
                    </div>
                </div>

                <div className="text-center mb-[30px] font- text-black">
                    <h3 className="font-[600] text-[16px] mb-[10px]">Your extra points</h3>
                    <div className="flex items-center justify-center gap-[8px]">
                        <img src="/images/treasure-book/gem.png" className="w-[22px]" alt="points" />
                        <span className=" font-[700] text-[18px]">{hasNft ? userInfo?.gem_nft || 0 : 0}</span>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleClaim}
                        disabled={claimLoading || !hasNft || Number(userInfo?.gem_nft) <= 0}
                        className="w-[286px] border border-black bg-[#FFDC50] hover:bg-[#FFC700] disabled:opacity-50 disabled:cursor-not-allowed text-black font-[700] text-[16px] px-[50px] py-[15px] rounded-[15px] shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                        style={{ boxShadow: '6px 6px 0px 0px #00000040' }}
                    >
                        {claimLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loading size={20} />
                                Claiming...
                            </div>
                        ) : (
                            'Claim'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
