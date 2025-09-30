import { DEFAULT_CHAIN_ID } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import { useConnectWallet } from "@/hooks/use-connect-wallet";
import useToast from "@/hooks/use-toast";
import { useRequest } from "ahooks";
import { ContractStatus, EMove, Moves, Room, Status } from "../config";
import { useEffect, useMemo, useRef, useState } from "react";
import { Contract, utils } from "ethers";
import { RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI } from "../contract";
import Big from "big.js";

export function useJoin(props?: any) {
  const {
    betToken,
    betTokenBalance,
    getBetTokenBalance,
    getList,
    room,
    setRoom,
    getRoomInfo,
    onRoomLoading,
    onChange2List,
    onChange2UserLatest,
  } = props ?? {};

  const { accountWithAk, account, chainId, provider } = useCustomAccount();
  const { onConnect, onSwitchChain } = useConnectWallet();
  const toast = useToast();

  const [betMove, setBetMove] = useState<EMove[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [moveSelectorOpen, setMoveSelectorOpen] = useState<boolean>(false);
  const [resultPending, setResultPending] = useState<boolean>(false);
  const [result, setResult] = useState<{ address: string; moves: EMove; }>();

  const [lastMoves] = useMemo(() => {
    return [
      Object.values(Moves).map((it) => ({ ...it })).filter((it) => !room?.players?.some((player: any) => player.moves === it.value)),
    ];
  }, [room]);

  const getResultRef = useRef<any>();

  const { runAsync: onJoinSuccess } = useRequest(async () => {
    // reload list
    setBetMove([]);
    setMoveSelectorOpen(false);

    getBetTokenBalance();
    const newRoomInfo = await getRoomInfo(room);
    setRoom(newRoomInfo);
    onChange2List("join", newRoomInfo);
    onChange2UserLatest("join", newRoomInfo);

    const handleResult = (_newRoomInfo: any) => {
      if (_newRoomInfo.winner_address) {
        clearInterval(getResultRef.current);

        setResult({
          address: _newRoomInfo.winner_address,
          moves: _newRoomInfo.winner_moves,
        });
      }
    };

    // check is Won
    if (newRoomInfo.contractData?.status === ContractStatus.Pending) {
      setResultPending(true);
      // run loop per 5s
      getResultRef.current = setInterval(() => {
        getRoomInfo(room).then((_newRoomInfo: any) => {
          setRoom(_newRoomInfo);
          handleResult(_newRoomInfo);
          onChange2List("join", _newRoomInfo);
          onChange2UserLatest("join", _newRoomInfo);
        });
      }, 5000);
      return;
    }
    handleResult(newRoomInfo);
  }, {
    manual: true,
    debounceWait: 1000,
  });

  const { runAsync: onJoinCheck, loading: checking } = useRequest(async (_room: Room, options?: { isReset?: boolean; }) => {
    const { isReset } = options ?? {};

    if (isReset) {
      setRoom(void 0);
    }
    onRoomLoading(_room.room_id, true);

    if (!account) {
      onConnect();
      onRoomLoading(_room.room_id, false);
      return;
    }
    if (chainId !== DEFAULT_CHAIN_ID) {
      onSwitchChain({ chainId: DEFAULT_CHAIN_ID });
      onRoomLoading(_room.room_id, false);
      return;
    }

    // check your own game
    if (account.toLowerCase() === _room.address.toLowerCase() && _room.players.length > 1 && _room.players.every((player) => player.address.toLowerCase() === account.toLowerCase())) {
      toast.fail({
        title: "Join failed",
        text: "You can't join your own game",
      });
      onRoomLoading(_room.room_id, false);
      return;
    }

    // check room status
    if (_room.players.length >= 3 || _room.status !== Status.Ongoing) {
      toast.fail({
        title: "Join failed",
        text: "This room has ended, please refresh the list and try again.",
      });
      onRoomLoading(_room.room_id, false);
      getList();
      return;
    }

    // check your balance
    const betBalance = await getBetTokenBalance?.();
    if (Big(betBalance || 0).lt(Big(_room.bet_amount || 0))) {
      toast.fail({
        title: "Join failed",
        text: "Insufficient balance",
      });
      onRoomLoading(_room.room_id, false);
      return;
    }

    // check room status
    const newRoomInfo = await getRoomInfo(_room);

    if (newRoomInfo.players.length >= 3 || newRoomInfo.contractData?.status !== ContractStatus.Ongoing) {
      toast.fail({
        title: "Join failed",
        text: "This room has ended, please refresh the list and try again.",
      });
      onRoomLoading(_room.room_id, false);
      getList();
      return;
    }

    if (account.toLowerCase() === newRoomInfo.address.toLowerCase() && newRoomInfo.players.length > 1 && newRoomInfo.players.every((player: any) => player.address.toLowerCase() === account.toLowerCase())) {
      toast.fail({
        title: "Join failed",
        text: "You can't join your own game",
      });
      onRoomLoading(_room.room_id, false);
      return;
    }

    // room is ongoing
    onRoomLoading(_room.room_id, false);
    setRoom(newRoomInfo);
    return newRoomInfo;
  }, { manual: true });

  const { runAsync: onJoin, loading: joining } = useRequest(async () => {
    const _roomInfo = await onJoinCheck(room);
    if (!_roomInfo) {
      return;
    }

    let toastId = toast.loading({
      title: "Confirming...",
    });

    const signer = provider.getSigner(account);
    const isDouble = betMove.length > 1;
    const parsedAmount = utils.parseUnits(Big(room?.bet_amount || "0").times(isDouble ? 2 : 1).toFixed(betToken.decimals), betToken.decimals);
    const buffer = crypto.getRandomValues(new Uint8Array(32));
    const hexString = Array.from(buffer)
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
    const userRandomNumber = "0x" + hexString;
    const options: any = {
      value: parsedAmount,
    };
    const contract = new Contract(RPS_CONTRACT_ADDRESS, RPS_CONTRACT_ADDRESS_ABI, signer);

    let params = [
      room?.room_id,
      betMove[0],
      userRandomNumber
    ];
    if (isDouble) {
      params = [
        room?.room_id,
        betMove[0],
        betMove[1],
        userRandomNumber
      ];
    }

    let method = "joinRoom";
    if (isDouble) {
      method = "joinRoomDouble";
    }

    try {
      const estimatedGas = await contract.estimateGas[method](...params, options);
      options.gasLimit = Math.floor(Number(estimatedGas) * 1.2);
    } catch (err) {
      options.gasLimit = 10000000;
      console.log("estimate gas failed: %o", err);
    }

    try {
      const tx = await contract[method](...params, options);

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Confirming...", chainId, tx: tx.hash });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);

      if (status !== 1) {
        toast.fail({
          title: "Join failed",
          tx: transactionHash,
          chainId,
        });
        return;
      }

      toast.success({
        title: "Join successful",
        text: "Please wait for the game is confirming...",
        tx: transactionHash,
        chainId,
      });

      onJoinSuccess();
    } catch (error: any) {
      console.log("Join room failed: %o", error);
      toast.dismiss(toastId);
      toast.fail({
        title: "Join failed",
        text: error?.message?.includes("user rejected transaction") ? "User rejected transaction" : "",
      });
    }
  }, {
    manual: true,
  });

  const onOpen = async (_room: Room) => {
    const _roomInfo = await onJoinCheck(_room, { isReset: true });
    if (!_roomInfo) {
      return;
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setRoom(void 0);
    setBetMove([]);
    setResultPending(false);
    setResult(void 0);
    getBetTokenBalance();

    clearInterval(getResultRef.current);
  };

  const onSelectMove = (move: EMove, index: number) => {
    const _moves = betMove.slice();
    if (_moves.includes(move)) {
      _moves.splice(_moves.indexOf(move), 1);
    } else {
      // join yourself room
      // can select one only
      if (account.toLowerCase() === room?.address?.toLowerCase()) {
        _moves.splice(0, 1);
      }
      _moves.push(move);
    }
    setBetMove(_moves);
  };

  const buttonValid = useMemo(() => {
    const _result = { disabled: true, text: "confirm", loading: false };
    if (!account) {
      _result.text = "Connect Wallet";
      _result.disabled = false;
      return _result;
    }
    if (chainId !== DEFAULT_CHAIN_ID) {
      _result.text = "Switch Network";
      _result.disabled = false;
      return _result;
    }
    if (joining) {
      _result.loading = true;
    }
    if (Big(room?.bet_amount || 0).gt(Big(betTokenBalance || 0))) {
      _result.text = "Insufficient balance";
      return _result;
    }
    if (betMove.length < 1 && lastMoves?.length > 1) {
      _result.text = "Select your Guess";
      return _result;
    }
    _result.disabled = false;
    return _result;
  }, [room, lastMoves, betMove, joining, account, chainId, betTokenBalance]);

  useEffect(() => {
    return () => {
      clearInterval(getResultRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      clearInterval(getResultRef.current);
    }
  }, [open]);

  return {
    onJoin,
    joining,
    betMove,
    open,
    onClose,
    onSelectMove,
    buttonValid,
    onOpen,
    onJoinCheck,
    checking,
    resultPending,
    setResultPending,
    result,
    setResult,
    lastMoves,
    moveSelectorOpen,
    setMoveSelectorOpen,
  };
};
