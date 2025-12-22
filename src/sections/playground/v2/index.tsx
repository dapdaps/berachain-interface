"use client";

import useIsMobile from "@/hooks/use-isMobile";
import GameIndexMobile from "./mobile";
import GameIndexLaptop from "./laptop";

const GameIndex = () => {

  const isMobile = useIsMobile();

  return isMobile ? <GameIndexMobile /> : <GameIndexLaptop />;
};

export default GameIndex;
