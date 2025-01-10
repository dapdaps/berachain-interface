import { NFTCollectionWithStatus } from "../types";
import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { MintStatus } from "./MintStatus";

interface NFTCardProps {
  item: NFTCollectionWithStatus;
}

export const NFTCard: React.FC<NFTCardProps> = ({ item }) => {
  const { 
    collection_name,
    profile_image,
    slug,
    status,
    mint_group_data,
    chain
  } = item;

  const price = mint_group_data[0]?.price ?? 0;

  return (
    <div className="col-span-1">
      <Link
        href={`/collections/${slug}`}
        className="w-full rounded-xl bg-cover bg-center relative"
      >
        <img
          alt={collection_name}
          src={profile_image}
          className="w-full h-full absolute rounded-xl object-cover"
          width={500}
          height={500}
        />
        <div className="w-full rounded-xl backdrop-blur-2xl bg-[rgba(18,27,28,0.60)]">
          <Tilt
            perspective={500}
            glareEnable={true}
            glareMaxOpacity={0.45}
            glareBorderRadius={"12px"}
            scale={1.1}
          >
            <div className="aspect-square w-full h-full rounded-xl cursor-pointer shadow-lg relative">
              <img
                alt={collection_name}
                src={profile_image}
                className="w-full h-full object-cover aspect-square rounded-xl"
                width={500}
                height={500}
              />
              <div className="glare-wrapper">
                <div className="glare" />
              </div>
            </div>
          </Tilt>

          <div className="w-full flex flex-col text-white p-4 gap-y-2">
            {/* Card content */}
            <div className="flex justify-between items-center w-full gap-2">
              <div className="w-3/4 text-base h-7 flex justify-between items-center gap-1 font-semibold truncate">
                {collection_name}
              </div>
              <div className="w-1/4 flex items-center justify-end gap-1">
                <Image
                  alt={chain.chain_name}
                  src={`/images/dapps/berachain.png`}
                  width={40}
                  height={40}
                  className="w-6 h-6"
                />
                <Image
                  alt="logo"
                  src="/images/dapps/kingdomly.png"
                  width={40}
                  height={40}
                  className="w-7 h-7"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-normal items-center">
                <p className="text-xs text-white/60">Mint status:</p>
                <MintStatus status={status} />
              </span>
              <span className="font-normal items-center">
                <p className="text-xs text-white/60">Price:</p>
                <div className="font-semibold text-base">
                  {price === 0
                    ? "Free Mint"
                    : `${price} ${chain.native_currency}`}
                </div>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
