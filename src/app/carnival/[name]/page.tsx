"use client";

import LuckyBera from "@/sections/playground/lucky-bera";
import BigWheel from "@/sections/playground/big-wheel";
import { useParams } from "next/navigation";

const PlaygroundGame = () => {
  const { name } = useParams();

  if (name === "lucky-bera") {
    return (
      <LuckyBera />
    );
  }

  if (name === "big-wheel") {
    return (
      <BigWheel />
    );
  }

  // Default game
  return (
    <LuckyBera />
  );
};

export default PlaygroundGame;
