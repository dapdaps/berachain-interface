import { SceneStatus } from '@/configs/scene';
import { useState } from 'react';

export const SCENE_LIST: Scene[] = [
  { id: 1, name: 'Beramas Wonderland', description: '', path: '/activity/christmas', status: SceneStatus.Ongoing },
];

export function useSceneValue(): ISceneContext {
  const [list] = useState<Scene[]>(SCENE_LIST);
  const [current] = useState<Scene>(SCENE_LIST[0]);

  return {
    list,
    current,
  };
}

export interface ISceneContext {
  list: Scene[];
  current?: Scene;
}

export const sceneDefault = {
  list: SCENE_LIST,
  current: SCENE_LIST[0],
};

export interface Scene {
  id: number;
  name: string;
  description?: string;
  path: string;
  status: SceneStatus;
}
