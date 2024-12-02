import { useContext, useMemo } from 'react';
import { SceneContext } from '@/context/scene';
import { SceneStatus } from '@/configs/scene';

export function useChristmas() {
  const context = useContext(SceneContext);
  const scene = context.scene.current;

  const isChristmas = useMemo(() => {
    return scene?.status === SceneStatus.Ongoing;
  }, [scene]);

  return {
    ...scene,
    isChristmas,
  };
}
