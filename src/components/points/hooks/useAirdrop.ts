import useAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const contractAddress = '0x1f0FB412e665066C48C01b7BB2549a6E3D527B9d';

const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "FailedCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "CanClaim",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "HasClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Received",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_claimPeriodStart",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_claimPeriodEnd",
                "type": "uint256"
            }
        ],
        "name": "setClaimPeriod",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_recipients",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_claimableAmount",
                "type": "uint256[]"
            }
        ],
        "name": "setRecipients",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdrawal",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "claimableTokens",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimPeriodEnd",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimPeriodStart",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalClaimable",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
export const useAirdrop = () => {
    const { account, provider } = useAccount();
    const [timeLeft, setTimeLeft] = useState(0)
    const [claimableTokens, setClaimableTokens] = useState('0')
    const [totalClaimable, setTotalClaimable] = useState('0')
    const [isStarted, setIsStarted] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const { success, fail } = useToast();
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        (async () => {
            if (!account || !provider) return;
            const now = Date.now() / 1000;
            const contract = new ethers.Contract(contractAddress, ABI as any, provider);
            const startTime = await contract.claimPeriodStart();
            const endTime = await contract.claimPeriodEnd();

            if (now >= startTime.toNumber()) {
                setIsStarted(true);
            }

            if (now > endTime.toNumber()) {
                setIsEnded(true);
            } else {
                setTimeLeft(endTime.toNumber() - now);
            }
            
            const claimableTokens = await contract.claimableTokens(account);

            setClaimableTokens((claimableTokens.toString()));
            const totalClaimable = await contract.totalClaimable();
            setTotalClaimable((totalClaimable.toString()));

        })()
    }, [account, provider]);


    const [formattedTimeLeft, setFormattedTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
    });

    useEffect(() => {
        if (timeLeft <= 0) {
            setFormattedTimeLeft({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                total: 0
            });
            return;
        }

        const calcFormat = (secondsLeft: number) => {
            const totalSeconds = Math.max(Math.floor(secondsLeft), 0);
            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            return { days, hours, minutes, seconds, total: secondsLeft };
        };

        setFormattedTimeLeft(calcFormat(timeLeft));

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    clearInterval(interval);
                    setFormattedTimeLeft({
                        days: 0,
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                        total: 0
                    });
                    return 0;
                }
                setFormattedTimeLeft(calcFormat(newValue));
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const claim = async () => {
        if (!account || !provider) return;
        if (Number(claimableTokens) <= 0 || Number(totalClaimable) <= 0) {
            fail({
                title: 'No claimable tokens!',
            });
            return;
        };

        try {
            setClaiming(true);
            const contract = new ethers.Contract(contractAddress, ABI as any, provider.getSigner());
            const tx = await contract.claim();
            const { status, transactionHash } = await tx.wait();

            if (status === 1) {
                success({
                    title: 'Claim successful!',
                    tx: transactionHash
                });
            } else {
                fail({
                    title: 'Claim failed!',
                });

            }

        } catch (error) {
            fail({
                title: 'Claim failed!',
            });
        } finally {
            setClaiming(false);
        }

    }

    return {
        timeLeft,
        claimableTokens,
        totalClaimable,
        formattedTimeLeft,
        claim,
        claiming,
        isStarted,
        isEnded,
    }

}