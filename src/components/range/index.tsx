import clsx from "clsx";
import styled from "styled-components";

const StyledInputRange = styled.div<{ $position: string }>`
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
    position: relative;
    z-index: 5;
  }
`;

export default function Range({ value, onChange, style, className }: any) {
  return (
    <StyledInputRange
      $position={value === 100 ? "0" : value === 0 ? "16" : "-16"}
      style={style}
      className={clsx("relative", className)}
    >
      <input
        type="range"
        value={value}
        onChange={onChange}
        className="appearance-none"
      />
      <div
        className={clsx(
          "absolute top-0 left-0 h-[8px] rounded-[16px] bg-[#ffdc50]"
        )}
        style={{ width: value + "%" }}
      />
    </StyledInputRange>
  );
}
