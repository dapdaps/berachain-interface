import ActionPanelMobile from './mobile';
import ActionPanelLaptop from './laptop';

const ActionPanel = (props: Props) => {
  const { isMobile, ...restProps } = props;

  const isLimit = ['BERA', 'WBERA', 'HONEY'].includes(props.token.symbol) && props.actionText === 'Deposit';

  return isMobile ? (
    <ActionPanelMobile {...restProps} isLimit={isLimit} />
  ) : (
    <ActionPanelLaptop {...restProps} isLimit={isLimit} />
  );
};

export default ActionPanel;

export interface Props {
  isMobile?: boolean;
  title: string;
  actionText: string;
  placeholder?: string;
  inputDisabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  token: any;
  isSkipApproved?: boolean;
  CHAIN_ID: number;
  onSuccess?(): void;
  addAction: any;
  isLimit?: boolean;
}
