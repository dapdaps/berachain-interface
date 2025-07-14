import clsx from "clsx";

const Benefits = (props: any) => {
  const { className, style } = props;

  return (
    <div className={clsx("", className)} style={style}>
      <div className="text-[#3D405A] font-Montserrat text-[20px] font-semibold leading-normal">
        The benefits
      </div>
      <div className="mt-[9px] flex flex-col items-stretch gap-[10px]">
        <Card
          title="Points"
          icon="/images/belong/icon-heart.svg"
        >
          Infrared, Kodiak and Smilee are offering the most competitive points' multiplier exclusively for BeLong and those who provide liquidity in the pool.
        </Card>
        <Card
          title="Leverage"
          icon="/images/belong/icon-chart.svg"
        >
          Position yourself by leveraging your exposure to BERA by using Beraborrow's vault to lend your LP token and buying more BERA.
        </Card>
        <Card
          title="BGT Farm"
          icon="/images/belong/icon-farm.svg"
        >
          The pool had the most consistent BGT APR in the whole Berachain space, thanks to permanent locked deal between Infrared and Smilee validators.
        </Card>
        <Card
          title="Arbitrage"
          icon="/images/belong/icon-scale.svg"
          iconSize={18}
        >
          wgBERA and iBERA are the two main BERA derivatives, and right now they offers incredible arbitrage opportunities.
        </Card>
      </div>
    </div>
  );
};

export default Benefits;

const Card = (props: any) => {
  const { title, icon, iconSize = 24, className, children } = props;

  return (
    <div
      className={clsx("w-full rounded-[20px] bg-[rgba(255,255,255,0.5)] backdrop-blur-[10px] p-[17px_15px_15px] text-[#6E7083] font-Montserrat text-[12px] font-medium leading-[120%]", className)}
    >
      <div className="flex items-center gap-[8px]">
        <div className="text-[#471C1C] font-Montserrat text-[16px] font-semibold leading-[80%] uppercase">{title}</div>
        <img src={icon} alt="" className="w-[24px] h-[24px] object-contain object-center shrink-0" style={{ width: iconSize, height: iconSize }} />
      </div>
      <div className="mt-[10px]">
        {children}
      </div>
    </div>
  );
};
