import { useUserStore } from '@/stores/user';
import { useCallback } from 'react';
import { get, post } from '@/utils/http';
import { useAccount } from 'wagmi';
import { useWalletInfo } from '@web3modal/wagmi/react';
import useToast from '@/hooks/use-toast';

export function useUser() {
  const { address } = useAccount();
  const { walletInfo } = useWalletInfo();
  const toast = useToast();

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

    // register
    const checkedRes = await checkAccount({
      address,
    });
    if (!checkedRes.isActivated) {
      const wallet = walletInfo?.name ?? '';
      const isBitget = wallet.toLowerCase().includes('bitget');
      const isCoin98 = wallet.toLowerCase().includes('coin98');
      const isOkx = wallet.toLowerCase().includes('okx');
      const activateRes = await activateAccount({
        address,
        code: '',
        source: isBitget ? 'bitget_wallet' : isCoin98 ? 'coin98_wallet' : isOkx ? 'okx_wallet' : '',
      });
      if (!activateRes.isSuccess) {
        toast.fail({
          title: 'Account activated failed, please try again later!',
          message: activateRes?.message ?? '',
        });
      }
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

const checkAccount = async (params: any) => {
  try {
    const checkedRes = await get(`/api/invite/check-address/${params.address}`);
    return {
      isActivated: !!checkedRes?.data?.is_activated,
      message: checkedRes.msg,
    };
  } catch (err: any) {
    console.log(err);
    return {
      isActivated: false,
      message: err?.message ?? '',
    };
  }
};

const activateAccount = async (params: any) => {
  try {
    const activateRes = await post(`/api/invite/activate`, params);
    return {
      isSuccess: !!activateRes.data?.is_success,
      message: activateRes.msg,
    };
  } catch (err: any) {
    console.log(err);
    return {
      isSuccess: false,
      message: err?.message ?? '',
    };
  }
};
