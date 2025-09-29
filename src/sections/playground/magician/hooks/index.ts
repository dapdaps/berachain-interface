import { bera } from "@/configs/tokens/bera";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useDebounceFn, useRequest } from "ahooks";
import { useState } from "react";
import { EmptyPlayer, PlayerAvatars, Room } from "../config";
import { Contract } from "ethers";
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

  const { runAsync: getList, loading } = useRequest(async (params?: any) => {
    const _page = params?.page || list.page;
    const _sort = params?.sort || list.sort;
    const _order = params?.order || list.order;
    const _joined = typeof params?.joined === "boolean" ? params?.joined : list.joined;

    try {
      // const res = await get("/game/rps/list", {
      //   page: _page,
      //   sort: _sort,
      //   order: _order,
      //   address: _joined ? account : "",
      //   page_size: list.pageSize,
      // });
      // FIXME
      const res: any = {
        code: 200,
        data: {
          "total": 5,
          "total_page": 2,
          "data": [
            {
              "address": "0x86cdcd7fa9f3b24d68cbdd9170c3662036bdc2ef",
              "room_id": 12,
              "bet_amount": "1",
              "create_tx_hash": "0xa09f185b72fbf0fba322e1a4971550e8de895470ae2fc6a81de0528660ddadc2",
              "end_tx_hash": "",
              "create_time": 1759127516,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x86cdcd7fa9f3b24d68cbdd9170c3662036bdc2ef",
                  "moves": 1,
                  "tx_hash": "0xa09f185b72fbf0fba322e1a4971550e8de895470ae2fc6a81de0528660ddadc2",
                  "tx_time": 1759127516
                },
                {
                  "address": "0x86cdcd7fa9f3b24d68cbdd9170c3662036bdc2ef",
                  "moves": 2,
                  "tx_hash": "0xa09f185b72fbf0fba322e1a4971550e8de895470ae2fc6a81de0528660ddadc2",
                  "tx_time": 1759127516
                }
              ]
            },
            {
              "address": "0x05ef7067ba8fea1d609ff02dd3b9e8e48762eff9",
              "room_id": 11,
              "bet_amount": "5",
              "create_tx_hash": "0xf2c25bd87b3d9630c30fba1ca4c121a8cc919da555641714723fd6a8703f1715",
              "end_tx_hash": "",
              "create_time": 1759114284,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x05ef7067ba8fea1d609ff02dd3b9e8e48762eff9",
                  "moves": 1,
                  "tx_hash": "0xf2c25bd87b3d9630c30fba1ca4c121a8cc919da555641714723fd6a8703f1715",
                  "tx_time": 1759114284
                }
              ]
            },
            {
              "address": "0x05ef7067ba8fea1d609ff02dd3b9e8e48762eff9",
              "room_id": 10,
              "bet_amount": "10",
              "create_tx_hash": "0x52f61ad7a971cb3d33adb89646a86954b9d6796ddcd6b7f4c82fbbbcd5da5068",
              "end_tx_hash": "",
              "create_time": 1759114238,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x05ef7067ba8fea1d609ff02dd3b9e8e48762eff9",
                  "moves": 1,
                  "tx_hash": "0x52f61ad7a971cb3d33adb89646a86954b9d6796ddcd6b7f4c82fbbbcd5da5068",
                  "tx_time": 1759114238
                },
                {
                  "address": "0x05ef7067ba8fea1d609ff02dd3b9e8e48762eff9",
                  "moves": 2,
                  "tx_hash": "0x52f61ad7a971cb3d33adb89646a86954b9d6796ddcd6b7f4c82fbbbcd5da5068",
                  "tx_time": 1759114238
                }
              ]
            },
            {
              "address": "0x05ef7067ba8fea1d609ff02dd3b9e8e48762eff9",
              "room_id": 9,
              "bet_amount": "1",
              "create_tx_hash": "0x8019045fb963de083f546394e9974625980f6fcf98f5a5242ba8283c2662152e",
              "end_tx_hash": "",
              "create_time": 1759114195,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x05ef7067ba8fea1d609ff02dd3b9e8e48762eff9",
                  "moves": 0,
                  "tx_hash": "0x8019045fb963de083f546394e9974625980f6fcf98f5a5242ba8283c2662152e",
                  "tx_time": 1759114195
                }
              ]
            },
            {
              "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
              "room_id": 8,
              "bet_amount": "1",
              "create_tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
              "end_tx_hash": "",
              "create_time": 1759069068,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
                  "moves": 0,
                  "tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
                  "tx_time": 1759069068
                }
              ]
            },
            {
              "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
              "room_id": 8,
              "bet_amount": "1",
              "create_tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
              "end_tx_hash": "",
              "create_time": 1759069068,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
                  "moves": 0,
                  "tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
                  "tx_time": 1759069068
                }
              ]
            }, {
              "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
              "room_id": 8,
              "bet_amount": "1",
              "create_tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
              "end_tx_hash": "",
              "create_time": 1759069068,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
                  "moves": 0,
                  "tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
                  "tx_time": 1759069068
                }
              ]
            }, {
              "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
              "room_id": 8,
              "bet_amount": "1",
              "create_tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
              "end_tx_hash": "",
              "create_time": 1759069068,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
                  "moves": 0,
                  "tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
                  "tx_time": 1759069068
                }
              ]
            }, {
              "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
              "room_id": 8,
              "bet_amount": "1",
              "create_tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
              "end_tx_hash": "",
              "create_time": 1759069068,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
                  "moves": 0,
                  "tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
                  "tx_time": 1759069068
                }
              ]
            }, {
              "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
              "room_id": 8,
              "bet_amount": "1",
              "create_tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
              "end_tx_hash": "",
              "create_time": 1759069068,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
                  "moves": 0,
                  "tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
                  "tx_time": 1759069068
                }
              ]
            }, {
              "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
              "room_id": 8,
              "bet_amount": "1",
              "create_tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
              "end_tx_hash": "",
              "create_time": 1759069068,
              "status": 1,
              "winner_address": "",
              "players": [
                {
                  "address": "0x635fa4477c7f9681a4ac88fa6147f441114e8655",
                  "moves": 0,
                  "tx_hash": "0x8cc6c0075b50c33132b3d6688130fe5c92ae776be19f951fcb32feeab5d84bc4",
                  "tx_time": 1759069068
                }
              ]
            },
          ]
        }
      };
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
    refreshDeps: [],
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
    loading,
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
  };
}
