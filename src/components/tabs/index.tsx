import ActiveTab from '@/components/tabs/active-tab';
import Tab from '@/components/tabs/tab';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const tabHeight = 62;
const tabWidth = 294;
const tabMarginWidth = 62;

const Tabs = (props: TabsProps) => {
  const {
    currentTab,
    tabs,
    className,
    style,
    onChange = () => {
    },
  } = props;

  const bodyRef = useRef<any>(null);

  const currentTabIndex = useMemo(() => {
    const _index = tabs.findIndex((tab) => tab.key === currentTab);
    if (_index < 0) return 0;
    return _index;
  }, [currentTab]);

  const handleChange = (tabKey: TabKey, tab: Tab, index: number) => {
    onChange && onChange(tabKey, tab, index);
  };

  const [contentBorderTopRightRadius, setContentBorderTopRightRadius] = useState(0);
  const [platform, setPlatform] = useState('MacOS');
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let _platform = 'MacOS';
    if (userAgent.includes('Win')) {
      _platform = 'Windows';
    }
    setPlatform(_platform);
    if (!bodyRef.current) return;
    const contentWidth = parseFloat(getComputedStyle(bodyRef.current).width);
    const tabsWidth = tabWidth * tabs.length;
    console.log(contentWidth, tabsWidth);
    if (tabsWidth >= contentWidth) {
      setContentBorderTopRightRadius(0);
      return;
    }
    setContentBorderTopRightRadius(20);
  }, [tabs]);

  return (
    <div className={`berachain-tabs ${className}`} style={style}>
      <div className="berachain-tabs-header relative flex items-stretch translate-y-[1.5px]">
        {
          tabs.map((tab, idx) => {
            if (tab.key === currentTab) {
              return (
                <div
                  className=""
                  style={{
                    width: tabWidth,
                    height: tabHeight,
                  }}
                />
              );
            }
            return (
              <Tab
                key={tab.key}
                index={idx}
                width={tabWidth}
                height={tabHeight}
                marginWidth={tabMarginWidth}
                currentTabIndex={currentTabIndex}
                total={tabs.length}
                onClick={() => handleChange(tab.key, tab, idx)}
              >
                {tab.label}
              </Tab>
            );
          })
        }
      </div>
      <div
        className="shadow-shadow1 rounded-[20px] pt-[8.5px]"
        style={{
          borderTopLeftRadius: currentTabIndex === 0 ? 0 : 20,
          borderTopRightRadius: currentTabIndex === tabs.length - 1 ? contentBorderTopRightRadius : 20,
        }}
      >
        <div
          ref={bodyRef}
          className="berachain-tabs-body relative z-[1] rounded-[20px] bg-[#FFFDEB] border border-black px-[22px] pt-[24px] min-h-[50px]"
          style={{
            borderTopLeftRadius: currentTabIndex === 0 ? 0 : 20,
            borderTopRightRadius: currentTabIndex === tabs.length - 1 ? contentBorderTopRightRadius : 20,
          }}
        >
          <AnimatePresence mode="wait">
            {
              tabs.map((tab, idx) => {
                if (tab.key === currentTab) {
                  return (
                    <>
                      <ActiveTab
                        key={tab.key}
                        width={tabWidth + ([0, tabs.length - 1].includes(idx) ? tabMarginWidth / 2 : tabMarginWidth)}
                        height={tabHeight}
                        marginWidth={tabMarginWidth}
                        currentTabIndex={currentTabIndex}
                        total={tabs.length}
                        isFirst={idx === 0}
                        isLast={idx === tabs.length - 1}
                        style={{
                          position: 'absolute',
                          zIndex: 1,
                          left: idx > 0 ? tabWidth * idx - 1 - tabMarginWidth / 2 : tabWidth * idx - 1,
                          top: -1,
                          transform: `translateY(-${tabHeight - (platform === 'MacOS' ? 1.5 : 2)}px)`,
                        }}
                      >
                        {tab.label}
                      </ActiveTab>
                      <motion.div
                        key={`content-${tab.key}`}
                        variants={{
                          active: {
                            opacity: 1,
                          },
                          inactive: {
                            opacity: 0,
                          },
                        }}
                        initial="inactive"
                        animate="active"
                        exit="inactive"
                      >
                        {tab.children}
                      </motion.div>
                    </>
                  );
                }
                return null;
              })
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Tabs;

export type TabKey = string | number;

export interface TabsProps {
  tabs: Tab[];
  currentTab: TabKey;
  className?: string;
  style?: React.CSSProperties;

  onChange?(key: TabKey, tab: Tab, index: number): void;
}

export interface Tab {
  key: TabKey;
  label: any;
  children: any;
  disabled?: boolean;
}
