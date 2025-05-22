export const motionStaggerParent = (staggerChildren?: number) => {
  return {
    variants: {
      hidden: {},
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    },
    initial: "hidden",
    animate: "visible"
  };
};

export const motionStaggerChildren = {
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
  }
};
