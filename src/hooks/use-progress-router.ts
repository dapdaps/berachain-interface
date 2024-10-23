import * as NProgress from 'nprogress';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDebounceFn } from 'ahooks';

export const useProgressRouter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { push, back } = router;

  const { run: progressTimeout, cancel: cancelProgressTimeout } = useDebounceFn(() => {
    NProgress.done();
  }, { wait: 5000 });

  router.push = (href, options) => {
    cancelProgressTimeout();
    NProgress.start();
    progressTimeout();
    push(href, options);
  };

  router.back = () => {
    cancelProgressTimeout();
    NProgress.start();
    progressTimeout();
    back();
  };

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return router;
};
