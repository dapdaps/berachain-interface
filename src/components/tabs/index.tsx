import Tab from '@/components/tabs/tab';
import { useEffect, useMemo, useRef, useState } from 'react';
import TabsWrapper from './tabs-wrapper';
import TabPanels from './tab-panels';
import useIsMobile from '@/hooks/use-isMobile';
import config from './config';

const Tabs = (props: TabsProps) => {
  const {
    currentTab,
    tabs,
    className,
    style,
    bodyClassName,
    bodyStyle,
    bodyInnerClassName,
    onChange = () => {},
    isCard
  } = props;

  const isMobile = useIsMobile();
  const screenConfig = config[isMobile ? 'mobile' : 'laptop'];

  const bodyRef = useRef<any>(null);

  const currentTabIndex = useMemo(() => {
    const _index = tabs.findIndex((tab) => tab.key === currentTab);
    if (_index < 0) return 0;
    return _index;
  }, [currentTab]);

  const handleChange = (tabKey: TabKey, tab: Tab, index: number) => {
    onChange && onChange(tabKey, tab, index);
  };

  const [contentBorderTopRightRadius, setContentBorderTopRightRadius] =
    useState(0);
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
    const tabsWidth = screenConfig.tabWidth * tabs.length;
    if (tabsWidth >= contentWidth - 2) {
      setContentBorderTopRightRadius(0);
      return;
    }
    setContentBorderTopRightRadius(20);
  }, [tabs]);

  return (
    <div className={`${!!className ? className : ''} h-full`} style={style}>
      <TabsWrapper isCard={isCard}>
        {tabs.map((tab, idx) => {
          return (
            <Tab
              key={tab.key}
              active={currentTabIndex === idx}
              onClick={() => handleChange(tab.key, tab, idx)}
              isCard={isCard}
              width={screenConfig.tabWidth}
              height={screenConfig.tabHeight}
            >
              {tab.label}
            </Tab>
          );
        })}
      </TabsWrapper>
      <TabPanels
        bodyRef={bodyRef}
        currentTabIndex={currentTabIndex}
        tabs={tabs}
        contentBorderTopRightRadius={contentBorderTopRightRadius}
        bodyClassName={bodyClassName}
        bodyStyle={bodyStyle}
        currentTab={currentTab}
        platform={platform}
        bodyInnerClassName={bodyInnerClassName}
        isCard={isCard}
        {...screenConfig}
      />
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
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  bodyInnerClassName?: string;
  onChange?(key: TabKey, tab: Tab, index: number): void;
  isCard?: boolean;
}

export interface Tab {
  key: TabKey;
  label: any;
  children: any;
  disabled?: boolean;
}
