import clsx from "clsx";
import { motion } from "framer-motion";

const Kirov = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx("w-full overflow-hidden fixed z-[1] top-[80px] left-0", className)}>
      <motion.div
        className="flex items-center"
        initial={{ transform: "translateX(100vw)" }}
        animate={{ transform: "translateX(-100vw)" }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      >
        <img
          src="/images/home-earth/v2/kirov.png"
          alt=""
          className="w-[443px] h-[197px] shrink-0 object-center object-contain"
        />
        <KirovFlag />
      </motion.div>
    </div>
  );
};

export default Kirov;

const KirovFlag = (props: any) => {
  const { className, children } = props;

  return (
    <div className="relative w-[386px] h-[107px] shrink-0 translate-y-[-10px]">
      <img
        src="/images/home-earth/v2/kirov-flag.png"
        alt=""
        className="w-full h-full shrink-0 object-center object-contain"
      />
      <div className="absolute z-[1] left-0 top-0 w-full h-full grid grid-cols-3 gap-[5px] pt-[21px]">
        <LabelValue label="Protocols intergrated">
          12
        </LabelValue>
        <LabelValue label="Users">
          50k+
        </LabelValue>
        <LabelValue
          label={(
            <div>All time<br /> volume</div>
          )}
        >
          10m+
        </LabelValue>
      </div>
    </div>
  );
};

const LabelValue = (props: any) => {
  const { label, children, labelClassName, valueClassName, className } = props;

  return (
    <div className={clsx("flex flex-col items-center gap-[5px] font-CherryBomb text-[16px] font-[400] text-black text-center", className)}>
      <div className={clsx("text-[32px] leading-[90%]", valueClassName)}>
        {children}
      </div>
      <div className={clsx("h-[30px] flex items-center leading-[90%]", labelClassName)}>
        {label}
      </div>
    </div>
  );
};
