import { useUserStore } from '@/stores/user';
import { useCallback } from 'react';
import { get, post } from '@/utils/http';
import { useAccount } from 'wagmi';

export function useUser() {
  const { address } = useAccount();

  const accessToken = useUserStore((store: any) => store.accessToken?.access_token);
  const setUserInfo = useUserStore((store: any) => store.set);

  const getUserInfo = useCallback(async () => {
    try {
      const result = await get('/api/user');
      const data = result?.data || {};
      setUserInfo({ user: data });
      return data;
    } catch (err) {
      console.log('getUserInfo failed: %o', err);
      return {};
    }
  }, []);

  const getAccessToken = async () => {
    if (!address) {
      setUserInfo({
        user: {},
        accessToken: {
          access_token: '',
          refresh_access_token: '',
          token_type: 'bearer',
        },
      });
      return;
    }

    const res = await post('/api/auth/access-token', {
      address,
    });
    setUserInfo({
      accessToken: res,
    });
    await getUserInfo();
  };

  return {
    accessToken,
    getUserInfo,
    getAccessToken,
  };
}

export default useUser;
