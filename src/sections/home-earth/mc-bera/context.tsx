import { createContext, useContext } from 'react';

export const McBeraContext = createContext<any>({});

const McBeraProvider = (props: any) => {
  const { children, value } = props;

  return (
    <McBeraContext.Provider value={value}>
      {children}
    </McBeraContext.Provider>
  );
};

export default McBeraProvider;

export function useMcBera() {
  return useContext(McBeraContext);
}
