import styled from "styled-components";

const StyledInputRange = styled.div`
  margin-top: 24px;
  input[type="range"] {
    display: block;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background: #dfdcc4;
    height: 8px;
    border-radius: 16px;
    margin: 0 auto;
    outline: none;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #ffdc50;
    border: 1px solid #000;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    cursor: url("../../public/images/cursor.svg") 12 0;
  }
`;

export default function Range({ value, onChange, style }: any) {
  return (
    <StyledInputRange style={style}>
      <input type="range" value={value} onChange={onChange} />
    </StyledInputRange>
  );
}
