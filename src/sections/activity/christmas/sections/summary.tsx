const Summary = () => {
  const summaries = [
    { id: 1, label: 'Total prize value', value: '$1.25M', underline: true },
    { id: 2, label: 'Total participants', value: '25,668' },
    { id: 3, label: 'Total boxes earned', value: '25,668' },
    { id: 4, label: 'Total $snowflake earned', value: '25,668' },
    { id: 5, label: 'Total yap generated', value: '25,668' },
  ];

  return (
    <div className="w-full px-[100px] mt-[100px]">
      <div className="w-full relative bg-[#B5956E] p-[37px_43px_33px_59px] border border-black rounded-[20px] shadow-[-20px_26px_60px_0px_rgba(0,_0,_0,_0.20)_inset]">
        <img
          src="/images/activity/christmas/bg-summary.svg"
          alt=""
          className="absolute top-0 left-0 w-full -translate-y-[40%] -translate-x-[2%] scale-[1.07]"
        />
        <div className="w-full flex justify-between items-start">
          {
            summaries.map((item: any, index: number) => (
              <Item
                key={index}
                label={item.label}
                value={item.value}
                underline={item.underline}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Summary;

const Item = (props: any) => {
  const { label, value, underline } = props;

  return (
    <div className="relative after:content-[''] after:block after:absolute after:w-[1px] after:h-[62px] after:bg-[#755C3D] after:right-0 after:top-[8px] flex-1 flex flex-col items-center gap-[9px] text-black whitespace-nowrap">
      <div className="font-[500] text-[18px] leading-normal">
        {label}
      </div>
      <div className={`text-[30px] font-CherryBomb leading-[150%] font-[400] ${underline ? 'underline decoration-dashed underline-offset-8 cursor-pointer' : ''}`}>
        {value}
      </div>
    </div>
  );
};