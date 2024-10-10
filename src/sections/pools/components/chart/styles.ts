import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin-top: 22px;
`;
export const StyledTop = styled.div`
  margin-bottom: 20px;
  .cp_text {
    display: flex;
    font-size: 12px;
    color: #8e8e8e;
    margin-bottom: 2px;
  }
  .between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .price {
    display: flex;
    align-items: flex-end;
    gap: 5px;
  }
  .p {
    font-size: 12px;
  }
  .s {
    font-size: 12px;
    color: #8e8e8e;
  }
  .zoom {
    display: flex;
    align-items: center;
    gap: 20px;
    svg {
      cursor: pointer;
    }
  }
`;
