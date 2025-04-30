import { numberFormatter } from "@/utils/number-formatter";
import PoolTable from "../../pool-table";
import Big from "big.js";
export default function columns({ page, PAGE_SIZE }: any) {
  return [
    {
      title: "#",
      key: "#",
      sort: false,
      width: "5%",
      render: (item: any, index: number) => {
        return PAGE_SIZE * (page - 1) + index + 1;
      }
    },
    {
      title: "Pool",
      key: "pool",
      sort: false,
      width: "30%",
      render: (item: any, index: number) => {
        return <PoolTable item={item} />;
      }
    },
    {
      title: "Pool APR",
      key: "apr",
      sort: true,
      width: "13%",
      render: (item: any, index: number) => {
        return Big(item?.["apr"] ?? 0).gt(0)
          ? `${numberFormatter(item["apr"], 2, true)}%`
          : "-";
      }
    },
    {
      title: "BGT APR",
      key: "bgtApr",
      sort: true,
      width: "13%",
      render: (item: any, index: number) => {
        return Big(item?.["bgtApr"] ?? 0).gt(0)
          ? `${numberFormatter(item["bgtApr"], 2, true)}%`
          : "-";
      }
    },
    {
      title: "TVL",
      key: "tvl",
      sort: true,
      width: "10%",
      render: (item: any, index: number) => {
        return item["tvl"]
          ? numberFormatter(item["tvl"], 2, true, {
              prefix: "$",
              isShort: true
            })
          : "-";
      }
    },
    {
      title: " 24h Volume",
      key: " 24h Volume",
      sort: true,
      width: "14%",
      render: (item: any, index: number) => {
        return item["volume24h"]
          ? numberFormatter(item["volume24h"], 2, true, {
              prefix: "$",
              isShort: true
            })
          : "-";
      }
    },
    {
      title: " 24h Fees",
      key: " 24h Fees",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item["fees24h"]
          ? numberFormatter(item["fees24h"], 2, true, {
              prefix: "$",
              isShort: true
            })
          : "-";
      }
    }
  ];
}
