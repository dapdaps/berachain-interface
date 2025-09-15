import useAccount from "@/hooks/use-account";
import Bear from "@/sections/cave/Bear";
import useCollect from "@/sections/cave/useCollect";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

const HomeEarthBear = (props: any) => {
  const { bearRef } = props;

  const { account } = useAccount();
  const {
    cars,
    hats,
    clothes,
    necklaces,
  } = useCollect({
    address: account as string,
  });

  // Add delayed display state to prevent content flickering
  const [showContent, setShowContent] = useState(false);

  const [isWearing] = useMemo(() => {
    return [
      cars?.some((car) => car.checked) || hats?.some((hat) => hat.checked) || clothes?.some((cloth) => cloth.checked) || necklaces?.some((necklace) => necklace.checked),
    ];
  }, [cars, hats, clothes, necklaces]);

  // Delay content display to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {
        !showContent ? null : (
          <>
            {
              isWearing ? (
                <motion.div
                  key="caveBear"
                  className="pointer-events-none bottom-[5%] left-1/2 -translate-x-1/2 absolute scale-50 origin-bottom z-[4]"
                  style={{
                    x: "-50%",
                    scale: 0.5,
                  }}
                  {...animationsVariants}
                >
                  <Bear
                    cars={cars}
                    hats={hats}
                    clothes={clothes}
                    necklaces={necklaces}
                    items={[]}
                    className="!scale-100 !relative !bottom-0"
                  />
                </motion.div>
              ) : (
                <motion.img
                  key="defaultBear"
                  ref={bearRef}
                  src="/images/background/bear.gif"
                  alt=""
                  className="w-[360px] h-[356px] absolute z-[4] top-[37.4dvh] pointer-events-none"
                  {...animationsVariants}
                />
              )
            }
          </>
        )
      }
    </AnimatePresence>
  );
};

export default HomeEarthBear;

const animationsVariants = {
  variants: {
    visible: {
      opacity: 1,
      y: 0,
    },
    invisible: {
      opacity: 0,
      y: 200,
    },
  },
  transition: {
    duration: 0.3,
    ease: "linear",
  },
  initial: "invisible",
  animate: "visible",
  exit: "invisible",
};
