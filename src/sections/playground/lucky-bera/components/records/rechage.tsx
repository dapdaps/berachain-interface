import { motion } from "framer-motion";

const LuckyBeraRechage = (props: any) => {
  const { className } = props;

  return (
    <motion.div
      className="w-full"
      initial={{
        opacity: 0,
        x: 50,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 50,
      }}
    >
      <h1>LuckyBeraRecords</h1>
    </motion.div>
  );
};

export default LuckyBeraRechage;
