import Input from "@/sections/pools/components/deposit-amounts/input";
import Button from "@/components/button";

export default function Stake() {
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
      <Button type="primary" className="w-full h-[46px] mt-[16px]">
        Withdraw
      </Button>
    </>
  );
}
