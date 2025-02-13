import Drawer from "@/components/drawer";
import { IS_MAINNET } from "@/configs";
import ChainIcon from "../icons/chain";

const MobileNetworks = (props: Props) => {
  const { visible, onClose } = props;
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      size="222px"
      className="bg-[#FFFDEB]"
    >
      <div className="mt-5 px-4">
        <div className="px-4 text-[18px] font-[700] leading-[16.2px] text-left mb-3">
          Networks
        </div>
        {[
          {
            name: "Berachain bArtio (Testnet)",
            icon: <ChainIcon size={40} isMainnet={false} />,
            link: "https://testnet.beratown.dapdap.net/"
          },
          {
            name: "Berachain Mainnet",
            icon: <ChainIcon size={40} />,
            link: "https://beratown.dapdap.net/"
          }
        ].map((_chain: any, i: number) => (
          <div
            key={_chain.name}
            className="w-full h-[68px] flex justify-start gap-[12px] items-center p-[14px] bg-[#000] bg-opacity-[0.06] cursor-pointer hover:bg-[#F2F2F2] transition-all ease-in-out duration-300 mb-3 rounded-[10px]"
            onClick={(e) => {
              if (i === 0 && !IS_MAINNET) return;
              if (i === 1 && IS_MAINNET) return;
              window.open(_chain.link, "_self");
            }}
          >
            {_chain.icon}
            <div className="text-black text-[18px] font-semibold leading-[16.2px]">
              {_chain.name}
            </div>
            {(IS_MAINNET ? i === 1 : i === 0) && (
              <div className="w-3 h-3 rounded-full bg-[#A0D733]"></div>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default MobileNetworks;

interface Props {
  visible: boolean;
  onClose(): void;
}
