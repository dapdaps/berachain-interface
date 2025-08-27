"use client";

import LuckyBera from "@/sections/playground/lucky-bera";
import { useParams } from "next/navigation";

const PlaygroundGame = () => {
  const { name } = useParams();

  if (name === "lucky-bera") {
    return (
      <LuckyBera />
    );
  }

  // Default game
  return (
    <LuckyBera />
  );
};

export default PlaygroundGame;
