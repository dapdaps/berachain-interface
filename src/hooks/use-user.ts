import { useUserStore } from '@/stores/user';
import { useCallback } from 'react';
import { get, post } from '@/utils/http';
import { useAccount } from 'wagmi';
import useToast from '@/hooks/use-toast';
import { useWalletName } from '@/hooks/use-wallet-name';
import { useConnectedWalletsStore } from '@/stores/useConnectedWalletsStore';
import { usePathname } from 'next/navigation';
import { ChainType } from '@/sections/near-intents/hooks/useConnectWallet'

export function useUser() {
  const { address } = useAccount();
  const { name: walletName } = useWalletName();
  const toast = useToast();

  const accessToken = useUserStore((store: any) => store.accessToken?.access_token);
  const accessTokenLoading = useUserStore((store: any) => store.accessTokenLoading);
  const userInfo = useUserStore((store: any) => store.user);
  const userInfoLoading = useUserStore((store: any) => store.loading);
  const setUserInfo = useUserStore((store: any) => store.set);

  const { connectedWallets } = useConnectedWalletsStore();

  const pathname = usePathname();

  const isNearPage = ['/bintent', '/my-near-wallet-gateway'].includes(pathname);
  const near_current_wallet = connectedWallets.length > 0 ? connectedWallets[0] : null;

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
    // 获取当前使用的地址
    const currentAddress = isNearPage && near_current_wallet 
      ? near_current_wallet.address 
      : address;

    if (!currentAddress) {
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
      address: currentAddress,
    });
    let _walletName = walletName ?? '';
    const isBitget = _walletName.toLowerCase().includes('bitget');
    const isCoin98 = _walletName.toLowerCase().includes('coin98');
    const isOkx = _walletName.toLowerCase().includes('okx');
    if (isBitget) {
      _walletName = 'bitget';
    }

    if (!checkedRes.isActivated) {
      const activateRes = await activateAccount({
        address: currentAddress,
        code: '',
        source: isBitget ? 'bitget_wallet' : isCoin98 ? 'coin98_wallet' : isOkx ? 'okx_wallet' : '',
        wallet:  _walletName.toLowerCase(),
      });
      if (!activateRes.isSuccess && !isNearPage) {
        toast.fail({
          title: 'Account activated failed, please try again later!',
          message: activateRes?.message ?? '',
        });
      }
    }

    const res = await post('/api/auth/access-token', {
      address: currentAddress,
      wallet:  _walletName.toLowerCase(),
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
