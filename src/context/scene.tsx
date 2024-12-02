'use client';

import { createContext, ReactNode } from 'react';
import { ISceneContext, sceneDefault, useSceneValue } from '@/hooks/use-scene';

export const SceneContext = createContext<ISceneContext>(sceneDefault);

function SceneContextProvider({ children }: { children: ReactNode; }) {
  const sceneValue = useSceneValue();

  return (
    <SceneContext.Provider value={{ scene: sceneValue }} >
      {children}
    </SceneContext.Provider>
  );
}

export default SceneContextProvider;
