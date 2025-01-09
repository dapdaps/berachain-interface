import weth from '../config/weth';

export function nativeToWNative(token: any) {
  if (token.isNative && token.chainId !== 1088) {
    return { ...token, address: weth[token.chainId] };
  }
  return token;
}
