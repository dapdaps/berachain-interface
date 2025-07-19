import { createContext, useContext, useMemo, useState } from "react";
import Big from "big.js";

const BelongContext = createContext<any>({});

const BelongProvider = (props: any) => {
  const { children, ...rest } = props;

  return (
    <BelongContext.Provider
      value={{ ...rest }}
    >
      {children}
    </BelongContext.Provider>
  );
};

export default BelongProvider;

export const useBelongContext = () => {
  return useContext(BelongContext);
};
