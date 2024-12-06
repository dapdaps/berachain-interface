import { AnimatePresence, motion } from 'framer-motion';

const Swiper = (props: any) => {
  const { current, list, renderItem } = props;

  return (
    <AnimatePresence mode="wait">
      {
        list.map((item: any, index: number) => {
          return current === item.id ? (
            <motion.div
              key={item.id}
              className="flex-1"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
            >
              {renderItem(item, index)}
            </motion.div>
          ) : null
        })
      }
    </AnimatePresence>
  );
};

export default Swiper;
