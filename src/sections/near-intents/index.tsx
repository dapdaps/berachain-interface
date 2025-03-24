"use client";

import Faq from "./components/Faq";
import SwapViews from "./views/SwapViews";
import { useState } from "react";
import Rank from "./components/Rank";

const NearIntents = () => {
  return (
    <>
      <SwapViews />
      <Faq />
      <Rank />
    </>
  );
};

export default NearIntents