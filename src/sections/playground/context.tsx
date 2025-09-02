import { createContext, useContext } from "react";

const PlaygroundContext = createContext<any>(null);

export const PlaygroundProvider = (props: any) => {
  const { children, value } = props;

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export const usePlaygroundContext = () => {
  return useContext(PlaygroundContext);
};
