import useIsMobile from '@/hooks/use-isMobile';
import ActionPanelMobile from '@/sections/Lending/Bend/Action/mobile';
import ActionPanelLaptop from '@/sections/Lending/Bend/Action/laptop';
import { TokenInfo } from '@/sections/Lending/Bend/hooks/useBend';
import { forwardRef } from 'react';
import useAaveConfig from '@/stores/useAaveConfigStore';
import useMarketStore from '@/stores/useMarketStore';

const ActionPanel = forwardRef<HTMLDivElement, IProps>((props: IProps, ref) => {
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

export default ActionPanel;

export interface IProps {
  isOpen?: boolean;
  onClose?: () => void;
  action: string;
  token?: TokenInfo;
  className?: string;
  isMobile?: boolean;
  onSuccess?(): void;
}
