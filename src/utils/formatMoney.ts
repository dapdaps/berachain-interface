import Big from 'big.js';

export const formatDisplayNumber = (
  value: number | string,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    threshold?: number;
    prefix?: string;
    suffix?: string;
  } = {}
) => {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    threshold = 0.01,
    prefix = '',
    suffix = ''
  } = options;

  if (value === undefined || value === null || value === '') return '-';

  const bigValue = new Big(value);

  if (bigValue.eq(0)) return '-';

  if (bigValue.lt(threshold)) {
    return `${prefix}<${threshold}${suffix}`;
  }

  return `${prefix}${bigValue.toFixed(maximumFractionDigits)}${suffix}`;
};


export const formatDisplayCurrency = (
  value: number | string,
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    threshold?: number;
  } = {}
) => {
  const {
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    threshold = 0.01
  } = options;

  if (!value) return '-'
  
  return formatDisplayNumber(value, {
    minimumFractionDigits,
    maximumFractionDigits,
    threshold,
    prefix: currency === 'USD' ? '$' : '',
    suffix: currency !== 'USD' ? ` ${currency}` : ''
  });
};

export function bigMin(_a: any, _b: any) {
  const a = Big(_a || 0);
  const b = Big(_b || 0);
  return a.gt(b) ? b : a;
}

export function getPrice(prices: Record<string, string>, symbol: string) {
  let price = "1";
  if (prices[symbol]) {
    price = prices[symbol];
    if (price !== "0") {
      return price;
    }
  }
  if (prices[symbol.toLowerCase()]) {
    price = prices[symbol.toLowerCase()];
    if (price !== "0") {
      return price;
    }
  }
  if (prices[symbol.toUpperCase()]) {
    price = prices[symbol.toUpperCase()];
    if (price !== "0") {
      return price;
    }
  }
  return "1";
}
