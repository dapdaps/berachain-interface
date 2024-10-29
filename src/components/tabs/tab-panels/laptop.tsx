import ActiveTab from '@/components/tabs/active-tab';
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
  bodyInnerClassName
}: any) {
  return (
    <div
      ref={bodyRef}
      className={`relative z-[1] rounded-[20px] bg-[#FFFDEB] border border-black px-[22px] pt-[24px] min-h-[50px] ${bodyClassName} hidden lg:block`}
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
                  key={tab.key}
                  width={
                    tabWidth +
                    ([0, tabs.length - 1].includes(idx)
                      ? tabMarginWidth / 2
                      : tabMarginWidth)
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
  );
}
