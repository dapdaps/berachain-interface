import { useContext, useState } from "react";
import { ChristmasContext } from "@/sections/activity/christmas/context";
import { numberFormatter } from "@/utils/number-formatter";

const Summary = ({ onOpenRewards }: any) => {
  const { info, isMobile } = useContext(ChristmasContext);

  const summaries = [
    {
      id: 1,
      label: "Total prize value",
      value: "$15,000+",
      underline: true
    },
    {
      id: 2,
      label: "Total participants",
      value: numberFormatter(info?.total_users, 2, true, { isShort: true })
    },
    {
      id: 3,
      label: "Total boxes earned",
      value: numberFormatter(info?.total_box, 2, true, { isShort: true })
    },
    {
      id: 4,
      label: "Total $SNOWFLAKE earned",
      value: numberFormatter(info?.total_token, 2, true, { isShort: true })
    },
    {
      id: 5,
      label: "Total yap generated",
      value: numberFormatter(info?.total_yap, 2, true, { isShort: true })
    }
  ];

  return (
    <div className="w-full px-[100px] md:px-[10px] mt-[100px] md:mt-[55px]">
      <div className="w-full relative bg-[#B5956E] p-[37px_43px_33px_59px] border border-black rounded-[20px] shadow-[-20px_26px_60px_0px_rgba(0,_0,_0,_0.20)_inset] md:px-[7px] md:pt-[22px] md:pb-[10px]">
        <img
          src="/images/activity/christmas/bg-summary.svg"
          alt=""
          className="absolute top-0 left-0 w-full -translate-y-[40%] -translate-x-[2%] scale-[1.07]"
        />
        <div className="w-full flex justify-between items-start md:flex-wrap">
          {summaries.map((item: any, index: number) => {
            if (isMobile) {
              const labels: any  = [];
              item.label.split(' ').forEach((_label: any) => {
                _label = _label.slice(0, 1).toUpperCase() + _label.slice(1);
                labels.push(_label);
              });
              if (item.id === 4) {
                labels.splice(2, 1);
              }
              item.label = labels.join(' ');
            }
            return (
              <Item
                id={index}
                key={index}
                label={item.label}
                value={item.value}
                underline={item.underline}
                onClick={() => {
                  if (item.id === 1) onOpenRewards();
                }}
                className={`${index === 0 ? 'md:w-full md:flex-row md:after:hidden' : 'md:w-1/2 md:pt-[10px] md:gap-[0]'} ${index === 2 ? 'md:after:hidden' : ''} ${index === 3 || index === 4 ? 'md:!border-b-0' : ''}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Summary;

const Item = (props: any) => {
  const { label, value, underline, onClick, id, index, className } = props;

  return (
    <div id={id === 0 ? 'tour-id-2':''} className={`relative after:content-[''] after:block after:absolute after:w-[1px] after:h-[62px] md:after:h-[30px] after:bg-[#755C3D] after:right-0 after:top-[8px] md:after:top-[20px] last:after:hidden flex-1 flex flex-col items-center gap-[9px] text-black whitespace-nowrap md:border-b md:border-b-[#755C3D] md:px-[19px] md:pb-[6px] md:justify-between ${className}`}>
      <div className="font-[500] text-[18px] leading-normal md:text-[14px]">{label}</div>
      <div
        className={`text-[30px] font-CherryBomb leading-[150%] font-[400] md:text-[20px] ${
          underline
            ? "underline decoration-dashed underline-offset-8 cursor-pointer md:underline-offset-2"
            : ""
        }`}
        onClick={onClick}
      >
        {value}
      </div>
    </div>
  );
};
