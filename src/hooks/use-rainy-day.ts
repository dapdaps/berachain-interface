import { useContext, useMemo } from 'react';
import { SceneContext } from '@/context/scene';
import { SceneStatus } from '@/configs/scene';

export function useRainyDay() {
  const context = useContext(SceneContext);
  const scene = context.current;

  const isRainyDay = useMemo(() => {
    return scene?.status === SceneStatus.Ongoing;
  }, [scene]);

  return {
    ...scene,
    isRainyDay,
  };
}
