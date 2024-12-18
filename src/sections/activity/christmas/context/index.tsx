'use client';

import { createContext, ReactNode } from 'react';
import { IQuest, useQuest } from '../hooks/use-quest';
import { IBase, useBase } from '@/sections/activity/christmas/hooks/use-base';
import { INft, useNft } from '@/sections/activity/christmas/hooks/use-nft';
import useIsMobile from '@/hooks/use-isMobile';

interface IChristmasContext extends IBase, IQuest, INft {
  isMobile?: boolean;
}

export const ChristmasContext = createContext<Partial<IChristmasContext>>({});

function SceneContextProvider({ children }: { children: ReactNode; }) {
  const base = useBase();
  const quest = useQuest({ base });
  const nft = useNft({ base });
  const isMobile = useIsMobile();

  return (
    <ChristmasContext.Provider value={{ ...quest, ...base, ...nft, isMobile }} >
      {children}
    </ChristmasContext.Provider>
  );
}

export default SceneContextProvider;
