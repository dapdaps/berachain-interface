import { memo } from 'react';
import WarningIcon from '@/components/icons/warning';
import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid #ff9d97;
  background: rgba(255, 157, 151, 0.1);
  color: #f56e66;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 14px;
`;

const PoolNoExsitHints = () => {
  return (
    <StyledContainer>
      <WarningIcon width='20' height='20' />
      <div>Oops! This pool is not exsit.</div>
    </StyledContainer>
  );
};

export default memo(PoolNoExsitHints);
