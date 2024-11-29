import "./local.css";
import cn from 'clsx';
import { MarketManager } from "./_components";
import { MarketManagerStoreProvider } from "@/stores/use-market-manager";
import { TransactionModal } from "@/components/composables";

const Page = () => {
  return (
    <MarketManagerStoreProvider>
      <div
        className={cn(
          "flex w-full flex-col items-center p-12 h-[calc(100vh_-_68px)]",
          "px-3 py-3 md:px-12"
        )}
      >
        <MarketManager />

        <TransactionModal />
      </div>
    </MarketManagerStoreProvider>
  );
};

export default Page;
