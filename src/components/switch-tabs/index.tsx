import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function SwitchTabs<Value = any>(props: Props<Value>) {
  const {
    tabs,
    current,
    cursorClassName,
    cursorStyle,
    tabClassName,
    tabStyle,
    renderTabStyle = () => ({}),
    className,
    style,
    onChange,
    isScroll = false
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isReady, setIsReady] = useState(false);

  const currentIndex = useMemo(() => {
    const idx = tabs.findIndex((it) => it.value === current);
    return idx < 0 ? 0 : idx;
  }, [tabs, current]);

  // 处理tab切换
  const handleChange = (tab: any, idx: number) => {
    if (tab.value === current) return;
    onChange?.(tab.value, idx);

    if (isScroll && tabsContainerRef.current && tabRefs.current[idx]) {
      const container = tabsContainerRef.current;
      const selectedTab = tabRefs.current[idx];
      if (!selectedTab) return;

      const tabLeft = selectedTab.offsetLeft;
      const tabWidth = selectedTab.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const scrollRight = scrollLeft + containerWidth;

      if (tabLeft < scrollLeft) {
        container.scrollTo({ left: tabLeft, behavior: 'smooth' });
      } else if (tabLeft + tabWidth > scrollRight) {
        container.scrollTo({ 
          left: tabLeft + tabWidth - containerWidth, 
          behavior: 'smooth' 
        });
      }
    }
  };

  useEffect(() => {
    const allRefsReady = tabRefs.current.every((ref, index) => 
      index >= tabs.length || ref !== null
    );

    if (allRefsReady) {
      setIsReady(true);
      if (current === undefined && tabs.length > 0) {
        onChange?.(tabs[0].value, 0);
      }
    }
  }, [tabs, current, onChange]);

  const getCursorStyle = () => {
    if (!isReady || !tabRefs.current[currentIndex]) return {};
    
    const currentTab = tabRefs.current[currentIndex];
    return {
      width: currentTab?.offsetWidth,
      transform: `translateX(${currentTab?.offsetLeft}px)`
    };
  };

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative h-[56px] md:h-[36px] rounded-[12px] md:rounded-[20px] border border-[#373A53] bg-white overflow-hidden",
        className
      )}
      style={style}
    >
      <div className="absolute inset-0 p-[5px_4px] md:p-[3px]">
        <div 
          ref={tabsContainerRef}
          className={clsx(
            "h-full relative",
            isScroll ? "overflow-x-auto no-scrollbar" : ""
          )}
        >
          <div 
            className="h-full flex items-stretch relative"
            style={{
              width: isScroll ? 'max-content' : '100%'
            }}
          >
            {isReady && (
              <motion.div
                className={clsx(
                  "absolute top-0 h-full bg-[#FFDC50] border border-black rounded-[10px] md:rounded-[16px]",
                  cursorClassName
                )}
                initial={false}
                animate={getCursorStyle()}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                style={cursorStyle}
              />
            )}

            {/* Tabs */}
            {tabs.map((tab, idx) => (
              <div
                key={idx}
                ref={el => {
                  tabRefs.current[idx] = el;
                }}
                className={clsx(
                  "h-full font-bold lg:text-[14px] md:text-[15px] text-black md:font-[600] flex justify-center items-center cursor-pointer px-4 relative z-10",
                  isScroll ? "flex-shrink-0" : "flex-1",
                  tabClassName
                )}
                style={{
                  opacity: tab.disabled ? 0.3 : 1,
                  cursor: tab.disabled
                    ? "not-allowed"
                    : "url('../../public/images/cursor.svg') 12 0, auto",
                  ...tabStyle,
                  ...renderTabStyle(tab, idx)
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tab.disabled) return;
                  handleChange(tab, idx);
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwitchTabs;

interface Props<Value> {
  tabs: { value: Value; label: any; disabled?: boolean }[];
  current?: Value;
  className?: string;
  style?: React.CSSProperties;
  cursorClassName?: string;
  cursorStyle?: React.CSSProperties;
  tabClassName?: string;
  tabStyle?: React.CSSProperties;
  isScroll?: boolean;

  onChange?(current: Value, index: number): void;
  renderTabStyle?(
    tab: { value: Value; label: any; disabled?: boolean },
    idx: number
  ): React.CSSProperties;
}