import useAccount from "@/hooks/use-account";
import Bear from "@/sections/cave/Bear";
import useCollect from "@/sections/cave/useCollect";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

const HomeEarthBear = (props: any) => {
  const { bearRef, className, animationDirection = "Bottom" } = props;

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
                  className={clsx("pointer-events-none bottom-[5%] left-1/2 -translate-x-1/2 absolute scale-50 origin-bottom z-[4]", className)}
                  style={{
                    x: "-50%",
                    scale: 0.5,
                  }}
                  {...animationsVariants}
                  animate={`caveVisibleFrom${animationDirection}`}
                  initial={`caveInvisibleFrom${animationDirection}`}
                  exit={`caveInvisibleFrom${animationDirection}`}
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
                  className={clsx("w-[360px] h-[356px] absolute z-[4] top-[37.4dvh] pointer-events-none", className)}
                  {...animationsVariants}
                  animate={`defaultVisibleFrom${animationDirection}`}
                  initial={`defaultInvisibleFrom${animationDirection}`}
                  exit={`defaultInvisibleFrom${animationDirection}`}
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
    defaultVisibleFromBottom: {
      opacity: 1,
      y: 0,
    },
    defaultInvisibleFromBottom: {
      opacity: 0,
      y: 200,
    },
    defaultVisibleFromLeft: {
      opacity: 1,
      x: 0,
    },
    defaultInvisibleFromLeft: {
      opacity: 0,
      x: -200,
    },
    caveVisibleFromBottom: {
      opacity: 1,
      y: 0,
    },
    caveInvisibleFromBottom: {
      opacity: 0,
      y: 200,
    },
    caveVisibleFromLeft: {
      opacity: 1,
      x: "-50%",
    },
    caveInvisibleFromLeft: {
      opacity: 0,
      x: "calc(-50% - 200px)",
    },
  },
  transition: {
    duration: 0.3,
    ease: "linear",
  },
  initial: "defaultInvisibleFromBottom",
  animate: "defaultVisibleFromBottom",
  exit: "defaultInvisibleFromBottom",
};
