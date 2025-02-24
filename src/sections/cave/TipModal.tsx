interface Props {
  data: TipData;
  style?: any;
  iconWidth?: number;
  note?: React.ReactNode;
}

type TipData = {
  tip: string;
  title: string;
  list: ListItemData[];
};

type ListItemData = {
  icon: string;
  content: string | React.ReactNode;
};

export default function TipModal({ data, style, note, iconWidth = 97 }: Props) {
  return (
    <div
      style={style}
      className="flex-1 md:w-full shadow-[10px_10px_0px_0px_#00000040] relative bg-[#FFFDEB] border border-[#000] rounded-[20px] w-[396px] px-[20px] pt-[25px] pb-[5px]"
    >
      <div className="w-[131px] h-[40px] absolute right-[20px] text-center top-[-7px] font-bold leading-[100%] flex justify-center items-center text-[16px] bg-[url('/images/cave/tip-top.png')] bg-contain bg-no-repeat bg-bottom">
        {data.tip}
      </div>
      <div className="text-[20px] font-CherryBomb">{data.title}</div>
      <div className="mt-[10px]">
        {data.list.map((item) => {
          return (
            <div
              key={item.icon}
              className="flex items-center mt-[10px] bg-[#fff] border border-[#000] rounded-[12px] py-[5px] pr-[10px]"
            >
              <div
                style={{ width: iconWidth }}
                className="mr-[10px] ml-[-15px] h-[42px] w-[97px] relative"
              >
                <img
                  src={item.icon}
                  className="h-[53px] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]"
                />
              </div>
              <div className="text-[14px] font-medium">{item.content}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-[5px]">{note && note}</div>
    </div>
  );
}
