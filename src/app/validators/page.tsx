"use client";

import { memo, useEffect } from "react";
import HallView from "@/sections/hall"
import { useHall } from "@/stores/hall";

export default memo(function ValidatorsPage() {
  const store: any = useHall();

  useEffect(() => {
    store.set({
      currentTab: "validators"
    })
  }, []);

  return (
    <HallView />
  )
})
