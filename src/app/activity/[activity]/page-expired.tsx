"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

export default function Activity() {
  const urlParams = useParams();
  if (urlParams.activity === "christmas") {
    const Com = dynamic(() => import("@/sections/activity/christmas"));
    return <Com />;
  }
  return <div />;
}
