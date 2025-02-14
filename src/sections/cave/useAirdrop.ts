
import { useEffect, useState } from "react";
import { get } from "@/utils/http";
import useAccount from "@/hooks/use-account";

export const useAirdrop = () => {
  const [airDropRound, setAirDropRound] = useState<AirDropRound>();
  const [airDropPrize, setAirDropPrize] = useState<boolean>(false);
  const [airDropHistory, setAirDropHistory] = useState<AirDropHistoryData[]>([]);
  const { account } = useAccount() 

  useEffect(() => {
    get('/api/beracave/latest').then((res) => {
      if (res.data) {
        setAirDropRound({
          round: res.data.round,
          amount: res.data.amount,
          startTime: res.data.start_time * 1000,
          endTime: res.data.end_time * 1000
        })
      }
      
    });

    if (account) {
      get(`/api/user/guide/prize?account=${account}`).then((res) => {
          setAirDropPrize(res.data.owned)
      });

      get(`/api/beracave/history?address=${account}`).then((res) => {
        console.log('api/beracave/history', res);
        setAirDropHistory(res.data.map((item: any) => {
            return {
                startTime: item.start_time * 1000,
                endTime: item.end_time * 1000,
                amount: item.amount,
                rewardStatus: item.reward_status,
                round: item.round,
                reward: item.reward
            }
        }))
    });
    }
  }, [account]);

  return { airDropRound, setAirDropRound, airDropPrize, setAirDropPrize, airDropHistory, setAirDropHistory };
};

export type AirDropRound = {
  round: number;
  amount: number;
  startTime: number;
  endTime: number;
}


export type AirDropHistoryData = {
    startTime: number;
    endTime: number;
    amount: number;
    rewardStatus: number;
    round: number;
    reward: {
        amount: number;
        items: any[];
    };
}