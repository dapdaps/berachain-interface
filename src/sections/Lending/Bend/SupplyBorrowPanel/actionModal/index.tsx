import useIsMobile from '@/hooks/use-isMobile';
import ActionPanelMobile from './mobile';
import ActionPanelLaptop from './laptop';
import { TokenInfo } from '@/sections/Lending/Bend/hooks/useBend';
import { forwardRef } from 'react';
import useAaveConfig from '@/stores/useAaveConfigStore';
import useMarketStore from '@/stores/useMarketStore';

const Action = forwardRef<HTMLDivElement, IProps>((props: IProps, ref) => {
  const { token } = props;

  const isMobile = useIsMobile();
  const { config } = useAaveConfig();
  const { userAccountData } = useMarketStore();

  if (!config || !token || !userAccountData) return null;

  return isMobile ? (
    <ActionPanelMobile {...props} ref={ref} />
  ) : (
    <ActionPanelLaptop {...props} ref={ref} />
  );
});

export default Action;

export interface IProps {
  isOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  action: string;
  token?: TokenInfo;
  className?: string;
}
