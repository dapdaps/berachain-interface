'use client'
import NearIntents from '@/sections/near-intents';
import { ModalContainer } from '@/sections/near-intents/components/Modal/ModalContainer';
import { config } from '@/sections/near-intents/config/wagmi';
import queryClient from '@/sections/near-intents/constants/queryClient';
import { HistoryStoreProvider } from '@/sections/near-intents/providers/HistoryStoreProvider';
import { ModalStoreProvider } from '@/sections/near-intents/providers/ModalStoreProvider';
import { NotificationStoreProvider } from '@/sections/near-intents/providers/NotificationProvider';
import { SolanaWalletProvider } from '@/sections/near-intents/providers/SolanaWalletProvider';
import { TokensStoreProvider } from '@/sections/near-intents/providers/TokensStoreProvider';
import { WalletConnectStoreProvider } from '@/sections/near-intents/providers/WalletConnectStoreProvider';
import { WalletSelectorProvider } from '@/sections/near-intents/providers/WalletSelectorProvider';
import { QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"

const Page = () => {
    return (
            <NotificationStoreProvider>
                <QueryClientProvider client={queryClient}>
                <WalletSelectorProvider>
                    <SolanaWalletProvider>
                    <HistoryStoreProvider>
                        <TokensStoreProvider>
                        <ModalStoreProvider>
                            <WalletConnectStoreProvider>
                                <NearIntents />
                            </WalletConnectStoreProvider>
                            <ModalContainer />
                        </ModalStoreProvider>
                        </TokensStoreProvider>
                    </HistoryStoreProvider>
                    </SolanaWalletProvider>
                </WalletSelectorProvider>
                </QueryClientProvider>
            </NotificationStoreProvider>
    );
}

export default Page;