import Coin from "../coin";
import { motion } from "framer-motion";

export default function GoldCoinThrow() {
  return (
    <div className="relative">
      <Coin
        x={[0, -20, -60]}
        y={[0, -10, -20, -60]}
        rotate={[0, 180, 360]}
        duration={0.1}
        i={1}
      />
      <Coin
        x={[0, -50, -100]}
        y={[0, -40, -80, -160]}
        rotate={[0, 180, 350]}
        duration={0.2}
        i={2}
      />
      <Coin
        x={[0, 50, 100]}
        y={[0, -10, -20, -60]}
        rotate={[0, 180, 440]}
        duration={0.1}
        i={3}
      />
      <Coin
        x={[0, 20, 60]}
        y={[0, -50, -100, -200]}
        rotate={[0, 180, 420]}
        duration={0.2}
        i={4}
      />
      <Coin
        x={[0, 80, 160]}
        y={[0, -35, -70, -140]}
        rotate={[0, 180, 440]}
        duration={0.1}
        i={5}
      />
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="68"
        height="79"
        viewBox="0 0 68 79"
        fill="none"
        className="absolute left-[8px] top-[0px]"
        initial={{
          y: 50
        }}
        animate={{
          y: 0
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M61 6H14V39H61V6ZM60.5825 39.3877H6.9903V60.3586H13.9806V66.572H60.5825L60.5825 60.3586L60.5825 60.3584L60.5825 39.3877ZM20.9709 66.5723H53.5922V72.7859H20.9709V66.5723Z"
          fill="#EBF479"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.5243 0H20V5.99029H13.9806H6.99029V12.2039V39.3884L0 39.3883V60.3592H6.99029V66.5728H13.9806V72.7864H20.9709V79H53.5922V72.7864H60.5825V66.5728H67.5728V12.2039H61V6H41V0H36.5049H34H27H22.5243ZM53.5922 33.1748V39.3884H60.5825V66.5728H53.5922V72.7864H20.9709V66.5728H13.9806V60.3592H6.99029V39.3884H10.0971H13.9806H20V40H27V39.3884H34V46H41V39.3884H46.6019V33.1748H53.5922ZM53.5922 33.1748V13H60.5825V33.1748L53.5922 33.1748ZM46.6019 33.1748L41 33.1748V13H46.6019V33.1748ZM27 6.21359H34V33.1748H27V6.21359ZM13.9806 12.2039V33.1748H20V12.2039H13.9806ZM34.1748 46.3786H20.1942V52.5922H34.1748V46.3786Z"
          fill="black"
        />
      </motion.svg>
    </div>
  );
}
