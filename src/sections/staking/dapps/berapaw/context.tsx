import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface BeraPawContextProps {
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
}

const BeraPawContext = createContext<Partial<BeraPawContextProps>>({});

const BeraPawContextProvider = (props: any) => {
  const { value, children } = props;

  return (
    <BeraPawContext.Provider value={{ ...value }}>
      {children}
    </BeraPawContext.Provider>
  );
};

export default BeraPawContextProvider;

export function useBeraPawContext() {
  return useContext(BeraPawContext);
}
