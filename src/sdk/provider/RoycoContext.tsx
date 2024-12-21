"use client";

import { createContext } from "react";

const RoycoContext = createContext({
  originUrl: "",
  originKey: "",
  originId: "",
});

export { RoycoContext };
