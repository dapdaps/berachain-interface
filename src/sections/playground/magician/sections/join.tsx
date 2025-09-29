import { motion } from "framer-motion";

const Join = (props: any) => {
  const {
    magician,
    create,
    join,
  } = props;

  return (
    <motion.div
      className="w-full flex flex-col items-center pt-[50px]"
      initial={{
        x: 200,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{
        x: 200,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <div className="w-[1064px] h-[772px] relative flex flex-col items-center shrink-0 bg-[url('/images/playground/magician/carriage.png')] bg-center bg-no-repeat bg-contain">
        <button
          type="button"
          className="w-[144px] h-[40px] border-[1px] rounded-l-[12px] absolute left-[52px] top-[226px] opacity-0 hover:opacity-30 bg-white/50 transition-all duration-300"
          onClick={() => {
            join.onClose();
          }}
        />
      </div>
    </motion.div>
  );
};

export default Join;
