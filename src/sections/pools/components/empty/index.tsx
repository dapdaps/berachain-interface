import { memo } from 'react';

import EmptyIcon from './icon';

import { StyledContainer, StyledText } from './styles';

const Empty = () => {
  return (
    <StyledContainer>
      <EmptyIcon />
      <StyledText>Your position will appear here.</StyledText>
    </StyledContainer>
  );
};

export default memo(Empty);
