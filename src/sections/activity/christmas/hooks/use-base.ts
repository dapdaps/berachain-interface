import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { get } from '@/utils/http';
import useCustomAccount from '@/hooks/use-account';
import * as dateFns from 'date-fns';

export function useBase(): IBase {
  const { account, provider } = useCustomAccount();

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [info, setInfo] = useState<Partial<Mas>>({});
  const [userInfo, setUserInfo] = useState<Partial<UserMas>>({});
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [currentDailyTimestamp, setCurrentDailyTimestamp] = useState<number>();
  const [showSwapModal, setShowSwapModal] = useState(false);

  const userRemainBox = useMemo(
    () => (userInfo?.total_box || 0) - (userInfo?.used_box || 0),
    [userInfo]
  );

  const getInfo = async () => {
    setLoading(true);
    const res = await get('/api/mas');
    if (res.code !== 0) {
      setLoading(false);
      return;
    }
    setInfo(res.data);
    setLoading(false);
  };

  const getUserInfo = async () => {
    setUserLoading(true);
    const res = await get(`/api/mas/user/${account}`);
    if (res.code !== 0) {
      setUserLoading(false);
      return;
    }
    setUserInfo({ key: +new Date(), ...res.data });
    setUserLoading(false);
  };

  const getCurrentTimestamp = async () => {
    const res = await get(`/api/timestamp`);
    let currTimestamp = new Date().getTime();
    if (res.code === 0 && res.data?.timestamp) {
      currTimestamp = res.data?.timestamp * 1000;
      // currTimestamp = new Date('2024-12-24 08:00:00').getTime();
    }
    setCurrentDateTime(new Date(currTimestamp));
    const currUTCDay = dateFns.setSeconds(dateFns.setMinutes(dateFns.setHours(currTimestamp, 0), 0), 0);
    setCurrentDailyTimestamp(currUTCDay.getTime());
  };

  useEffect(() => {
    getInfo();
    getCurrentTimestamp();
    if (!account) return;
    getUserInfo();
  }, [account]);

  return {
    infoLoading: loading,
    userInfoLoading: userLoading,
    info,
    userInfo,
    getUserInfo,
    currentDateTime,
    currentDailyTimestamp,
    showSwapModal,
    setShowSwapModal,
    userRemainBox,
  };
}

export interface IBase {
  infoLoading: boolean;
  userInfoLoading: boolean;
  info: Partial<Mas>;
  userInfo: Partial<UserMas>;
  currentDailyTimestamp?: number;
  currentDateTime?: Date;
  showSwapModal: boolean;
  setShowSwapModal: Dispatch<SetStateAction<boolean>>;
  userRemainBox: number;
  getUserInfo(): void;
}

export interface Mas {
  end_time: number;
  id: number;
  start_time: number;
  total_box: number;
  total_token: string;
  total_users: number;
  total_yap: number;
}

export interface UserMas {
  address: string;
  id: number;
  items: any[];
  nfts: any[];
  rares: any[];
  total_box: number;
  total_token: number;
  total_yap: number;
  used_box: number;
}
