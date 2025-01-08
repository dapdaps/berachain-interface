import ActionPanelMobile from './mobile';
import ActionPanelLaptop from './laptop';

const ActionPanel = (props: Props) => {
  const { isMobile, ...restProps } = props;

  return isMobile ? (
    <ActionPanelMobile {...restProps} />
  ) : (
    <ActionPanelLaptop {...restProps} />
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
