import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import Empty from "@/components/empty";
import Loading from "@/components/loading";

export default function List({ positions, loading }: any) {
  return (
    <div className="mt-[20px] flex flex-col gap-[10px] h-[440px] overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loading size={20} />
        </div>
      ) : (
        <>
          {!positions?.length && (
            <div className="flex justify-center items-center h-full">
              <Empty desc="No positions" />
            </div>
          )}
          {positions?.map((it: any, index: number) => (
            <div
              key={index}
              className="flex items-center h-[75px] border border-[#392C1D] relative"
            >
              <div className="flex w-full px-[14px] py-[10px]">
                <div className="flex w-[50px]">
                  {it.tokens.map((item: any, i: number) => (
                    <img
                      key={i}
                      src={item.icon}
                      className={clsx(
                        "w-[26px] h-[26px] rounded-full flex-shrink-0"
                      )}
                      style={{
                        marginLeft:
                          i !== 0 ? `-${14 + (it.tokens.length - 2) * 3}px` : 0
                      }}
                    />
                  ))}
                </div>
                <div className="grow">
                  <div className="flex justify-between items-center text-[#392C1D] text-[14px] font-bold">
                    <div>
                      {it.tokens.map((item: any) => item.symbol).join("-")}
                    </div>
                    <div>
                      {numberFormatter(it.amount, 2, true, { isShort: true })}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[#392C1D] text-[12px] mt-[2px]">
                    <div>{it.name}</div>
                    <div>
                      $
                      {numberFormatter(it.amountUsd, 2, true, {
                        isShort: true
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[#392C1D] text-[12px] mt-[2px]">
                    <div className="flex items-center gap-[7px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M12.6501 2.60703H12.1585C12.4077 2.18477 12.5171 1.78201 12.4822 1.40842C12.4532 1.09575 12.3049 0.648565 11.7613 0.292177C11.3106 -0.00399662 10.7311 -0.0766391 10.0881 0.0838318C9.04548 0.345355 7.81147 1.24445 7.00011 2.33101C6.18825 1.24447 4.95523 0.345355 3.91259 0.0838318C3.2691 -0.0776821 2.68906 -0.00452698 2.23846 0.292177C1.69537 0.648565 1.547 1.09575 1.51802 1.40842C1.48307 1.78201 1.59146 2.18477 1.84176 2.60703H1.35015C0.605784 2.60703 0 3.21267 0 3.95686V5.69547C0 6.28416 0.388667 6.80444 0.950988 6.97916C0.897545 7.12689 0.869567 7.2796 0.869567 7.43434V12.6504C0.869567 13.3941 1.47604 14 2.22048 14H11.7813C12.5257 14 13.1312 13.3941 13.1312 12.6504V7.43432C13.1312 7.27859 13.1042 7.12539 13.0508 6.97863C13.6123 6.80294 14 6.28265 14 5.69545V3.9573C14 3.21316 13.3945 2.60703 12.6501 2.60703ZM11.7813 13.0387H7.48074V7.04553H11.7813C11.9956 7.04553 12.1694 7.2202 12.1694 7.43432V12.6504C12.1694 12.8646 11.9956 13.0387 11.7813 13.0387ZM8.01031 2.60703C8.69426 1.8189 9.592 1.19956 10.3209 1.01687C10.6996 0.922057 11.0094 0.948009 11.2337 1.09575C11.472 1.25219 11.5144 1.39168 11.524 1.49703C11.5619 1.88331 11.1472 2.40411 10.9514 2.60703H8.01031ZM13.0377 3.95732V5.69547C13.0377 5.90959 12.8644 6.08373 12.6501 6.08373H7.48074V3.56877H12.6501C12.8644 3.56877 13.0377 3.74323 13.0377 3.95732ZM6.51899 7.04553V13.0387H2.22046C2.00561 13.0387 1.83174 12.8645 1.83174 12.6504V7.43432C1.83174 7.2202 2.00561 7.04553 2.22046 7.04553H6.51899ZM2.47626 1.49703C2.48573 1.39168 2.52871 1.25217 2.76604 1.09575C2.98882 0.948009 3.29858 0.920784 3.6793 1.01687C4.4042 1.19854 5.30096 1.81793 5.98642 2.60703H3.04779C2.87243 2.4296 2.43777 1.89257 2.47626 1.49703ZM0.961465 3.95732C0.961465 3.74325 1.13533 3.56877 1.35013 3.56877H6.51898V6.08373H1.35013C1.13533 6.08373 0.961465 5.90959 0.961465 5.69547V3.95732Z"
                          fill="#392C1D"
                        />
                      </svg>
                      <div className="text-[12px]">Incentives</div>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      {it.rewards.map((item: any, j: number) => {
                        return (
                          <div className="flex items-center gap-[2px]" key={j}>
                            <img
                              src={item.icon}
                              className="w-[16px] h-[16px] rounded-full"
                            />
                            <div className="text-[12px] text-[#392C1D]">
                              {item.rate}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
