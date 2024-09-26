import ActiveTab from '@/components/tabs/active-tab';
import Tab from '@/components/tabs/tab';
import { useMemo } from 'react';

const tabHeight = 62;
const tabWidth = 312;
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

  const currentTabIndex = useMemo(() => {
    const _index = tabs.findIndex((tab) => tab.key === currentTab);
    if (_index < 0) return 0;
    return _index;
  }, [currentTab]);

  const handleChange = (tabKey: TabKey, tab: Tab, index: number) => {
    onChange && onChange(tabKey, tab, index);
  };

  return (
    <div className={`berachain-tabs pl-[100px] ${className}`} style={style}>
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
        className="berachain-tabs-body relative z-[1] shadow-shadow1 rounded-[20px] bg-[#FFFDEB] border border-black px-[22px] pt-[24px] min-h-[50px]"
        style={{
          borderTopLeftRadius: currentTabIndex === 0 ? 0 : 20,
          borderTopRightRadius: currentTabIndex === tabs.length - 1 ? 0 : 20,
        }}
      >
        {
          tabs.map((tab, idx) => {
            if (tab.key === currentTab) {
              return (
                <>
                  <ActiveTab
                    key={tab.key}
                    width={tabWidth}
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
                      transform: `translateY(-${tabHeight - 1.5}px)`,
                    }}
                  >
                    {tab.label}
                  </ActiveTab>
                  <div>{tab.children}</div>
                </>
              );
            }
            return null;
          })
        }
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
