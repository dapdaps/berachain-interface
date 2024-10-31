import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin-top: 20px;
`;

export const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledHeaderAction = styled.button`
  color: #000;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  width: 110px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #000;
`;

export const StyledInputLeft = styled.div`
  flex-grow: 1;
`;

export const StyledInputButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  flex-shrink: 0;
  &:not(:disabled):hover {
    opacity: 0.8;
  }
  &:not(:disabled):active {
    opacity: 0.6;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const StyledInputInner = styled.input`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  height: 26px;
  margin-top: 8px;
  width: 100%;
  box-sizing: border-box;
  padding-right: 10px;
  text-align: center;
`;
