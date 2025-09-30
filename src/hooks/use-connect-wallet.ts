import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useUserStore } from '@/stores/user';
import { formatLongText } from '@/utils/utils';

export function useConnectWallet() {
  const connectModal = useConnectModal();
  const { disconnect } = useDisconnect();
  const { address, isConnected, chainId, chain, isConnecting } = useAccount();
  const { switchChain, isPending: switching } = useSwitchChain();
  const userInfo = useUserStore((store: any) => store.user);
  const userNativeBalance = useUserStore((store: any) => store.nativeBalance);

  const [connecting, setConnecting] = useState<boolean>(isConnecting);

  const { run: closeConnecting, cancel: cancelCloseConnecting } = useDebounceFn(
    () => {
      setConnecting(false);
    },
    { wait: 10000 }
  );

  useEffect(() => {
    cancelCloseConnecting();
    if (!isConnecting) {
      setConnecting(false);
      return;
    }
    setConnecting(true);
    closeConnecting();
  }, [isConnecting]);

  const onConnect = () => {
    !address && connectModal.openConnectModal?.();
  };

  const [name, avatar, balance] = useMemo(() => {
    const defaultAvatar = "conic-gradient(from 180deg at 50% 50%, #00D1FF 0deg, #FF008A 360deg)";
    let _balance = "0";

    if (!address) return ["", defaultAvatar, _balance];

    if (userNativeBalance) {
      _balance = userNativeBalance;
    }

    if (userInfo?.twitter) {
      return [
        formatLongText(userInfo?.twitter?.twitter_user_name, 5, 4),
        `url("${userInfo?.twitter?.twitter_avatar}")`,
        _balance
      ];
    }

    return [
      formatLongText(address, 5, 4),
      defaultAvatar,
      _balance
    ];
  }, [userInfo, address, userNativeBalance]);

  return {
    onConnect,
    onDisconnect: disconnect,
    onSwitchChain: switchChain,
    switching,
    chainId,
    chain,
    connecting,
    connected: isConnected,
    name,
    avatar,
    balance,
  };
}
