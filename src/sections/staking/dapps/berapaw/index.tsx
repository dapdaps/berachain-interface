import clsx from 'clsx';
import BearBackground from '@/components/bear-background';
import Tabs from '@/components/tabs';
import { useState } from 'react';
import useIsMobile from '@/hooks/use-isMobile';
import { useSearchParams } from 'next/navigation';
import Content from '@/sections/staking/Content';
import PageBack from '@/components/back';
import DappIcon from '@/components/dapp-icon';
import MobileContent from '@/sections/vaults/mobile/content';
import MenuButton from '@/components/mobile/menuButton';
import LazyImage from '@/components/layz-image';
import Bg from '@/sections/vaults/components/mobile-bg';
import BeraPawContextProvider from '@/sections/staking/dapps/berapaw/context';
import Stake from '@/sections/staking/dapps/berapaw/stake';

const Berapaw = (props: any) => {
  const { className, dapp } = props;

  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const defaultCurrentTab = searchParams.get("tab") || "vaults";

  const [currentTab, setCurrentTab] = useState<string>(defaultCurrentTab);

  return (
    <BeraPawContextProvider value={{ currentTab, setCurrentTab }}>
      <BearBackground type="dapp">
        <PageBack className="absolute left-[36px] md:left-[12px] md:top-[17px] z-[10]" />
        <div className="p-[25px_0px_0px] w-[990px] mx-auto md:w-full md:p-[20px_0] md:bg-vault md:min-h-[100dvh]">
          {
            isMobile && (
              <>
                <Bg className="opacity-30 z-[1] pointer-events-none" />
                <MenuButton className="relative mx-auto z-[2]">
                  <div className="flex gap-[12px] text-[24px] items-center">
                    <LazyImage
                      src={dapp?.icon}
                      width={33}
                      height={33}
                      containerClassName="shrink-0 rounded-[4px] overflow-hidden"
                    />
                    <div>{dapp?.name}</div>
                  </div>
                </MenuButton>
              </>
            )
          }
          <div className="relative">
            <Tabs
              isCard
              currentTab={currentTab}
              tabs={[
                {
                  key: 'vaults',
                  label: 'Vaults',
                  children: isMobile ? (
                    <MobileContent
                      {...props}
                      className="!h-[calc(100dvh-260px)]"
                    />
                  ) : (
                    <Content
                      {...props}
                      className="!border-0 !bg-[unset] !rounded-0 !shadow-[unset] !p-0"
                      listTitle=""
                    />
                  ),
                },
                {
                  key: 'stake',
                  label: 'Stake',
                  children: (
                    <Stake
                      {...props}
                      className=""
                    />
                  ),
                },
              ]}
              onChange={(key) => setCurrentTab(key as string)}
              className={clsx("h-full md:pt-[20px]", className)}
            />
            {
              !isMobile && (
                <DappIcon
                  src={dapp?.icon}
                  alt={dapp?.name}
                  name={dapp?.name}
                  type={dapp?.type || 'Staking'}
                  className="z-10 top-[0px]"
                />
              )
            }
          </div>
        </div>
      </BearBackground>
    </BeraPawContextProvider>
  );
};

export default Berapaw;
