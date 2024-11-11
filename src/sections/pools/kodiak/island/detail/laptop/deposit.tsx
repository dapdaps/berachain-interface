import Input from "@/sections/pools/components/deposit-amounts/input";
import SwitchTabs from "@/components/switch-tabs";
import Button from "@/components/button";
import { useState } from "react";

export default function Deposit() {
  const [type, setType] = useState("");
  return (
    <>
      <Input
        value=""
        readOnly
        token={{
          isNative: true,
          decimals: 18,
          chainId: 18,
          symbol: "BERA",
          icon: "/assets/tokens/bera.svg"
        }}
        className="mt-[16px]"
        onLoad={() => {}}
      />
      <Input
        value=""
        readOnly
        token={{
          isNative: true,
          decimals: 18,
          chainId: 18,
          symbol: "BERA",
          icon: "/assets/tokens/bera.svg"
        }}
        className="mt-[16px]"
        onLoad={() => {}}
      />
      <div className="rounded-[12px] border-[#373A53] border p-[14px] mt-[10px] text-[14px] text-[#3D405A] font-medium">
        <div className="flex justify-between items-start">
          <div>Estimated Received</div>
          <div className="text-right">
            <div>0.21342 KODIAK-1</div>
            <div>($1.91)</div>
          </div>
        </div>
        <div className="flex justify-between items-start mt-[12px]">
          <div>Minimum Received</div>
          <div className="text-right">
            <div>0.21342 KODIAK-1</div>
            <div>($1.91)</div>
          </div>
        </div>
      </div>
      <SwitchTabs
        tabs={[
          { label: "Deposit only", value: "deposit" },
          { label: "With staking", value: "staing" }
        ]}
        current={type}
        onChange={setType}
        className="mt-[14px]"
        tabClassName="font-semibold"
        style={{
          height: 40,
          padding: "3px 4px",
          background: "#DFDCC4"
        }}
      />
      <Button type="primary" className="w-full h-[46px] mt-[16px]">
        Supply
      </Button>
    </>
  );
}
