import Button from "@/sections/activity/christmas/components/button";

const Pyramid = (props: any) => {
  const { list, onBoxClick } = props;

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="flex flex-col items-center absolute left-1/2 -translate-x-1/2"
        style={{
          transform: `translateX(-50%) translateY(${
            (203 - 110) * Math.max(0, list.length - 1)
          }px)`
        }}
      >
        {list.length > 0 && list[0]?.length > 0 ? list.reverse().map((row: any, index: number) => (
          <div
            key={`row-${index}`}
            className="flex justify-center items-center mb-[-100px]"
            style={{
              transform: `translateY(-${100 * index}%)`
            }}
          >
            {row.map((item: any, idx: number) => {
              const disabled = item.status === "opened";
              return (
                <div
                  key={`col-${idx}`}
                  className="flex justify-center items-center w-[155px] h-[203px] ml-[-10px] bg-[url('/images/activity/christmas/gift-box.svg')] bg-no-repeat bg-center bg-contain"
                >
                  <Button
                    key={`col-btn-${idx}`}
                    className="!px-[20px] translate-y-[20px]"
                    disabled={disabled}
                    motionProps={{
                      variants: {
                        visible: {
                          opacity: 1
                        },
                        hidden: {
                          opacity: 0
                        }
                      },
                      initial: "hidden",
                      animate: disabled ? "visible" : "hidden",
                      whileHover: "visible"
                    }}
                    onClick={onBoxClick}
                  >
                    {disabled ? "Opened" : "Open it"}
                  </Button>
                </div>
              );
            })}
          </div>
        )) : (
          <div className="flex flex-col justify-center items-center text-center text-[#FFDC50] text-[18px] font-[600] leading-normal gap-[11px] w-[210px] h-[263px] bg-[url('/images/activity/christmas/icon-gift-box-empty.svg')] bg-no-repeat bg-contain bg-center translate-y-1/4">
            <div className="mt-[55px]">
              You don’t have any gifl box.
            </div>
            <div className="mt-[12px]">
              How to get?
            </div>
            <button
              type="button"
              className="animate-float-y w-[38px] h-[31px] bg-[url('/images/activity/christmas/icon-scroll-down.svg')] bg-no-repeat bg-contain bg-center"
              onClick={() => {
                const target = document?.getElementById?.('beratownActivityChristmasQuestTabs');
                target?.scrollIntoView?.({ behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pyramid;

export const createPyramid = (list: any) => {
  let rowIndex = 0;
  const arr: any = [[]];
  for (let i = 0; i < list.length; i++) {
    const it: any = list[i];
    if (arr[rowIndex].length < rowIndex + 2) {
      arr[rowIndex].push(it);
    } else {
      rowIndex += 1;
      if (!arr[rowIndex]) {
        arr.push([it]);
      }
    }
  }
  const sorted = arr.sort((a: any, b: any) => b.length - a.length);
  const rows = sorted.map((_arr: any) => _arr.slice(0, 1));
  let lastRowNum = 1;
  let count = 1;
  let totals = list.length;
  while (totals > 0) {
    totals -= 1;
    if (count > lastRowNum) {
      lastRowNum += 1;
      count = 2;
      continue;
    }
    count += 1;
  }

  let lastCount = 1;
  let lastRowCount = lastRowNum;
  for (let i = 0; i < list.length; i++) {
    const it: any = list[i];
    let lastRow = rows.length - lastCount;
    if (lastRow < 0) continue;
    if (rows.some((row: any) => row.some((_it: any) => it.id === _it.id))) {
      continue;
    }
    rows[lastRow].push(it);
    if (rows[lastRow].length >= lastRowCount) {
      lastCount += 1;
      lastRowCount -= 1;
    }
  }
  console.log("total: %o, result: %o", list.length, rows);
  return rows;
};
