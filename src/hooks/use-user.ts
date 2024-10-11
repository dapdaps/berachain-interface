import { useUserStore } from '@/stores/user';
import { useCallback } from 'react';
import { get, post } from '@/utils/http';
import { useAccount } from 'wagmi';

export function useUser() {
  const { address } = useAccount();

  const accessToken = useUserStore((store: any) => store.accessToken?.access_token);
  const accessTokenLoading = useUserStore((store: any) => store.accessTokenLoading);
  const userInfo = useUserStore((store: any) => store.user);
  const userInfoLoading = useUserStore((store: any) => store.loading);
  const setUserInfo = useUserStore((store: any) => store.set);

  const getUserInfo = useCallback(async () => {
    setUserInfo({ loading: true });
    try {
      const result = await get('/api/user');
      const data = result?.data || {};
      setUserInfo({ user: data, loading: false });
      return data;
    } catch (err) {
      console.log('getUserInfo failed: %o', err);
      setUserInfo({ user: {}, loading: false });
      return {};
    }
  }, []);

  const getAccessToken = async () => {
    setUserInfo({ accessTokenLoading: true });
    if (!address) {
      setUserInfo({
        user: {},
        accessToken: {
          access_token: '',
          refresh_access_token: '',
          token_type: 'bearer',
        },
        accessTokenLoading: false,
      });
      return;
    }

    const res = await post('/api/auth/access-token', {
      address,
    });
    setUserInfo({
      accessToken: res,
      accessTokenLoading: false,
    });
    await getUserInfo();
  };

  return {
    userInfo,
    userInfoLoading,
    accessToken,
    accessTokenLoading,
    getUserInfo,
    getAccessToken,
  };
}

export default useUser;
