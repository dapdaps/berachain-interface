"use client";

import LuckyBera from "@/sections/playground/lucky-bera";
import BigWheel from "@/sections/playground/big-wheel";
import Magician from "@/sections/playground/magician";
import Gacha from "@/sections/playground/gacha";
import { useParams } from "next/navigation";
import { Games } from "@/configs/playground";
import { camelToKebab } from "@/utils/utils";

const PlaygroundGame = () => {
  const { name } = useParams();

  if (name === camelToKebab(Games.LuckyBera.name)) {
    return (
      <LuckyBera />
    );
  }

  if (name === camelToKebab(Games.BigWheel.name)) {
    return (
      <BigWheel />
    );
  }

  if (name === camelToKebab(Games.GuessWho.name)) {
    return (
      <Magician />
    );
  }

  if (name === camelToKebab(Games.Gacha.name)) {
    return (
      <Gacha />
    );
  }

  // Default game
  return (
    <LuckyBera />
  );
};

export default PlaygroundGame;
