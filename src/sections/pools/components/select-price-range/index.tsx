import { memo, useState } from 'react';
import Input from './Input';
import {
  StyledContainer,
  StyledHeaderAction,
  StyledHeaderActions
} from './styles';
import Big from 'big.js';

const SelectPriceRange = ({
  lowerPrice,
  upperPrice,
  currentPrice,
  token0,
  token1,
  reverse,
  rangeType,
  onExchangeTokens,
  onPointChange,
  onPriceChange,
  onSetPriceByTick
}: any) => {
  const [percent, setPercent] = useState(0.2);
  return (
    <StyledContainer>
      <StyledHeaderActions>
        {[
          { label: '10%', value: 0.1 },
          { label: '20%', value: 0.2 },
          { label: '50%', value: 0.5 },
          { label: 'Full range', value: 1 }
        ].map((item, i) => (
          <StyledHeaderAction
            key={i}
            className={`${
              item.value === percent ? 'bg-[#FFDC50]' : 'bg-transparent'
            }`}
            onClick={() => {
              if (!token0 || !token1) return;
              if (item.value === 1) {
                onPriceChange('lower', '0');
                onPriceChange('upper', '∞');
              } else {
                onSetPriceByTick(item.value);
              }
              setPercent(item.value);
            }}
          >
            {item.label}
          </StyledHeaderAction>
        ))}
      </StyledHeaderActions>
      <div className='flex items-center gap-[12px]'>
        <Input
          label='Low price'
          desc={`${token1?.symbol || ''} per ${token0?.symbol || ''}`}
          value={lowerPrice}
          setValue={(_price: any) => {
            onPriceChange('lower', _price);
          }}
          onButtonClick={(type: 'add' | 'minus') => {
            onPointChange(type, 'lower', lowerPrice);
          }}
          disabled={!token0 || !token1}
          rangeType={rangeType}
        />
        <Input
          label='High price'
          desc={`${token1?.symbol || ''} per ${token0?.symbol || ''}`}
          value={upperPrice}
          setValue={(_price: any) => {
            onPriceChange('upper', _price);
          }}
          onButtonClick={(type: 'add' | 'minus') => {
            onPointChange(type, 'upper', upperPrice);
          }}
          disabled={!token0 || !token1}
          rangeType={rangeType}
        />
      </div>
    </StyledContainer>
  );
};

export default memo(SelectPriceRange);
