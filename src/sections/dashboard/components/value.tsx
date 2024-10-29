import { numberFormatter } from '@/utils/number-formatter';

const Value = (props: Props) => {
  const { children, style, className, disabled } = props;

  return (
    <div
      className={`font-CherryBomb text-black text-[22px] leading-[90%] ${className} md:text-[16px]`}
      style={{
        ...style,
        opacity: disabled ? 0.3 : 1
      }}
    >
      {numberFormatter(children, 2, true, { prefix: '$' })}
    </div>
  );
};

export default Value;

interface Props {
  children?: string;

  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}
