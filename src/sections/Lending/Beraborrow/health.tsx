const Health = (props: any) => {
  const { children } = props;

  const risk = Status.LowRisk;

  return (
    <div
      className="flex items-center gap-[5px] px-[10px] rounded-[12px] h-[24px]"
      style={{
        backgroundColor: `rgba(${risk.color}, 0.3)`,
      }}
    >
      <svg
        className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall MuiChip-icon MuiChip-iconSmall MuiChip-iconColorSuccess css-1k33q06"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={18}
        height={18}
        data-testid="FavoriteIcon"
      >
        <path
          d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"
          fill={`rgb(${risk.color})`}
        />
      </svg>
      <div
        className="text-[12px] font-[500]"
        style={{
          color: `rgb(${risk.color})`,
        }}
      >
        {
          children ? children : risk.name
        }
      </div>
    </div>
  );
};

export default Health;

export const Status = {
  HighRisk: { color: '239,68,68', name: 'Risky' },
  MidRisk: { color: '234,179,8', name: 'Normal' },
  LowRisk: { color: '34,197,94', name: 'Good' },
};
