import { SceneStatus } from '@/configs/scene';
import { useState } from 'react';

export const SCENE_LIST: Scene[] = [
  { id: 1, name: 'Beramas Wonderland', description: '', path: '/beramas-wonderland', status: SceneStatus.Ongoing },
];

export function useSceneValue(): SceneValues {
  const [list] = useState<Scene[]>(SCENE_LIST);
  const [current] = useState<Scene>(SCENE_LIST[0]);

  return {
    list,
    current,
  };
}

interface SceneValues {
  list: Scene[];
  current?: Scene;
}

export interface ISceneContext {
  scene: SceneValues;
}

export const sceneDefault = {
  scene: {
    list: SCENE_LIST,
    current: SCENE_LIST[0],
  },
};

export interface Scene {
  id: number;
  name: string;
  description?: string;
  path: string;
  status: SceneStatus;
}
