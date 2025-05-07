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
      width: "50%",
      render: (item: any, index: number) => {
        return <PoolTable item={item} />;
      }
    },
    {
      title: "Pool APR",
      key: "apr",
      sort: true,
      width: "20%",
      render: (item: any, index: number) => {
        return Big(item?.["apr"] ?? 0).gt(0)
          ? `${numberFormatter(item["apr"], 2, true)}%`
          : "-";
      }
    },
    {
      title: "TVL",
      key: "tvl",
      sort: true,
      width: "25%",
      render: (item: any, index: number) => {
        return item["tvl"]
          ? numberFormatter(item["tvl"], 2, true, {
              prefix: "$",
              isShort: true
            })
          : "-";
      }
    }
  ];
}
