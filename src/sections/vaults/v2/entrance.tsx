import { motion } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';

const VaultsEntrance = (props: any) => {
  const { className } = props;

  return (
    <Link
      href="/vaults"
      className={clsx("flex flex-col items-center", className)}
    >
      <motion.img
        src="/images/vaults/v2/entry.png"
        alt=""
        className="w-[94px] h-[94px] object-center object-contain origin-bottom"
        variants={{
          shake: {
            rotate: [0, -12, 12, -8, 8, -4, 4, 0],
          },
        }}
        animate="shake"
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: 5,
          repeatDelay: 5,
        }}
      />
      <img
        src="/images/vaults/v2/entry-title.png"
        alt=""
        className="w-[79px] h-[25px] object-center object-contain absolute bottom-0"
      />
    </Link>
  );
};

export default VaultsEntrance;
