import Basic from "./basic";
import FlexTable from "@/components/flex-table";
import Empty from "@/components/empty";
import Pager from "@/components/pager";
import Dropdown from "@/components/dropdown";
import { useEffect, useMemo, useState } from "react";
import useRank from "../hooks/use-rank";
import RankMark from "../components/rank-mark";
import Popover, { PopoverPlacement } from "@/components/popover";
import TokensPopover from "../components/tokens-popover";
import { balanceShortFormated } from "@/utils/balance";
import { ellipsAccount } from "@/utils/account";
import useIsMobile from "@/hooks/use-isMobile";

export default function MemeRank({ open, tokens = [], onClose }: any) {
  const [queryTokenAddress, setQueryTokenAddress] = useState<any>();
  const isMobile = useIsMobile();
  const [filterTokens, cachedTokens] = useMemo(
    () => [
      tokens?.map((token: any) => ({
        key: token.token.address,
        name: (
          <div className="flex gap-[5px] items-center">
            <img
              src={token.token.logo}
              className="w-[20px] h-[20px] rounded-full"
            />
            <div className="text-[14px] font-semibold">
              {token.token.symbol}
            </div>
          </div>
        )
      })),
      tokens?.reduce(
        (acc: any, curr: any) => ({ ...acc, [curr.token.address]: curr.token }),
        {}
      )
    ],
    [tokens]
  );
  const { loading, list, totalPage, page, onChangePage } =
    useRank(queryTokenAddress);
  useEffect(() => {
    if (open) {
      onChangePage(1);
      setQueryTokenAddress("");
    }
  }, [open]);

  const queryToken = useMemo(
    () => cachedTokens[queryTokenAddress],
    [queryTokenAddress, tokens]
  );
  return (
    <Basic
      open={open}
      onClose={onClose}
      className="w-[706px] text-[14px] font-medium"
    >
      <div className="flex text-[20px] font-bold justify-between pr-[40px] md:pr-0">
        <div>Dapper Ranking</div>
        <Dropdown
          title={
            queryToken ? (
              <div className="flex gap-[5px] items-center">
                <img
                  src={queryToken.logo}
                  className="w-[20px] h-[20px] rounded-full"
                />
                <div className="text-[14px] font-semibold">
                  {queryToken.symbol}
                </div>
              </div>
            ) : (
              "All"
            )
          }
          list={filterTokens}
          value={queryTokenAddress}
          onChange={(item: any) => {
            setQueryTokenAddress(item.key);
          }}
          className="w-fit"
          dropPanelClassName="!w-[200px]"
        />
      </div>
      <div className="mt-[16px]">
        <FlexTable
          rowClass="h-[54px] !rounded-[10px]"
          columns={[
            {
              dataIndex: "index",
              title: "Index",
              render: (_, record) => {
                return <RankMark rank={record.rank as number} />;
              },
              width: "10%"
            },
            {
              dataIndex: "address",
              title: "Address",
              render: (_, record) => (
                <div className="text-[16px] font-semibold">
                  {ellipsAccount(record.address, 12)}
                </div>
              ),
              width: "60%"
            },
            {
              dataIndex: "amount",
              title: "Amount",
              align: "right",
              render: (_, record) => (
                <div className="flex justify-end gap-[20px]">
                  <div className="text-[16px] font-semibold">
                    ${balanceShortFormated(record.dapped_usd, 2)}
                  </div>
                  {!!record.dapped_tokens?.length && (
                    <Popover
                      content={
                        <TokensPopover
                          tokens={record.dapped_tokens.map((token: any) => ({
                            ...token,
                            ...cachedTokens[token.address]
                          }))}
                        />
                      }
                      placement={PopoverPlacement.TopLeft}
                    >
                      <div className="flex shrink-0">
                        {record.dapped_tokens.map((token: any, i: number) => (
                          <img
                            src={cachedTokens[token.address]?.logo}
                            className={`w-[26px] h-[26px] rounded-full shrink-0 ${
                              i > 0 && "ml-[8px]"
                            }`}
                          />
                        ))}
                      </div>
                    </Popover>
                  )}
                </div>
              ),
              width: "30%"
            }
          ]}
          list={list}
          loading={loading}
          renderEmpty={() => (
            <div className="mt-[50px] w-full flex justify-center items-center">
              <Empty desc="No asset found" />
            </div>
          )}
          showHeader={false}
          bodyClass="md:max-h-[60dvh] md:overflow-y-auto"
          onScrollBottom={
            totalPage === page
              ? null
              : () => {
                  onChangePage(page + 1);
                }
          }
        />
        {!isMobile && !!list.length && (
          <div className="pt-[12px] flex justify-end items-center pr-[12px]">
            <Pager
              maxPage={totalPage}
              onPageChange={(p: number) => {
                if (p !== page) onChangePage(p);
              }}
            />
          </div>
        )}
      </div>
    </Basic>
  );
}
