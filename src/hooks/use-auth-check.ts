import useCustomAccount from '@/hooks/use-account';
import { useAppKit } from '@reown/appkit/react';
import useUser from '@/hooks/use-user';
import { useRef } from 'react';

export function useAuthCheck(props?: Props) {
  const { isNeedAt = true, isQuiet } = props ?? {};

  const { account } = useCustomAccount();
  const modal = useAppKit();
  const { accessToken, accessTokenLoading } = useUser();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCheck = (quiet?: boolean, isTimeout?: boolean) => {
    const realQuiet = quiet ?? isQuiet;
    const result = { accessToken: '', account: '' };
    return new Promise(async (resolve) => {
      const checkAt = () => {
        console.log('checking accessToken...');
        if (accessToken) {
          result.accessToken = accessToken;
          resolve(result);
          return
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          checkAt();
        }, 500);
      };
      if (!account) {
        if (realQuiet) {
          return;
        }
        await modal.open();
        // ⚠️ Unable to synchronize and retrieve the wallet login status
        // must wait until the user clicks again to check the accessToken
        // checkAt();
        if (isTimeout) {
          const timer = setTimeout(() => {
            resolve(false);
            clearTimeout(timer);
          }, 3000);
        }
        return;
      }
      result.account = account;
      if (!isNeedAt) {
        resolve(result);
        return;
      }
      checkAt();
    });
  };

  return { onAuthCheck: handleCheck };
}

interface Props {
  // weather need access_token
  isNeedAt?: boolean;
  // need web3 wallet address
  isQuiet?: boolean;
}
