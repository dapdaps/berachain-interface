import { memo } from 'react';
import styled from 'styled-components';

const StyledCheckbox = styled.div<{
  checked: boolean;
  disabled?: boolean;
  round?: boolean;
}>`
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  &::after {
    position: absolute;
    top: 0;
    color: #fff;
    width: 100%;
    height: 100%;
    display: inline-block;
    visibility: visible;
    padding-left: 0px;
    text-align: center;
    content: '';
    border-radius: 4px;
    border: 1px solid #000;
    background-color: #fff;
  }
  ${({ checked }) =>
    checked &&
    ` &::after {
    content: '✓';
    color: #000;
    font-size: 14px;
    line-height: 18px;
    font-weight: bold;
    background-color: #FFDC50;
    border-radius: 6px;
  }`}
  ${({ disabled }) =>
    disabled &&
    ` & {
      opacity: 0.8;
      pointer-events: none;
  }`}
  ${({ round }) =>
    round &&
    ` &::after {
    border-radius: 100%;
  }`}
`;

const Checkbox = ({
  checked,
  disabled,
  round,
  onClick
}: {
  checked: boolean;
  disabled?: boolean;
  round?: boolean;
  onClick?: () => void;
}) => {
  return (
    <StyledCheckbox
      checked={checked}
      disabled={disabled}
      round={round}
      onClick={onClick}
    />
  );
};

export default memo(Checkbox);
