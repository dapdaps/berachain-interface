"use client";
import { useState, useMemo } from 'react';
import FlexTable, { Column } from '@/components/flex-table';
import Pager from '@/components/pager';

const mockData = [
    { reward: 'GEM', amount: 'x100', from: 'Treasure Box', date: '2025/8/30 15:39' },

];

const PAGE_SIZE = 10;

export default function History({ onClose }: { onClose: () => void }) {
    const [currentPage, setCurrentPage] = useState(1);

    const maxPage = useMemo(() => {
        return Math.ceil(mockData.length / PAGE_SIZE) || 1;
    }, []);

    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return mockData.slice(startIndex, endIndex);
    }, [currentPage]);

    const columns: Column[] = [
        {
            title: 'Reward',
            dataIndex: 'reward',
            width: '25%',

        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            width: '20%',

        },
        {
            title: 'From',
            dataIndex: 'from',
            width: '30%',

        },
        {
            title: 'Date',
            dataIndex: 'date',
            width: '25%',

        }
    ];

    return (
        <div className="absolute w-[540px] h-[656px] top-[130px] right-[120px]">
            <div className="w-full h-full bg-[#FFF9CD] absolute top-0 left-0 border border-black rotate-[-1.06deg]"></div>
            <img src="/images/treasure-book/history-title.png" className="absolute top-[-14px] left-[120px] w-[260px]" />
            <div onClick={onClose} className="absolute top-[20px] right-[20px] cursor-pointer z-10">
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_38578_31285)">
                        <circle cx="15" cy="15" r="13" fill="#E9E3B5" />
                        <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" stroke-linejoin="round" />
                    </g>
                    <path d="M16.444 15L19.7799 11.6642C20.0307 11.4133 20.0735 11.0494 19.8756 10.8516L19.1482 10.1242C18.9503 9.92632 18.5869 9.96974 18.3356 10.2204L15.0001 13.5561L11.6643 10.2205C11.4135 9.96941 11.0496 9.92632 10.8517 10.1245L10.1243 10.8519C9.92648 11.0495 9.96931 11.4134 10.2205 11.6642L13.5563 15L10.2205 18.336C9.96973 18.5866 9.92631 18.9503 10.1243 19.1482L10.8517 19.8756C11.0496 20.0735 11.4135 20.0306 11.6643 19.7799L15.0003 16.4439L18.3357 19.7794C18.587 20.0307 18.9504 20.0735 19.1483 19.8756L19.8757 19.1482C20.0735 18.9503 20.0307 18.5866 19.78 18.3356L16.444 15Z" fill="black" />
                    <defs>
                        <filter id="filter0_d_38578_31285" x="0" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dx="3" dy="3" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_38578_31285" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_38578_31285" result="shape" />
                        </filter>
                    </defs>
                </svg>
            </div>

            <div className="relative pt-[80px]">

                <div className="px-[40px]">
                    <FlexTable
                        columns={columns}
                        list={currentData}
                        wrapperClass=""
                        headClass="text-[14px] text-[#553322]"
                        bodyClass="text-[14px] odd:bg-inherit text-[#553322] border-b border-black/20 rounded-none "
                        showHeader={true}
                        pagination={true}
                    />
                </div>

                {/* <div className="flex justify-center mt-[25px]">
                    <Pager
                        maxPage={maxPage}
                        defaultPage={currentPage}
                        onPageChange={setCurrentPage}
                        isFirst={true}
                        isLast={true}
                    />
                </div> */}
            </div>
        </div>
    );
}