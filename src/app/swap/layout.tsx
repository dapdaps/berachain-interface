import DexLayout from "@/app/dex/[dapp]/layout";

export default function SwapLayout({
  children
}: {
  children: React.ReactElement;
}) {
  return <DexLayout>{children}</DexLayout>;
}
