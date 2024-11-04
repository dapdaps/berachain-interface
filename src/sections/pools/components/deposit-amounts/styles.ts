import styled from 'styled-components';

export const StyledContainer = styled.div``;

export const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 4px;
`;

export const StyledInput = styled.div<{ $error?: boolean }>`
  margin-top: 10px;
  border-radius: 12px;
  background: #fff;
  height: 80px;
  padding: 10px 19px;
  border: 1px solid ${({ $error }) => ($error ? '#FF9D97' : '#373A53')};
`;

export const StyledInputTokenBox = styled.div`
  display: flex;
`;

export const StyledInputInner = styled.input`
  font-size: 20px;
  font-weight: 500;
  height: 26px;
  flex-grow: 1;
`;

export const StyledToken = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StyledEmptyToken = styled.div`
  font-size: 16px;
  font-style: normal;
  width: 128px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledIcon = styled.img`
  width: 26px;
  height: 26px;
`;

export const StyledSymbol = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const StyledDesc = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #979abe;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 10px;
`;

export const StyledBalance = styled.span`
  text-decoration-line: underline;

  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;
