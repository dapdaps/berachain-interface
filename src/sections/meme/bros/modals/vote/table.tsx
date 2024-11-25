"use client";

import LazyImage from "@/components/layz-image";
import { numberFormatter } from "@/utils/number-formatter";
import Popover, { PopoverPlacement } from "@/components/popover";
import Pager from "@/components/pager";
import FlexTable from "@/components/flex-table";
import useIsMobile from "@/hooks/use-isMobile";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Big from "big.js";
import VoteConfirm from "@/sections/meme/bros/modals/vote/confirm";
import clsx from "clsx";

const VoteTable = forwardRef<any, any>((props, ref) => {
  const { onRow } = props;

  const isMobile = useIsMobile();

  const columns: any = [
    {
      title: "#",
      dataIndex: "sn",
      align: "center",
      width: "13%"
    },
    {
      title: "Meme Token",
      dataIndex: "name",
      width: "31%",
      render: (text: any, record: any) => {
        return (
          <div
            className={clsx(
              "text-[#3D405A] text-[14px] font-[600] flex items-center gap-[5px]",
              "md:relative"
            )}
          >
            <LazyImage
              src={record.icon}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div>{record.name}</div>
            <div
              className={clsx(
                "w-[65px] h-[26px] rounded-[44px] text-center bg-[#7CB424] whitespace-nowrap text-[14px] text-white font-[600] leading-[26px] italic",
                "md:absolute md:left-0 md:top-[-10px] md:h-[16px] md:text-[12px] md:leading-[16px]"
              )}
            >
              listed
            </div>
          </div>
        );
      }
    },
    {
      title: "Incentives",
      dataIndex: "incentives",
      width: "30%",
      render: (text: any, record: any) => {
        return (
          <div className="text-[#3D405A] text-[14px] font-[600] flex items-center gap-[12px]">
            <div className="w-[90px]">
              {numberFormatter(record.incentives, 2, true, {
                prefix: "$",
                isShort: true
              })}
            </div>
          </div>
        );
      }
    },
    {
      title: "Supporters",
      dataIndex: "supporters",
      width: "26%",
      render: (text: any, record: any) => {
        return (
          <div className="relative text-[#3D405A] text-[14px] font-[600] flex items-center gap-[12px]">
            <div className="w-[90px]">
              {numberFormatter(record.supporters, 0, true, {
                isShort: isMobile
              })}
            </div>
            {!isMobile ? (
              <Popover
                contentClassName="z-[200]"
                placement={PopoverPlacement.Right}
                content={!record.voted ? <VoteConfirm /> : null}
              >
                <button
                  type="button"
                  className="h-[28px] pr-[10px] leading-[26px] whitespace-nowrap px-[10px] border border-black disabled:cursor-[default!important] rounded-[10px] bg-[#FFDC50] flex justify-center items-center gap-[5px] text-center text-black text-[14px] font-[600]"
                  style={
                    record.voted
                      ? {
                          background: "#7CB424",
                          borderColor: "#7CB424",
                          color: "#FFF",
                          borderRadius: 14
                        }
                      : {}
                  }
                  disabled={record.voted}
                >
                  {record.voted ? (
                    <>
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.5L4.5 7L10.5 1"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                      <div>You Voted</div>
                    </>
                  ) : (
                    "Vote"
                  )}
                </button>
              </Popover>
            ) : (
              <div
                className={clsx(
                  "absolute flex justify-center items-center gap-[5px] h-[17px] rounded-[9px] px-[5px] bg-[#7CB424] whitespace-nowrap top-0 right-0",
                  "md:left-0 md:top-[-14px] md:gap-[2px] md:text-[12px]"
                )}
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M1 3.08333L3.94737 6L9 1"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-[12px] text-white font-[600] leading-[90%]">
                  You Voted
                </span>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getList = (currentPage?: number) => {
    if (loading) return;
    setLoading(true);
    const _currentPage = currentPage || page;
    const _total = 24;
    let _currentLen = _total - pageSize * (_currentPage - 1);
    _currentLen = _currentLen > pageSize ? pageSize : _currentLen;
    const _ls: any = [...new Array(_currentLen)].map((_, idx) => ({
      sn: (_currentPage - 1) * pageSize + idx + 1,
      name: "sPepe",
      icon: "/images/eth.svg",
      incentives: Math.floor(
        Math.random() * Math.pow(10, Math.ceil(Math.random() * 10))
      ),
      supporters: Math.floor(
        Math.random() * Math.pow(10, Math.ceil(Math.random() * 10))
      ),
      voted: idx % 5 === 0
    }));
    let _list = _ls;
    if (isMobile) {
      _list = list.slice();
      _list = [..._list, ..._ls];
    }
    setList(_list);
    setPageTotal(_total);
    setLoading(false);
  };

  const refs = {
    nextPage: () => {
      if (Big(page).times(pageSize).gte(pageTotal)) {
        return;
      }
      setPage(page + 1);
      getList(page + 1);
    }
  };
  useImperativeHandle(ref, () => refs);

  useEffect(() => {
    getList();
  }, []);

  return (
    <FlexTable
      columns={columns}
      list={list}
      headClass="py-[12px] px-[10px] border-b border-b-[rgba(0,0,0,0.2)] md:border-b-[0]"
      headColClass="text-[#3D405A] font-[500]"
      bodyClass="border-b border-b-[rgba(0,0,0,0.2)] md:border-b-[0] max-h-[calc(100dvh_-_350px)] md:max-h-[unset] overflow-y-auto"
      rowClass="odd:bg-[unset] md:odd:bg-[rgba(0,0,0,0.06)] md:rounded-[10px!important] py-[12px] px-[10px!imprtant] hover:bg-[rgba(0,0,0,0.06)]"
      colClass="text-[#3D405A] text-[14px] font-[600]"
      pagination={
        !isMobile && (
          <div className="pt-[12px] flex justify-end items-center pr-[12px]">
            <Pager
              maxPage={Math.ceil(pageTotal / pageSize)}
              onPageChange={(p: any) => {
                setPage(p);
                getList(p);
              }}
            />
          </div>
        )
      }
      onRow={onRow}
    />
  );
});

export default VoteTable;
