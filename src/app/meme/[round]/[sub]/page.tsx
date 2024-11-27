"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

export default function MemePage() {
  const urlParams = useParams();
  if (urlParams.round === "bros") {
    const Bros = dynamic(() => import("@/sections/meme/bros"));
    return <Bros />;
  }
  return <div />;
}
