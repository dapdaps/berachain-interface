import ActiveTab from '@/components/tabs/active-tab';
import useIsMobile from '@/hooks/use-isMobile';
import { AnimatePresence, motion } from 'framer-motion';

export default function Laptop({
  bodyRef,
  currentTabIndex,
  tabs,
  contentBorderTopRightRadius,
  bodyClassName,
  bodyStyle,
  currentTab,
  tabWidth,
  tabMarginWidth,
  tabHeight,
  platform,
  bodyInnerClassName,
  page,
}: any) {
  const isMobile = useIsMobile()
  return (
    <div
      ref={bodyRef}
      className={`shadow-shadow1 rounded-[20px] pt-[8.5px] md:shadow-none ${bodyClassName}`}
      style={{
        borderTopLeftRadius: currentTabIndex === 0 ? 0 : 20,
        borderTopRightRadius:
          currentTabIndex === tabs.length - 1
            ? contentBorderTopRightRadius
            : 20,
        ...bodyStyle
      }}
    >
      <div
        className={`relative z-[1] rounded-[20px] bg-[#FFFDEB] border border-black lg:px-[22px] md:px-[12px] pt-[24px] min-h-[50px] lg:pb-[22px] ${bodyClassName}`}
        style={{
          borderTopLeftRadius: currentTabIndex === 0 ? 0 : 20,
          borderTopRightRadius:
            currentTabIndex === tabs.length - 1
              ? contentBorderTopRightRadius
              : 20,
          ...bodyStyle
        }}
      >
        <AnimatePresence mode='wait'>
          {tabs.map((tab: any, idx: number) => {
            if (tab.key === currentTab) {
              return (
                <>
                  <ActiveTab
                    page={page}
                    key={tab.key}
                    width={
                      isMobile && page === 'earn' ? tabWidth : (tabWidth +
                        ([0, tabs.length - 1].includes(idx)
                          ? tabMarginWidth / 2
                          : tabMarginWidth))
                    }
                    height={tabHeight}
                    marginWidth={tabMarginWidth}
                    currentTabIndex={currentTabIndex}
                    total={tabs.length}
                    isFirst={idx === 0}
                    isLast={idx === tabs.length - 1}
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      left:
                        idx > 0
                          ? tabWidth * idx - 1 - tabMarginWidth / 2
                          : tabWidth * idx - 1,
                      top: -1,
                      transform: `translateY(-${
                        tabHeight - (platform === 'MacOS' ? 1.5 : 2)
                      }px)`
                    }}
                  >
                    {tab.label}
                  </ActiveTab>
                  <motion.div
                    className={bodyInnerClassName}
                    key={`content-${tab.key}`}
                    variants={{
                      active: {
                        opacity: 1
                      },
                      inactive: {
                        opacity: 0
                      }
                    }}
                    initial='inactive'
                    animate='active'
                    exit='inactive'
                  >
                    {tab.children}
                  </motion.div>
                </>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
