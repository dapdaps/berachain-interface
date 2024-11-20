import Drawer from "@/components/drawer";
import Image from "next/image";
import { icons } from "@/configs/chains";

const MobileUser = (props: Props) => {
  const {
    visible,
    onClose,
    handleDisconnect,
    walletInfo,
    handleCopy,
    address,
    tokenLogoShown,
    balanceShown,
    tokenSymbolShown,
    chainId,
    userInfo,
  } = props;

  let walletName = walletInfo?.name || '';
  if (walletName) {
    walletName = walletName.replace(/^io\./, '');
    walletName = walletName.charAt(0).toUpperCase() + walletName.slice(1);
  }

  return (
    <Drawer visible={visible} onClose={onClose} size="203px" className="bg-[#FFFDEB]">
      <div className="mt-[30px] px-[20px]">
        <div className="flex gap-2 items-center">
          <div className="w-[40px] h-[40px]">
            {address && userInfo?.avatar ? (
              <img
                src={userInfo?.avatar}
                alt=""
                className="w-[40px] h-[40px] rounded-full"
              />
            ) : (
              <div className="w-[40px] h-[40px] rounded-[50%] border-[2px] border-[#1F2229] bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <div className="text-black text-[24px] font-semibold leading-[1] font-CherryBomb">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ""}
              </div>
              <div className="click cursor-pointer" onClick={handleCopy}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6.71436" y="6.71436" width="10.2857" height="10.2857" rx="2" stroke="#979ABE" stroke-width="2"/>
                <path d="M11.2857 4.42857V3C11.2857 1.89543 10.3903 1 9.28571 1H3C1.89543 1 1 1.89543 1 3V9.28571C1 10.3903 1.89543 11.2857 3 11.2857H4.42857" stroke="#979ABE" stroke-width="2"/>
              </svg>
              </div>
            </div>
            <div className="text-[#3D405A] text-[16px] font-normal text-nowrap leading-[1] overflow-hidden overflow-ellipsis">
              Connected with {walletName}
            </div>
          </div>
        </div>
        <div className="pl-[9px] pr-[16px] w-fit h-[36px] border border-black rounded-full flex items-center gap-[8px] mt-[14px]">
          <div
            className="relative w-[20px] h-[20px] rounded-full shrink-0 bg-[#F0F0F0]"
            style={{
              backgroundImage: `url("${tokenLogoShown}")`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* {chainId ? (
              <Image
                src={icons[chainId]}
                alt=""
                width={10}
                height={10}
                className="absolute right-[-3px] bottom-[-3px]"
              />
            ) : (
              <div className="absolute w-[10px] h-[10px] rounded-[2px] border border-black right-[-3px] bottom-[-3px]" />
            )} */}
          </div>
          <div className="text-black text-[16px] font-normal flex-shrink-0 overflow-hidden text-nowrap">
            {balanceShown} {tokenSymbolShown}
          </div>

        </div>
        <div
            className="cursor-pointer flex gap-2 items-center click mt-[22px] transition-all duration-300 hover:bg-[#f7f7f7]"
            onClick={handleDisconnect}
          >
            <div className="">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.39516 20H13.2164C13.832 20 14.3315 19.4625 14.3315 18.8C14.3315 18.1375 13.832 17.6 13.2164 17.6H2.51132C2.4091 17.4675 2.23022 17.0775 2.23022 16.455V3.5475C2.23022 2.925 2.4091 2.535 2.51132 2.4H13.2164C13.832 2.4 14.3315 1.8625 14.3315 1.2C14.3315 0.5375 13.832 0 13.2164 0H2.39516C1.02915 0 0 1.525 0 3.5475V16.4525C0 18.475 1.02915 20 2.39516 20ZM15.4907 15.3454L19.6329 10.8904C19.6463 10.8774 19.6594 10.864 19.6724 10.8502C19.891 10.6149 20.0002 10.3076 19.9999 10.0003C20.0002 9.69302 19.891 9.38566 19.6724 9.15035C19.6582 9.13507 19.6437 9.12028 19.629 9.106L15.493 4.65523C15.0563 4.18523 14.3524 4.18523 13.9156 4.65523C13.4789 5.12523 13.4789 5.88273 13.9156 6.35273L16.1916 8.80059H8.54917C7.93354 8.80059 7.43406 9.33809 7.43406 10.0006C7.43406 10.6631 7.93354 11.2006 8.54917 11.2006H16.1898L13.9156 13.6479C13.4789 14.1179 13.4789 14.8754 13.9156 15.3454C14.1317 15.5804 14.4174 15.6979 14.7032 15.6979C14.9889 15.6979 15.2747 15.5804 15.4907 15.3454Z" fill="#FF3E78"/>
              </svg>
            </div>
            <div className="text-[#000000] text-[16px] font-semibold leading-[1]">
              Disconnect
            </div>
          </div>
      </div>
    </Drawer>
  );
};

export default MobileUser;

interface Props {
  visible: boolean;
  walletInfo: any;
  addressShown: any;
  address: any;
  tokenLogoShown: any;
  balanceShown: any;
  tokenSymbolShown: any;
  chainId: any;
  userInfo: any;

  onClose(): void;
  handleDisconnect(): void;
  handleCopy(): void;
}
