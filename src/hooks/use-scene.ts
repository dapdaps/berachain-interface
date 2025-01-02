import { SceneStatus } from '@/configs/scene';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { get } from '@/utils/http';
import { getRemainingDatetime, getUTCDatetime, getUTCTimestamp } from '@/utils/date';
import * as dateFns from 'date-fns';

export const SCENE_LIST: Scene[] = [
  {
    id: 1,
    name: 'Beramas Wonderland',
    description: '',
    path: '/activity/christmas',
    status: SceneStatus.Ongoing,
    api: '/api/mas',
    handleTime: (config) => {
      if (!config) return {};
      let { start_time, end_time } = config;
      if (!start_time || !end_time) return {};
      start_time = start_time * 1000;
      end_time = end_time * 1000;
      return {
        startUTCTime: getUTCDatetime(start_time),
        endUTCTime: getUTCDatetime(end_time),
      };
    },
  },
];

export function useSceneValue(): ISceneContext {
  const pollingTimer = useRef<any>();

  const [list] = useState<Scene[]>(SCENE_LIST);
  // ⚠️ this is the current scene
  // the end time of the scene and the activity page may not be the same
  const [current] = useState<Scene>(SCENE_LIST[0]);
  // ⚠️ this is the current activity page data
  const [currentSceneInfo, setCurrentSceneInfo] = useState<any>();
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [currentUTCZeroTimestamp, setCurrentUTCZeroTimestamp] = useState<number>();
  const [currentUTCString, setCurrentUTCString] = useState<string>();
  const [currentSceneInfoLoading, setCurrentSceneInfoLoading] = useState<boolean>(true);
  const [currentRemainingDatetime, setCurrentRemainingDatetime] = useState<string>();

  const currentSceneInfoValid = useMemo(() => {
    if (!currentSceneInfo) return false;
    return currentSceneInfo.status === SceneStatus.Ongoing;
  }, [currentSceneInfo, currentSceneInfoLoading]);

  const getCurrentTimestamp = useCallback(async () => {
    let currTimestamp = new Date().getTime();
    let res: any;
    try {
      res = await get(`/api/timestamp`);
    } catch (err: any) {
      console.log('getCurrentTimestamp failed: %o', err);
    }
    if (res?.code === 0 && res?.data?.timestamp) {
      currTimestamp = res.data?.timestamp * 1000;
      // currTimestamp = new Date('2024-12-31 23:59:59').getTime();
      // currTimestamp = new Date('2025-01-01 00:00:00').getTime();
    }
    const _currentDateTime = new Date(currTimestamp);
    setCurrentDateTime(_currentDateTime);
    const utc = getUTCTimestamp(currTimestamp);
    const _currentUTCString = getUTCDatetime(currTimestamp);
    setCurrentUTCString(_currentUTCString);
    const _currentUTCZeroTimestamp = dateFns.setSeconds(dateFns.setMinutes(dateFns.setHours(utc, 0), 0), 0).getTime();
    setCurrentUTCZeroTimestamp(_currentUTCZeroTimestamp);
    return {
      currentDateTime: _currentDateTime,
      currentUTCString: _currentUTCString,
      currentUTCZeroTimestamp: _currentUTCZeroTimestamp,
    };
  }, []);

  const getCurrentSceneInfo = useCallback(async (times: any) => {
    if (!current || !current.api) {
      setCurrentSceneInfoLoading(false);
      return;
    }
    try {
      const res = await get(current.api);
      if (res.code !== 0) {
        setCurrentSceneInfoLoading(false);
        return;
      }
      const { startUTCTime, endUTCTime } = current.handleTime(res.data);
      res.data.startUTCTime = startUTCTime;
      res.data.endUTCTime = endUTCTime;
      res.data.status = SceneStatus.Invalid;
      console.log('currentUTCString: %o', times.currentUTCString);
      console.log('startUTCTime: %o', startUTCTime);
      console.log('endUTCTime: %o', endUTCTime);
      if (!startUTCTime || !endUTCTime) {
        setCurrentSceneInfoLoading(false);
        setCurrentSceneInfo(res.data);
        return;
      }

      res.data.status = SceneStatus.Ongoing;
      if (dateFns.isBefore(new Date(times.currentUTCString), new Date(startUTCTime))) {
        res.data.status = SceneStatus.UnStart;
      }
      if (dateFns.isAfter(new Date(times.currentUTCString), new Date(endUTCTime)) || dateFns.isEqual(new Date(times.currentUTCString), new Date(endUTCTime))) {
        res.data.status = SceneStatus.Ended;
      }
      setCurrentSceneInfo(res.data);
    } catch (err: any) {
      console.log('getCurrentScene failed: %o', err);
    }
    setCurrentSceneInfoLoading(false);
  }, []);

  useEffect(() => {
    // const loadingTimeout = setTimeout(() => {
    //   clearTimeout(loadingTimeout);
    //   setCurrentSceneInfoLoading(false);
    // }, 600);

    getCurrentTimestamp().then((times) => {
      getCurrentSceneInfo(times);
    });
    // const timer = setInterval(() => {
    //   getCurrentTimestamp().then((times) => {
    //     getCurrentSceneInfo(times);
    //   });
    // // pooling: 1 hour/time
    // }, 3600000);
    //
    // return () => {
    //   clearInterval(timer);
    //   clearTimeout(loadingTimeout);
    // };
  }, []);

  useEffect(() => {
    if (!currentUTCString || !currentSceneInfo) {
      return;
    }
    let _currentTime = new Date(currentUTCString);
    const calc = () => {
      try {
        // console.log('_currentTime: %o', dateFns.format(_currentTime, 'yyyy-MM-dd hh:mm:ss'));
        // console.log('endUTCTime: %o', currentSceneInfo.endUTCTime);
        const diff = getRemainingDatetime(_currentTime, new Date(currentSceneInfo.endUTCTime));
        // console.log('diff: %o', diff);
        setCurrentRemainingDatetime(diff);
      } catch (err: any) {
        console.log(err);
        setCurrentRemainingDatetime('');
      }

      if (dateFns.isEqual(_currentTime, new Date(currentSceneInfo.endUTCTime))) {
        getCurrentTimestamp().then((times) => {
          getCurrentSceneInfo(times);
        });
      }
      if (dateFns.isAfter(_currentTime, new Date(currentSceneInfo.endUTCTime))) {
        clearInterval(pollingTimer.current);
      }
    };
    calc();
    // pollingTimer.current = setInterval(() => {
    //   _currentTime = dateFns.addSeconds(_currentTime, 1);
    //   calc();
    // }, 1000);
    //
    // return () => {
    //   clearInterval(pollingTimer.current);
    // };
  }, [currentUTCString, currentSceneInfo]);

  return {
    currentSceneInfoLoading,
    currentSceneInfoValid,
    list,
    current,
    currentSceneInfo,
    currentDateTime,
    currentUTCZeroTimestamp,
    currentUTCString,
    currentRemainingDatetime,
  };
}

export interface ISceneContext {
  currentSceneInfoLoading: boolean;
  currentSceneInfoValid: boolean;
  list: Scene[];
  current?: Scene;
  currentSceneInfo?: any;
  currentDateTime: Date;
  currentUTCZeroTimestamp?: number;
  currentUTCString?: string;
  currentRemainingDatetime?: string;
}

export const sceneDefault = {
  currentSceneInfoLoading: true,
  list: SCENE_LIST,
  current: SCENE_LIST[0],
  currentDateTime: new Date(),
};

export interface Scene {
  id: number;
  name: string;
  description?: string;
  path: string;
  status: SceneStatus;
  api: string;
  handleTime: (config?: any) => ({ startUTCTime?: string; endUTCTime?: string; });
}
