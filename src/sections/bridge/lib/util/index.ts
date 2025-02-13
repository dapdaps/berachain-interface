import { providers } from 'ethers';
import chainConfig from './chainConfig'

export const S3_BASE = 'https://s3.amazonaws.com/dapdap.prod/images'
export const DAP_BASE = ''

export function uuid(): string {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1);
}

const BRIDGE_ICONS: {
  [key: string]: string
} = {
  'stargate': 'https://s3.amazonaws.com/dapdap.prod/images/stargate.png',
}

const BRIDGE_NAME: {
  [key: string]: string
} = {
  'stargate': 'Stargate',
}

const BRIDGE_COLOR: {
  [key: string]: string
} = {
  'stargate': '#EFEFEF',
}

export function getIcon(type: string): string {
  return `${BRIDGE_ICONS[type]}`
}

export function getName(type: string): string {
  return BRIDGE_NAME[type]
}

export function getColor(type: string): string {
  return BRIDGE_COLOR[type]
}

export function getChainScan(chainId: number | string): string {
  return chainConfig[Number(chainId)].blockExplorers
}

export function getBridgeMsg(type: string) {
  return {
    icon: getIcon(type),
    name: getName(type),
    color: getColor(type),
  }
}

export function getAllToken() {
  return fetch(`${DAP_BASE}/api/token`).then(res => res.json()).then(res => res.tokens)
}

export function getChainSigner(chainId: number) {
  const chain = chainConfig[chainId]
  if (chainConfig[chainId]) {
    const rpc = chain.rpcUrls[0]
    const provider = new providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
    return provider.getSigner()
  }

  return null
}


export function getFullNum(value: any) {
  try {
    let x = value
    if (Math.abs(x) < 1.0) {
      const e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      let e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += (new Array(e + 1)).join('0');
      }
    }
    return x;
  } catch (e) {

  }

  return value
}


export function sleep(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

const duration = 1000 * 60 * 5 //5 minutes
export async function checkTransitionOnlineStatus(hash: string, chainId: string, time: number) {
  const chainFrom = chainConfig[chainId as any]
  const rpc = chainFrom.rpcUrls[0]
  const { JsonRpcProvider } = providers
  const provider = new JsonRpcProvider(rpc);
  const transition = await provider.getTransactionReceipt(hash)
  if (transition) {
    if (transition.status === 1) {
      return true
    } else if (transition.status === 0) {
      return false
    }
  } else {
    if (Date.now() - time > duration) {
      return false
    }
  }

  return null
}

