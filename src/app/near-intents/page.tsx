import NearIntents from '@/sections/near-intents';
import { WalletSelectorProvider } from '@/sections/near-intents/providers/WalletSelectorProvider';

const Page = () => {
    return (
        <WalletSelectorProvider>
            <NearIntents />
        </WalletSelectorProvider>
    );
}

export default Page;