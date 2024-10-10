import { memo } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  border-radius: 4px;
  border: 1px solid #ff9d97;
  background: rgba(255, 157, 151, 0.1);
  padding: 10px 18px 14px;
  color: #f56e66;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 10px;
`;

const PoolHints = () => {
  return (
    <StyledContainer>
      This pool must be initialized before you can add liquidity. To initialize,
      select a starting price for the pool. Then, enter your liquidity price
      range and deposit amount. Gas fees will be higher than usual due to the
      initialization transaction.
    </StyledContainer>
  );
};

export default memo(PoolHints);
