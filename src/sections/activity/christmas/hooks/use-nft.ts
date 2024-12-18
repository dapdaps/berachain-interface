import useCustomAccount from "@/hooks/use-account";
import { useEffect, useState } from "react";
import { get } from "@/utils/http";
import { NFTs } from "@/sections/activity/christmas/config";
import { IBase } from '@/sections/activity/christmas/hooks/use-base';

export function useNft(props: { base: IBase; }): INft {
  const { account, provider } = useCustomAccount();

  const [loading, setLoading] = useState(false);
  const [nftList, setNftList] = useState<Partial<NFT>[]>([]);

  const getNftList = async () => {
    setLoading(true);
    const res = await get("/api/mas/reward/nfts");
    if (res.code !== 0) {
      setLoading(false);
      return;
    }
    const _nftList: Partial<NFT>[] = res.data || [];
    _nftList.forEach((it) => {
      it.classLogo = NFTs[it.name as string]?.icon;
    });
    setNftList(_nftList);
    setLoading(false);
  };

  useEffect(() => {
    getNftList();
  }, [account]);

  return {
    nftLoading: loading,
    nftList
  };
}

export interface INft {
  nftLoading: boolean;
  nftList: Partial<NFT>[];
}

export interface NFT {
  id: number;
  name: string;
  token_id: string;
  logo: string;
  classLogo: string;
  owned?: string;
}
