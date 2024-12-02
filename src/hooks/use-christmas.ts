import { useContext } from 'react';
import { SceneContext } from '@/context/scene';

export function useChristmas() {
  const context = useContext(SceneContext);
  const scene = context.scene.current;

  return {
    ...scene,
  };
}
