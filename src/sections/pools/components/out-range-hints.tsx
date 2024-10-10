import { memo } from 'react';
import WarningIcon from '@/components/icons/warning';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f56e66;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 10px;
`;

const OutRangeHints = ({ type }: any) => {
  return (
    <StyledContainer>
      <WarningIcon width='20px' height='20px' style={{ flexShrink: 0 }} />
      <div>
        {type === -1
          ? `Invalid range selected. The min price must be lower than the max price.`
          : `Your position will not earn fees or to be used in trades until the
        market price move into your price range.`}
      </div>
    </StyledContainer>
  );
};

export default memo(OutRangeHints);
