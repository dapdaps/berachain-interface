"use client";

import SwapViews from './views/SwapViews';
import DepositViews from './views/DepositViews';
import WithdrawViews from './views/WithdrawViews';
import { useSearchParams } from 'next/navigation';

const NearIntents = () => {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'swap';

    const renderContent = () => {
        switch (tab) {
            case 'deposit':
                return <DepositViews />;
            case 'withdraw':
                return <WithdrawViews />;
            default:
                return <SwapViews />;
        }
    };

    return (
        <div className="w-full flex justify-center">
            {renderContent()}
        </div>
    );
};

export default NearIntents;