const ChristmasSnow = (props: any) => {
  const { className } = props;
  return (
    <div
      className={`absolute z-[11] inset-[-800px_0_0_0] opacity-100 bg-snow bg-[800px_800px] animate-snow-down ${className}`}
    >
      <div
        className="absolute z-[1] inset-[-800px_0_0_0] m-[-390px] opacity-60 bg-snow animate-snow-down"
        style={{ animationDelay: '-1.5s', animationDuration: '15s', backgroundSize: '800px 800px' }}
      />
      <div
        className="absolute z-[2] inset-[-800px_0_0_0] m-[-130px] opacity-80 bg-snow animate-snow-down"
        style={{ animationDuration: '20s', backgroundSize: '800px 800px' }}
      />
    </div>
  );
};

export default ChristmasSnow;
