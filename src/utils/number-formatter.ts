import Big from 'big.js';

export const addThousandSeparator = (numberString: string) => {
  const parts = numberString.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts[1] ? `.${parts[1]}` : '';
  return integerPart + decimalPart;
}

export const numberFormatter = (
  value: string | number | Big.Big | undefined,
  precision: number,
  isSimple?: boolean,
  options?: {
    // resolve the issue of displaying values like $< 0.01
    // it should display as < $0.01
    prefix?: string;
    // when it is less than a certain value
    // 0 should be displayed in the integer part
    // not in the decimal part
    isLTIntegerZero?: boolean;
    // should zeros be added at the end
    isZeroPrecision?: boolean;
    isShort?: boolean;
    round?: Big.RoundingMode;
  }
): any => {
  const {
    prefix = '',
    isLTIntegerZero,
    isZeroPrecision,
    isShort
  } = options || {};

  const isValid = () => {
    try {
      if (!value) return false;
      Big(value);
      return true;
    } catch (err: any) {
      return false;
    }
  };

  if (!value || !isValid() || Big(value).eq(0)) {
    if (isSimple) {
      if (isZeroPrecision) {
        return `${prefix}${Big(0).toFixed(precision)}`;
      }
      return `${prefix}0`;
    }
    if (isZeroPrecision) {
      return {
        integer: `${prefix}0`,
        decimal: Big(0).toFixed(precision).replace(/^\d/, '')
      };
    }
    return {
      integer: `${prefix}0`,
      decimal: ''
    };
  }

  if (Big(value).lt(Big(10).pow(-precision))) {
    if (isSimple) {
      return `< ${prefix}${Big(10).pow(-precision).toFixed(precision)}`;
    }
    if (isLTIntegerZero) {
      return {
        integer: `< ${prefix}0`,
        decimal: Big(10).pow(-precision).toFixed(precision).replace(/^\d/, '')
      };
    }
    return {
      integer: '',
      decimal: `< ${prefix}${Big(10).pow(-precision).toFixed(precision)}`
    };
  }

  const finalValue = addThousandSeparator(Big(value).toFixed(precision));
  const firstPart = finalValue.split('.')[0];
  let secondPart = finalValue.split('.')[1] || '';
  if (secondPart) {
    secondPart = '.' + secondPart;
  }
  if (isSimple) {
    if (isShort) {
      const formatter = (split: number, unit: string): string => {
        const _num = Big(value)
          .div(split)
          .toFixed(precision, 0)
          .replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
        const inter = _num.split('.')?.[0]?.replace(/\d(?=(\d{3})+\b)/g, '$&,');
        const decimal = _num.split('.')?.[1] ?? '';
        return `${prefix}${inter}${decimal ? '.' + decimal : ''}${unit}`;
      };
      if (Big(value).gte(1e9)) {
        return formatter(1e9, 'b');
      }
      if (Big(value).gte(1e6)) {
        return formatter(1e6, 'm');
      }
      if (Big(value).gte(1e3)) {
        return formatter(1e3, 'k');
      }
    }
    if (isZeroPrecision) {
      return `${prefix}${firstPart}${secondPart}`;
    }
    return `${prefix}${firstPart}${secondPart.replace(/[.]?0*$/, '')}`;
  }
  if (isZeroPrecision) {
    return {
      integer: `${prefix}${firstPart}`,
      decimal: secondPart
    };
  }
  return {
    integer: `${prefix}${firstPart}`,
    decimal: secondPart.replace(/[.]?0*$/, '')
  };
};

export const numberRemoveEndZero = (value: string) => {
  return value.replace(/\.?0+$/, '');
};
