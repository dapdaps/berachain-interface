import Materials from "../../components/materials";
import Tokens from "./tokens";

export default function Panel({
  onOpenModal,
  tokens,
  userData,
  balances,
  balancesLoading
}: any) {
  return (
    <div className="relative mt-[140px] md:mt-[60px]">
      <Materials />
      <div className="relative z-[5] py-[45px] w-full bg-[url(/images/meme/ground.png)] bg-contain min-h-[300px]">
        <Tokens
          onOpenModal={onOpenModal}
          tokens={tokens}
          userData={userData}
          balancesLoading={balancesLoading}
          balances={balances}
        />
      </div>
    </div>
  );
}
