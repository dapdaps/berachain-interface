import { memo } from 'react';

import { sortTokens } from '../../utils';

import { StyledContainer, StyledItem } from './styles';

const TokenSwitcher = ({ token0, token1, reverse, onExchangeTokens }: any) => {
  const [_token0, _token1] = sortTokens(token0, token1);
  return (
    <StyledContainer onClick={onExchangeTokens}>
      <StyledItem className='cursor-pointer' $active={!reverse}>
        {_token0?.symbol}
      </StyledItem>
      <StyledItem className='cursor-pointer' $active={reverse}>
        {_token1?.symbol}
      </StyledItem>
    </StyledContainer>
  );
};

export default memo(TokenSwitcher);
