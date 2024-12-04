import Button from '@/sections/activity/christmas/components/button';

const Pyramid = (props: any) => {
  const { list } = props;

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="flex flex-col items-center absolute left-1/2 -translate-x-1/2"
        style={{
          transform: `translateX(-50%) translateY(${(203 - 110) * (Math.max(0, list.length - 1))}px)`
        }}
      >
        {
          list.map((row: any, index: number) => (
            <div
              key={`row-${index}`}
              className="flex justify-center items-center mb-[-100px]"
              style={{
                transform: `translateY(-${100 * index}%)`
              }}
            >
              {
                row.map((item: any, idx: number) => {
                  const disabled = item.status === 'opened';
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
                            'visible': {
                              opacity: 1,
                            },
                            'hidden': {
                              opacity: 0,
                            },
                          },
                          initial: 'hidden',
                          animate: disabled ? 'visible' : 'hidden',
                          whileHover: 'visible',
                        }}
                      >
                        {
                          disabled ? 'Opened' : 'Open it'
                        }
                      </Button>
                    </div>
                  );
                })
              }
            </div>
          ))
        }
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
  return arr.sort((a: any, b: any) => b.length - a.length);
};
