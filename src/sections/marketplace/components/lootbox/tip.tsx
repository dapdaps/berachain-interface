import { AnimatePresence, motion } from "framer-motion";

const LootboxTip = (props: any) => {
  const { } = props;

  return (
    <AnimatePresence>
      <motion.div
        className="w-[450px] md:hidden absolute left-1/2 -translate-x-1/2 top-[10px] border border-black rounded-[10px] bg-[#FFF5A9] p-[10px_15px] font-Montserrat text-[14px] text-black font-[500] shadow-shadow1"
        style={{
          x: "-50%",
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        Limited-Time Offer: Buy <strong>5</strong> Lootboxes at once, Get <strong>1 FREE</strong>!
      </motion.div>
    </AnimatePresence>
  );
};

export default LootboxTip;
