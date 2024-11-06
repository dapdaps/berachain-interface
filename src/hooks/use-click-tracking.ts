import { useDebounceFn } from 'ahooks';
import useAccount from './use-account';
import { post } from '@/utils/http';

export const report = ({ address, code, url }: { address: string; code: string; url: string; }) => {
  post('/track', { address, code, url });
};

const findBP = (target: any, cb: any) => {
  if (!target) {
    cb(false);
    return false;
  }
  if (target.dataset?.bp) {
    cb(target.dataset.bp);
    return target.dataset.bp;
  }
  if (!target.parentElement) {
    cb(false);
    return false;
  }
  findBP(target.parentElement, cb);
};

export default function useClickTracking() {
  const { account } = useAccount();
  const { run: handleReport } = useDebounceFn(
    (code: string) => {
      console.log('%cfollowed: %s-%s', 'background:#FFF5A9;color:#000;', account || '[none]', code || '[none]');
      if (!code) return;
      report({
        address: account || '',
        code,
        url: window.location.href,
      });
    },
    {
      wait: 500,
    },
  );

  const { run: handleReportNoCode } = useDebounceFn(
    () => {
      console.log('%cfollowed: %s-%s', 'background:#FFF5A9;color:#000;', account || '[none]', window.location.href || '[none]');
      report({
        address: account || '',
        code: '',
        url: window.location.href,
      });
    },
    {
      wait: 500,
    },
  );

  const handleTrack = (ev: any) => {
    findBP(ev.target, (bp: any) => {
      if (!bp) return;
      handleReport(bp);
    });
  };

  return {
    handleTrack,
    handleReport,
    handleReportNoCode,
  };
}
