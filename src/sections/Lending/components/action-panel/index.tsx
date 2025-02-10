import ActionPanelMobile from './mobile';
import ActionPanelLaptop from './laptop';
import { useMemo } from 'react';
import Big from 'big.js';

const ActionPanel = (props: Props) => {
  const { isMobile, ...restProps } = props;

  // const isLimit = ['BERA', 'WBERA', 'HONEY'].includes(props.token.symbol) && props.actionText === 'Deposit';
  const isReachedSupplyCap = useMemo(() => {
    return Big(restProps.token?.currentSuppliedWeiAmount).gt(restProps.token?.currentMaxSupplyWeiAmount) && props.actionText === 'Deposit';
  }, [restProps.token, props.actionText]);

  return isMobile ? (
    <ActionPanelMobile {...restProps} isLimit={false} isReachedSupplyCap={isReachedSupplyCap} />
  ) : (
    <ActionPanelLaptop {...restProps} isLimit={false} isReachedSupplyCap={isReachedSupplyCap} />
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
  isReachedSupplyCap?: boolean;
}
