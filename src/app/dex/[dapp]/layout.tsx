'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import BearBackground from '@/components/bear-background';
import SwitchTabs from '@/components/switch-tabs';
import PageBack from '@/components/back';
import useIsMobile from '@/hooks/use-isMobile';

const Laptop = ({ params, router, pathname, children }: any) => {
  return (
    <div className='pt-[30px] flex flex-col items-center'>
      <PageBack className='absolute left-[36px] top-[31px]' />
      {params.dapp === 'ooga-booga' ? (
        <div className='h-[80px]' />
      ) : (
        <SwitchTabs
          tabs={[
            { label: 'Swap', value: 'swap' },
            { label: 'Liquidity', value: 'pools' }
          ]}
          onChange={(val) => {
            router.replace(`/dex/${params.dapp}/${val}`);
          }}
          current={pathname.includes('pools') ? 'pools' : 'swap'}
          className='w-[400px]'
        />
      )}
      {children}
    </div>
  );
};

const Mobile = ({ params, router, pathname, children }: any) => {
  return (
    <div className='relative pt-[50px]'>
      <div className='absolute top-[20px] right-[10px]'>
        {params.dapp !== 'ooga-booga' && (
          <SwitchTabs
            tabs={[
              { label: 'Swap', value: 'swap' },
              { label: 'Liquidity', value: 'pools' }
            ]}
            onChange={(val) => {
              router.replace(`/dex/${params.dapp}/${val}`);
            }}
            current={pathname.includes('pools') ? 'pools' : 'swap'}
            className='w-[200px]'
          />
        )}
      </div>
      <div> {children}</div>
    </div>
  );
};

export default function DexLayout({
  children
}: {
  children: React.ReactElement;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <BearBackground type='dapp'>
      {isMobile ? (
        <Mobile {...{ params, router, pathname, children }} />
      ) : (
        <Laptop {...{ params, router, pathname, children }} />
      )}
    </BearBackground>
  );
}
