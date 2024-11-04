import { AnimatePresence, motion } from 'framer-motion';

export default function Mobile({
  bodyRef,
  tabs,
  bodyClassName,
  currentTab,
  bodyInnerClassName
}: any) {
  return (
    <div
      ref={bodyRef}
      className={`mt-[10px] relative z-[1] rounded-t-[20px] bg-[#FFFDEB] border border-black ${bodyClassName} h-[calc(100%-10px)] hidden md:block`}
    >
      <AnimatePresence mode='wait'>
        {tabs.map((tab: any, idx: number) => {
          if (tab.key === currentTab) {
            return (
              <>
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
