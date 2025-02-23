import { numberFormatter } from '@/utils/number-formatter';
import LazyImage from '@/components/layz-image';
import { upperFirst } from 'lodash';

export const DefaultIcon = '/assets/tokens/default_icon.png';

export const getChainLogo = (name: string) => {
  name = name.toLowerCase();
  if (name === 'arbitrum one') {
    name = 'arbitrum';
  }
  if (name) {
    return `https://assets.db3.app/chain/${name}.png`;
  }
  return DefaultIcon;
};

export const getDappLogo = (name: string) => {
  name = name.toLowerCase();
  if (name) {
    return `https://assets.db3.app/dapp/${name}.png`;
  }
  return DefaultIcon;
};

export const getTokenLogo = (name: string) => {
  name = name.toLowerCase();
  if (name) {
    return `https://assets.db3.app/token/${name}.png`;
  }
  return DefaultIcon;
};

export const executionTokenWay = (record: any) => {
  if (!record) {
    return {
      tokenKey: 'tokens_in',
      method: ''
    };
  }
  let method = record.sub_type;

  if (record.type) {
    method += (method && ' ') + record.type;
  }

  if (record.type === 'yield') {
    method = record.method;
  }

  return {
    tokenKey: ['borrow', 'remove', 'repayborrow', 'withdraw'].includes(record.sub_type.toLowerCase()) ? 'tokens_out' : 'tokens_in',
    method
  };
};

export const formatExecution = (record: any, isMobile?: boolean) => {
  if (!record) return '';

  const { tokenKey: key, method } = executionTokenWay(record);

  const formatUsd = (usdValue: any) => {
    const usd = numberFormatter(usdValue, 2, true, { prefix: '$' });
    return `${usd}`;
  };

  let amount: any;
  if (record[key]) {
    amount = (
      <>
        {record[key].map((it: any, idx: number) => (
          <div className="flex gap-[4px]" key={idx}>
            <LazyImage
              className="shrink-0 rounded-full"
              src={getTokenLogo(it.symbol)}
              alt=""
              width={20}
              height={20}
              fallbackSrc={DefaultIcon}
            />
            <span
              className=""
              style={{
                color: key === 'tokens_out' ? '' : '#06C17E'
              }}
            >
              {`${key === 'tokens_out' ? '- ' : '+ '}${numberFormatter(it.amount, 4, true)} ${it.symbol} (${formatUsd(it.usd)})`}
            </span>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-[6px] break-all text-[14px]">
      {
        !isMobile && (
          <span>{upperFirst(method)}</span>
        )
      }
      {amount || '-'}
    </div>
  );
};

export const gasFormatter = (record: any) => {
  if (!record || !record.gas) return '-';
  return `${numberFormatter(record.gas.amount, 4, true)} ${record.gas.symbol}($${numberFormatter(record.gas.usd, 2, true)})`;
};

export function txTimeFormatter(timeStr: number) {
  const date = new Date(timeStr * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
