import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { get } from '@/utils/http';
import useCustomAccount from '@/hooks/use-account';
import useTokenBalance from '@/hooks/use-token-balance';
import { beraB } from '@/configs/tokens/bera-bArtio';
import { SceneContext } from '@/context/scene';
import { SceneStatus } from '@/configs/scene';

export function useBase(): IBase {
  const { account, provider } = useCustomAccount();
  const {
    currentSceneInfo,
    currentDateTime,
    currentUTCString,
    currentUTCZeroTimestamp,
    currentSceneInfoLoading,
    currentSceneInfoValid,
  } = useContext(SceneContext);

  const [userLoading, setUserLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<Partial<UserMas>>({});
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [userBox, setUserBox] = useState<UserBox>({});
  const [userBoxLoading, setUserBoxLoading] = useState<boolean>(false);

  const activityInvalid = useMemo(() => {
    return !currentSceneInfoValid;
  }, [currentSceneInfoValid]);

  const {
    tokenBalance: snowflakeBalance,
    isLoading: snowflakeBalanceLoading
  } = useTokenBalance(beraB['sfc'].address, beraB['sfc'].decimals);

  const userRemainBox = useMemo(
    () => (userBox?.total_box || 0) - (userBox?.used_box || 0),
    [userBox]
  );

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

  const getUserBox = async () => {
    setUserBoxLoading(true);
    const res = await get(`/api/mas/user/box?account=${account}`);
    if (res.code !== 0) {
      setUserBoxLoading(false);
      return;
    }
    setUserBox({ key: +new Date(), ...res.data });
    setUserBoxLoading(false);
  };

  useEffect(() => {
    if (!account) return;
    getUserBox();
  }, [account]);

  return {
    infoLoading: currentSceneInfoLoading,
    userInfoLoading: userLoading,
    info: currentSceneInfo,
    userInfo,
    getUserInfo,
    currentDateTime,
    currentUTCString,
    currentUTCZeroTimestamp,
    showSwapModal,
    setShowSwapModal,
    userRemainBox,
    snowflakeBalance,
    snowflakeBalanceLoading,
    userBox,
    userBoxLoading,
    getUserBox,
    activityInvalid,
  };
}

export interface IBase {
  infoLoading: boolean;
  userInfoLoading: boolean;
  snowflakeBalanceLoading: boolean;
  info: Partial<Mas>;
  userInfo: Partial<UserMas>;
  currentUTCString?: string;
  currentUTCZeroTimestamp?: number;
  currentDateTime?: Date;
  showSwapModal: boolean;
  setShowSwapModal: Dispatch<SetStateAction<boolean>>;
  userRemainBox: number;
  snowflakeBalance: string;
  userBox: Partial<UserBox>;
  userBoxLoading: boolean;
  activityInvalid: boolean;
  getUserInfo(): void;
  getUserBox(): Promise<void>;
}

export interface Mas {
  end_time: number;
  id: number;
  start_time: number;
  total_box: number;
  total_token: string;
  total_users: number;
  total_yap: number;
  status?: SceneStatus;
  startUTCTime?: string;
  endUTCTime?: string;
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

export interface UserBox {
  total_box?: number;
  used_box?: number;
}
