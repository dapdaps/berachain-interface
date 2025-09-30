import { bera } from "@/configs/tokens/bera";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useDebounceFn, useRequest } from "ahooks";
import { useState } from "react";
import { EmptyPlayer, PlayerAvatars, Room } from "../config";
import { Contract, utils } from "ethers";
import { RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI } from "../contract";
import { cloneDeep } from "lodash";
import useTokenBalance from "@/hooks/use-token-balance";
import { DEFAULT_CHAIN_ID } from "@/configs";

export function useMagician() {
  const [betToken] = useState(bera["bera"]);

  const { account, provider } = useCustomAccount();
  const {
    tokenBalance: nativeBalance,
    isLoading: nativeBalanceLoading,
    getTokenBalance: getNativeBalance,
  } = useTokenBalance(betToken.address, betToken.decimals, DEFAULT_CHAIN_ID);

  const [room, setRoom] = useState<Room>();
  const [list, setList] = useState({
    data: [],
    page: 1,
    pageSize: 10,
    pageTotal: 0,
    total: 0,
    // bet_amount | create_time
    sort: "create_time",
    // asc | desc
    order: "desc",
    joined: false,
  });

  const setPlayersAvatar = (players: any) => {
    const palyerAvatars: Record<string, string> = {};
    players?.forEach((player: any, idx: number) => {
      let defaultAvatar = PlayerAvatars[idx];
      if (palyerAvatars[player.address]) {
        player.avatar = palyerAvatars[player.address];
        return;
      }
      if (Object.values(palyerAvatars).includes(defaultAvatar)) {
        defaultAvatar = PlayerAvatars[idx + 3] || PlayerAvatars[0];
      }
      let playerAvatar = defaultAvatar;
      try {
        const playerNumber = BigInt(player.address).toString();
        playerAvatar = PlayerAvatars[playerNumber.slice(-1)];
      } catch (err: any) { }
      player.avatar = playerAvatar || defaultAvatar;
      palyerAvatars[player.address] = player.avatar;
    });
  };

  const { loading: gameConfigLoading, data: gameConfig } = useRequest(async () => {
    if (!provider) {
      return;
    }
    const _result = { minBetAmount: "1" };
    const contract = new Contract(RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI, provider);
    try {
      const res = await contract.minBetAmount();
      const minBetAmount = utils.formatUnits(res, betToken.decimals);
      _result.minBetAmount = minBetAmount;
      console.log("game config: %o", _result);
    } catch (error) {
      console.log("get game config failed: %o", error);
    }

    return _result;
  }, {
    refreshDeps: [provider],
  });

  const { runAsync: getList, loading } = useRequest(async (params?: any) => {
    if (!gameConfig) {
      return;
    }

    const _page = params?.page || list.page;
    const _sort = params?.sort || list.sort;
    const _order = params?.order || list.order;
    const _joined = typeof params?.joined === "boolean" ? params?.joined : list.joined;

    try {
      const res = await get("/api/go/game/rps/list", {
        page: _page,
        sort: _sort,
        order: _order,
        address: _joined ? account : "",
        page_size: list.pageSize,
      });
      if (res.code !== 200) {
        return;
      }
      setList((prev) => {
        const _list = { ...prev };
        _list.data = res.data.data || [];
        _list.data.forEach((item: any) => {
          item.isOwn = item.address.toLowerCase() === account.toLowerCase();
          setPlayersAvatar(item.players);
        });
        if (_page === 1) {
          _list.pageTotal = res.data.total_page;
          _list.total = res.data.total;
        }
        return _list;
      });
    } catch (error) {
      console.log("get rps list failed: %o", error);
    }
  }, {
    refreshDeps: [gameConfig],
  });

  const { run: getListDelay } = useDebounceFn(() => {
    getList();
  }, { wait: 3000 });

  const onPageChange = (page: number) => {
    setList((prev) => {
      const _list = { ...prev };
      _list.page = page;
      return _list;
    });
    getList({ page });
  };

  const onSort = (sort: "bet_amount" | "create_time", order: "asc" | "desc") => {
    setList((prev) => {
      const _list = { ...prev };
      _list.page = 1;
      _list.sort = sort;
      _list.order = order;
      return _list;
    });
    getList({ order, page: 1 });
  };

  const onJoined = (joined: boolean) => {
    setList((prev) => {
      const _list = { ...prev };
      _list.page = 1;
      _list.joined = joined;
      return _list;
    });
    getList({ joined, page: 1 });
  };

  const onRoomLoading = (roomId: number, loading: boolean) => {
    setList((prev) => {
      const _list = { ...prev };
      const current: any = _list.data.find((item: any) => item.room_id === roomId);
      if (current) {
        current.loading = loading;
      }
      return _list;
    });
  };

  const { runAsync: getRoomInfo, loading: getRoomInfoLoading } = useRequest<Room, Room | any>(async (_room: Room) => {
    const _roomInfo = cloneDeep(_room);
    const contract = new Contract(RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI, provider);
    let contractData;
    try {
      const res = await contract.getRoomsInfo(_room.room_id, _room.room_id);
      const roomInfo = res[0];
      console.log("%cLatest roomInfo: %o", "background:#696FC7;color:#fff;", roomInfo);
      contractData = roomInfo;
      // numberA and data.playerA is always exist
      if (roomInfo.data.playerB !== EmptyPlayer) {
        if (!_roomInfo.players[1]) {
          _roomInfo.players[1] = {
            address: roomInfo.data.playerB,
            moves: roomInfo.numberB,
            tx_hash: "",
            tx_time: 0,
          };
        }
      }
      if (roomInfo.data.playerC !== EmptyPlayer) {
        if (!_roomInfo.players[2]) {
          _roomInfo.players[2] = {
            address: roomInfo.data.playerC,
            moves: roomInfo.numberC,
            tx_hash: "",
            tx_time: 0,
          };
        }
      }
      setPlayersAvatar(_roomInfo.players);
    } catch (error) {
      console.log("join check failed: %o", error);
    }
    return {
      ..._roomInfo,
      contractData: contractData,
    };
  }, {
    manual: true,
  });

  return {
    list,
    getList,
    getListDelay,
    loading: loading,
    gameConfigLoading: gameConfigLoading,
    betToken,
    betTokenBalance: nativeBalance,
    betTokenBalanceLoading: nativeBalanceLoading,
    getBetTokenBalance: getNativeBalance,
    onPageChange,
    onSort,
    onRoomLoading,
    account,
    onJoined,
    room,
    setRoom,
    getRoomInfo,
    getRoomInfoLoading,
    setPlayersAvatar,
    gameConfig,
  };
}
