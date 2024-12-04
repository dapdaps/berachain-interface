import DappCard from '@/sections/activity/christmas/components/dapp-card';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ProjectCard from '@/sections/activity/christmas/components/project-card';

const TABS = [
  { key: 1, title: 'Interact with dApps' },
  { key: 2, title: 'Explore Projects' },
];

const Quest = () => {
  const [currentTab, setCurrentTab] = useState(TABS[0]);

  const handleTab = (tab: any) => {
    setCurrentTab(tab);
  };

  return (
    <div className="relative pt-[214px] pb-[120px] text-[#FFF5A9] font-[400] leading-[100%] text-center bg-[linear-gradient(180deg,_#38485C_0%,_#000_100%)]">
      <div className="absolute left-0 -top-[104px] w-full h-[288px] bg-[url('/images/activity/christmas/bg-quest-top.svg')] bg-no-repeat bg-cover bg-center" />
      <div className="text-[42px] leading-[150%] font-CherryBomb">
        How To Get Gift Box?
      </div>
      <div className="mt-[10px] text-[18px]">
        Interact with popular dApps in Berachain on DapDap, or explore hot projects to win Xmas gift boxes.
      </div>
      <div className="w-[1232px] mx-auto pt-[59px]">
        <div className="flex justify-center items-center gap-[156px]">
          {
            TABS.map((tab: any) => (
              <div
                key={tab.key}
                className={`relative text-[#BBB] text-[26px] font-[700] leading-[150%] py-[18px] ${currentTab.key === tab.key ? 'cursor-default !text-[#FFF5A9]' : 'cursor-pointer'}`}
                onClick={() => handleTab(tab)}
              >
                {tab.title}
                <AnimatePresence mode="wait">
                  {
                    currentTab.key === tab.key && (
                      <motion.div
                        className="absolute w-full h-[6px] rounded-[3px] bg-[#FFF5A9] left-0 bottom-[-6px]"
                        animate={{
                          opacity: 1,
                          y: [10, 0],
                        }}
                      />
                    )
                  }
                </AnimatePresence>
              </div>
            ))
          }
        </div>
        <div className="">
          <AnimatePresence mode="wait">
            {
              currentTab.key === TABS[0].key && (
                <motion.div
                  key={TABS[0].key}
                  className="pt-[40px]"
                  animate={{
                    opacity: 1,
                    y: [-10, 0],
                  }}
                >
                  <section className="">
                    <div className="text-[#FFF5A9] text-[20px] font-[700] leading-[150%] text-left pl-[19px]">
                      Trade $ Liquidity
                    </div>
                    <div className="grid grid-cols-3 gap-[16px] mt-[15px]">
                      <DappCard />
                      <DappCard />
                      <DappCard />
                      <DappCard />
                    </div>
                  </section>
                  <section className="mt-[56px]">
                    <div className="text-[#FFF5A9] text-[20px] font-[700] leading-[150%] text-left pl-[19px]">
                      Lending
                    </div>
                    <div className="grid grid-cols-3 gap-[16px] mt-[15px]">
                      <DappCard />
                      <DappCard />
                      <DappCard />
                    </div>
                  </section>
                  <section className="mt-[56px]">
                    <div className="text-[#FFF5A9] text-[20px] font-[700] leading-[150%] pl-[19px] text-left">
                      Vaults
                    </div>
                    <div className="grid grid-cols-3 gap-[16px] mt-[15px]">
                      <DappCard />
                      <DappCard />
                      <DappCard />
                    </div>
                  </section>
                </motion.div>
              )
            }
            {
              currentTab.key === TABS[1].key && (
                <motion.div
                  key={TABS[1].key}
                  className="pt-[46px]"
                  animate={{
                    opacity: 1,
                    y: [-10, 0],
                  }}
                >
                  <section className="">
                    <div className="grid grid-cols-5 gap-x-[16px] gap-y-[36px] mt-[15px]">
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                      <ProjectCard />
                    </div>
                  </section>
                </motion.div>
              )
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Quest;
