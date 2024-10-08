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
  if (!value) return '-'
  const bigValue = new Big(value);

  if (bigValue.lt(threshold)) {
    return `${prefix}<${threshold}${suffix}`;
  }

  return `${prefix}${bigValue.toFixed(maximumFractionDigits, 1)}${suffix}`;
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