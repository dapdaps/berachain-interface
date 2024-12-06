'use client';

import { createContext, ReactNode } from 'react';
import { IQuest, useQuest } from '../hooks/use-quest';
import { IBase, useBase } from '@/sections/activity/christmas/hooks/use-base';
import { INft, useNft } from '@/sections/activity/christmas/hooks/use-nft';

interface IChristmasContext extends IBase, IQuest, INft {
}

export const ChristmasContext = createContext<Partial<IChristmasContext>>({});

function SceneContextProvider({ children }: { children: ReactNode; }) {
  const base = useBase();
  const quest = useQuest();
  const nft = useNft();

  return (
    <ChristmasContext.Provider value={{ ...quest, ...base, ...nft }} >
      {children}
    </ChristmasContext.Provider>
  );
}

export default SceneContextProvider;
