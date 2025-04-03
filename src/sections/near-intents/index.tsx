"use client";

import Faq from "./components/Faq";
import SwapViews from "./views/SwapViews";
import { useState } from "react";
import Rank from "./components/Rank";
import Rules from "./components/Rules";

const NearIntents = () => {
  return (
    <>
      <SwapViews />
      <Faq />
      <Rank />
      <Rules />
    </>
  );
};

export default NearIntents