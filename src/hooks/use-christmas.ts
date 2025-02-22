import { useContext, useMemo } from 'react';
import { SceneContext } from '@/context/scene';
import { SceneStatus } from '@/configs/scene';

export function useChristmas() {
  const context = useContext(SceneContext);
  const scene = context.current;

  const isChristmas = useMemo(() => {
    return scene?.status === SceneStatus.Ongoing && scene.id === 1;
  }, [scene]);

  return {
    ...scene,
    isChristmas,
  };
}
