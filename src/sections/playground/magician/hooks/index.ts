import { bera } from "@/configs/tokens/bera";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useDebounceFn, useRequest } from "ahooks";
import { useRef, useState } from "react";
import { ContractStatus, ContractStatus2Status, EmptyPlayer, PlayerAvatars, Room, Status, WinnerStatus } from "../config";
import { Contract, utils } from "ethers";
import { RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI } from "../contract";
import { cloneDeep } from "lodash";
import useTokenBalance from "@/hooks/use-token-balance";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { multicall, multicallAddresses } from "@/utils/multicall";
import Big from "big.js";
import dayjs from "dayjs";
import { useAudioStore } from "@/stores/use-audio";

export function useMagician() {
  const [betToken] = useState(bera["bera"]);

  const { account, provider, accountWithAk } = useCustomAccount();
  const {
    tokenBalance: nativeBalance,
    isLoading: nativeBalanceLoading,
    getTokenBalance: getNativeBalance,
  } = useTokenBalance(betToken.address, betToken.decimals, DEFAULT_CHAIN_ID);
  const audioStore: any = useAudioStore();

  const [listTab, setListTab] = useState("all");
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
  const [userList, setUserList] = useState({
    data: [],
    page: 1,
    pageSize: 10,
    pageTotal: 0,
    total: 0,
    // bet_amount | create_time
    sort: "create_time",
    // asc | desc
    order: "desc",
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

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
    const _result = {
      minBetAmount: "0.1",
      // hours
      timeoutDuration: "86400",
    };
    const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
    const calls = [
      {
        address: RPS_CONTRACT_ADDRESS,
        name: "minBetAmount",
        params: [],
      },
      {
        address: RPS_CONTRACT_ADDRESS,
        name: "timeoutDuration",
        params: [],
      },
    ];
    try {
      const _gameConfig = await multicall({
        abi: RPS_CONTRACT_ADDRESS_ABI,
        options: {},
        calls,
        multicallAddress,
        provider
      });
      const [[_minBetAmount], [_timeoutDuration]] = _gameConfig ?? [];
      const minBetAmount = utils.formatUnits(_minBetAmount, betToken.decimals);
      const timeoutDuration = utils.formatUnits(_timeoutDuration, 0);
      _result.minBetAmount = minBetAmount;
      _result.timeoutDuration = timeoutDuration;
      console.log("%cGame config: %o", "background:#696FC7;color:#fff;", _result);
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

  const { runAsync: getUserList, loading: userListLoading } = useRequest(async (params?: any) => {
    if (!accountWithAk || !gameConfig) {
      return;
    }

    const _page = params?.page || userList.page;
    const _sort = params?.sort || userList.sort;
    const _order = params?.order || userList.order;

    try {
      const res = await get("/api/go/game/rps/user/list", {
        page: _page,
        sort: _sort,
        order: _order,
        page_size: list.pageSize,
      });
      if (res.code !== 200) {
        return;
      }
      const now = dayjs().utc();
      setUserList((prev) => {
        const _userList = { ...prev };
        _userList.data = res.data.data || [];
        _userList.data.forEach((item: any) => {
          item.isOwn = item.address.toLowerCase() === account.toLowerCase();
          item.canClaim =
            item.players[0]?.address?.toLowerCase() === account.toLowerCase()
            && [Status.Ongoing, Status.Joined].includes(item.status)
            && dayjs(item.create_time * 1000).add(Big(gameConfig.timeoutDuration).div(3600).toNumber(), "hours").utc().isBefore(now);
          setPlayersAvatar(item.players);
        });
        console.log("_userList: %o", _userList);
        if (_page === 1) {
          _userList.pageTotal = res.data.total_page;
          _userList.total = res.data.total;
        }
        return _userList;
      });
    } catch (error) {
      console.log("get user list failed: %o", error);
    }
  }, {
    refreshDeps: [accountWithAk, gameConfig],
  });

  const onUserListClaimed = (record: Room) => {
    setUserList((prev) => {
      const _useList = { ...prev };
      const currRecord: any = _useList.data.find((item: any) => item.room_id === record.room_id);
      if (!currRecord) {
        return _useList;
      }
      currRecord.status = Status.Canceled;
      currRecord.canClaim = false;
      return _useList;
    });
  };

  const { run: getListDelay } = useDebounceFn(() => {
    getList();
  }, { wait: 5000 });

  const onChange2List = (type: any, room: Room) => {
    if (type === "create") {
      setList((prev: any) => {
        const _list = { ...prev };
        _list.data.unshift(room);
        return _list;
      });
      return;
    }
    if (type === "join") {
      setList((prev: any) => {
        const _list = { ...prev };
        const currRoom = _list.data.find((item: any) => item.room_id === room.room_id);
        // first time join
        if (!currRoom) {
          return _list;
        }
        // existed
        typeof room.players !== "undefined" && (currRoom.players = room.players);
        typeof room.status !== "undefined" && (currRoom.status = room.status);
        typeof room.winner_address !== "undefined" && (currRoom.winner_address = room.winner_address);
        typeof room.winner_moves !== "undefined" && (currRoom.winner_moves = room.winner_moves);
        return _list;
      });
      return;
    }
  };

  const onPageChange = (page: number) => {
    setList((prev) => {
      const _list = { ...prev };
      _list.page = page;
      return _list;
    });
    getList({ page });
  };

  const onUserListPageChange = (page: number) => {
    setUserList((prev) => {
      const _list = { ...prev };
      _list.page = page;
      return _list;
    });
    getUserList({ page });
  };

  const onSort = (sort: "bet_amount" | "create_time", order: "asc" | "desc") => {
    setList((prev) => {
      const _list = { ...prev };
      _list.page = 1;
      _list.sort = sort;
      _list.order = order;
      return _list;
    });
    getList({ order, sort, page: 1 });
  };

  const onUserListSort = (sort: "bet_amount" | "create_time", order: "asc" | "desc") => {
    setUserList((prev) => {
      const _list = { ...prev };
      _list.page = 1;
      _list.sort = sort;
      _list.order = order;
      return _list;
    });
    getUserList({ order, sort, page: 1 });
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

  const formatRoomInfo = (currRoom: any, contractRoomInfo: any) => {
    // numberA and data.playerA is always exist
    if (contractRoomInfo.data.playerB !== EmptyPlayer) {
      if (!currRoom.players[1]) {
        currRoom.players[1] = {
          address: contractRoomInfo.data.playerB,
          moves: contractRoomInfo.numberB,
          tx_hash: "",
          tx_time: 0,
        };
      }
    }
    if (contractRoomInfo.data.playerC !== EmptyPlayer) {
      if (!currRoom.players[2]) {
        currRoom.players[2] = {
          address: contractRoomInfo.data.playerC,
          moves: contractRoomInfo.numberC,
          tx_hash: "",
          tx_time: 0,
        };
      }
    }
    currRoom.status = ContractStatus2Status[contractRoomInfo.status as ContractStatus];

    if (contractRoomInfo.winnerStatus) {
      // winnerStatus = 1: data.playerA won
      // winnerStatus = 2: data.playerB won
      // winnerStatus = 3: data.playerC won
      const winnerMap: any = {
        [WinnerStatus.WinnerPlayerA]: {
          address: contractRoomInfo.data.playerA,
          moves: contractRoomInfo.numberA,
        },
        [WinnerStatus.WinnerPlayerB]: {
          address: contractRoomInfo.data.playerB,
          moves: contractRoomInfo.numberB,
        },
        [WinnerStatus.WinnerPlayerC]: {
          address: contractRoomInfo.data.playerC,
          moves: contractRoomInfo.numberC,
        },
      };
      if (contractRoomInfo.winnerStatus === WinnerStatus.UnusedRoomClosed) {
        currRoom.status = Status.Canceled;
      } else {
        currRoom.winner_address = winnerMap[contractRoomInfo.winnerStatus as WinnerStatus].address;
        currRoom.winner_moves = winnerMap[contractRoomInfo.winnerStatus as WinnerStatus].moves;
      }
    }

    setPlayersAvatar(currRoom.players);

    return currRoom;
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
      formatRoomInfo(_roomInfo, roomInfo);
    } catch (error) {
      console.log("join check failed: %o", error);
    }
    return {
      ..._roomInfo,
      contractData,
    };
  }, {
    manual: true,
  });

  const [userLatest, setUserLatest] = useState([]);
  const { loading: userLatestLoading, runAsync: getUserLatest } = useRequest(async () => {
    if (!accountWithAk) {
      setUserLatest([]);
      return;
    }
    try {
      const res = await get("/api/go/game/rps/user/latest");
      if (res.code !== 200) {
        setUserLatest([]);
        return;
      }
      const _list = res.data || [];
      _list.forEach((item: any) => {
        setPlayersAvatar(item.players);
      });
      setUserLatest(_list);
      return _list;
    } catch (error) {
      console.log("get user latest failed: %o", error);
    }
    setUserLatest([]);
  }, {
    refreshDeps: [accountWithAk],
  });
  const { } = useRequest(async () => {
    if (!account || !provider) {
      return;
    }
    const calls = userLatest
      ?.filter((item: any) => !item.winner_address)
      ?.map((item: any) => ({
        address: RPS_CONTRACT_ADDRESS,
        name: "getRoomsInfo",
        params: [item.room_id, item.room_id],
      }));
    if (!calls?.length) {
      return;
    }
    const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

    try {
      const roomInfos = await multicall({
        abi: RPS_CONTRACT_ADDRESS_ABI,
        options: {},
        calls,
        multicallAddress,
        provider
      });
      setUserLatest((prev: any) => {
        const _userLatest = prev.slice();
        roomInfos.forEach((item: any) => {
          const [[roomInfo]] = item;
          const currRoom = _userLatest.find((item: any) => item.room_id === +roomInfo.data.roomId.toString());
          if (!currRoom) {
            return;
          }
          formatRoomInfo(currRoom, roomInfo);
        });
        console.log("%cLatest polling result: %o", "background:#E2A16F;color:#fff;", _userLatest);
        const unPlayedAudioRoom = _userLatest.find((item: any) => !!item.winner_address && !item.playedAudio);
        if (unPlayedAudioRoom) {
          unPlayedAudioRoom.playedAudio = true;
          playAudio({ type: "notification", action: "play" });
        }
        return _userLatest;
      });
    } catch (error) {
      console.log("polling latest contract room info failed: %o", error);
    }
  }, {
    pollingInterval: 5000,
  });
  const onChange2UserLatest = (type: any, room: Room) => {
    if (type === "create") {
      setUserLatest((prev: any) => {
        const _userLatest = prev.slice();
        _userLatest.unshift(room);
        return _userLatest;
      });
      return;
    }
    if (type === "join") {
      setUserLatest((prev: any) => {
        const _userLatest = prev.slice();
        const currRoom = _userLatest.find((item: any) => item.room_id === room.room_id);
        // first time join
        if (!currRoom) {
          _userLatest.unshift(room);
        }
        // existed
        else {
          typeof room.players !== "undefined" && (currRoom.players = room.players);
          typeof room.status !== "undefined" && (currRoom.status = room.status);
          typeof room.winner_address !== "undefined" && (currRoom.winner_address = room.winner_address);
          typeof room.winner_moves !== "undefined" && (currRoom.winner_moves = room.winner_moves);
        }
        return _userLatest;
      });
      return;
    }
    if (type === "claim") {
      setUserLatest((prev: any) => {
        const _userLatest = prev.slice();
        const currRoomIndex = _userLatest.findIndex((item: any) => item.room_id === room.room_id);
        if (currRoomIndex < 0) {
          return _userLatest;
        }
        // remove the closed room form user latest
        _userLatest.splice(currRoomIndex, 1);
        return _userLatest;
      });
      return;
    }
  };

  const audioRefs = useRef<Map<string, HTMLAudioElement | null>>(new Map());
  const playAudio = (preload: { type: string; action?: "play" | "pause"; }) => {
    if (!audioStore.open) {
      return;
    }

    let { type, action } = preload;
    action = action || "play";

    const audioRef = audioRefs.current.get(type);
    if (!audioRef) {
      return;
    }

    const _play = async () => {
      try {
        switch (action) {
          case "play":
            audioRef.currentTime = 0;
            // iOS Safari/Chrome requires user interaction to play audio
            const playPromise = audioRef.play();
            if (playPromise !== undefined) {
              try {
                await playPromise;
              } catch (playError) {
                console.warn(`Failed to play audio ${type}:`, playError);
                // Try to load the audio first if play failed
                audioRef.load();
                try {
                  await audioRef.play();
                } catch (retryError) {
                  console.warn(`Retry play failed for audio ${type}:`, retryError);
                }
              }
            }
            break;
          case "pause":
            audioRef.pause();
            break;
          default:
            break;
        }
      } catch (error) {
        console.warn(`Error in playAudio for ${type}:`, error);
      }
    };

    _play();
  };

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
    listTab,
    setListTab,
    userList,
    getUserList,
    userListLoading,
    onUserListPageChange,
    onUserListSort,
    historyOpen,
    setHistoryOpen,
    onUserListClaimed,
    userLatest,
    userLatestLoading,
    getUserLatest,
    onChange2UserLatest,
    onChange2List,
    audioRefs,
    playAudio,
    rulesOpen,
    setRulesOpen,
  };
}
