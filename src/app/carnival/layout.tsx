"use client";
import { Games } from "@/configs/playground";
import PlaygroundLayout from "@/sections/playground/layout";
import { camelToKebab } from "@/utils/utils";
import { useParams } from "next/navigation";

const Playground = (props: any) => {
  const { children } = props;
  const { name } = useParams();
  if (name === camelToKebab(Games.Gacha.name)) {
    return children;
  }

  return (
    <PlaygroundLayout>
      {children}
    </PlaygroundLayout>
  );
};

export default Playground;
