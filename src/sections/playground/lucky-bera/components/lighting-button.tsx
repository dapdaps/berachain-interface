import clsx from 'clsx';

const LightingButton = (props: Props) => {
  const { type = LightingButtonType.Primary, style, children, outerClassName, className, onClick, disabled } = props;

  const currentType = LightingButtonTypes[type] || LightingButtonTypes[LightingButtonType.Primary];

  return (
    <button
      type="button"
      className={clsx("h-[40px] rounded-[16px] p-[2px] border-[2px] border-[#4B371F] text-[#F7F9EA] font-CherryBomb text-stroke-2 text-[16px] font-[400] disabled:opacity-30", outerClassName)}
      style={{
        ...style,
        backgroundColor: currentType.outerBg,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={clsx("relative w-full h-full border-[2px] px-[12px] rounded-[12px] flex justify-center items-center bg-[url('/images/shop/product-light.svg')] bg-no-repeat bg-[position:-3px_2px] bg-[length:52px_8.5px]", className)}
        style={{
          backgroundColor: currentType.innerBg,
          borderColor: currentType.innerBorderColor,
        }}
      >
        <svg
          width="50"
          height="13"
          viewBox="0 0 50 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-[3px] top-[2px] z-[0]"
        >
          <path d="M1.91113 11.4713C1.91113 6.37023 3.23192 1.83594 10.2761 1.83594M15.9995 1.83594H47.6984" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {children}
      </div>
    </button>
  );
};

export default LightingButton;

export enum LightingButtonType {
  Primary,
  Green,
}

export const LightingButtonTypes: Record<LightingButtonType, { outerBg: string; innerBorderColor: string; innerBg: string; }> = {
  [LightingButtonType.Primary]: {
    outerBg: '#FFB050',
    innerBorderColor: '#AF7026',
    innerBg: '#FFCF23',
  },
  [LightingButtonType.Green]: {
    outerBg: '#51DA54',
    innerBorderColor: '#71CC49',
    innerBg: '#95FF5C',
  },
};

interface Props {
  type?: LightingButtonType;
  style?: React.CSSProperties;
  className?: string;
  outerClassName?: string;
  children?: any;
  disabled?: boolean;
  onClick?(): void;
}
