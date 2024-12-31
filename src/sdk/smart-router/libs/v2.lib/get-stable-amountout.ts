function _k({ x, y }: any) {
  const _a = (x * y) / 1e18;
  const _b = (x * x) / 1e18 + (y * y) / 1e18;
  return (_a * _b) / 1e18; // x3y+y3x >= k
}
function _f(x0: any, y: any) {
  const _a = (x0 * y) / 1e18;
  const _b = (x0 * x0) / 1e18 + (y * y) / 1e18;
  return (_a * _b) / 1e18;
}

function _d(x0: any, y: any) {
  return (3 * x0 * ((y * y) / 1e18)) / 1e18 + (((x0 * x0) / 1e18) * x0) / 1e18;
}

function _get_y({ x0, xy, y }: any) {
  for (let i = 0; i < 255; i++) {
    const y_prev = y;
    const k = _f(x0, y);

    if (k < xy) {
      const dy = ((xy - k) * 1e18) / _d(x0, y);
      y = y + dy;
    } else {
      const dy = ((k - xy) * 1e18) / _d(x0, y);
      y = y - dy;
    }
    if (y > y_prev) {
      if (y - y_prev <= 1) {
        return y;
      }
    } else {
      if (y_prev - y <= 1) {
        return y;
      }
    }
  }
  return y;
}

export default function getStableAmountOut({ pair, inputAmount }: any) {
  const [decimals0, decimals1] = pair.isReserved
    ? [pair.tokenB.decimals, pair.tokenA.decimals]
    : [pair.tokenA.decimals, pair.tokenB.decimals];

  const _decimals0 = 10 ** decimals0;
  const _decimals1 = 10 ** decimals1;

  const _reserve0 = (pair.reserve0 * 1e18) / _decimals0;
  const _reserve1 = (pair.reserve1 * 1e18) / _decimals1;

  const xy = _k({ x: _reserve0, y: _reserve1 });

  const [reserveA, reserveB] = !pair.isReserved ? [_reserve0, _reserve1] : [_reserve1, _reserve0];
  const _inputAmount = !pair.isReserved ? (inputAmount * 1e18) / _decimals0 : (inputAmount * 1e18) / _decimals1;
  const y = reserveB - _get_y({ x0: _inputAmount + reserveA, xy, y: reserveB });
  return (y * (!pair.isReserved ? _decimals1 : _decimals0)) / 1e18;
}
