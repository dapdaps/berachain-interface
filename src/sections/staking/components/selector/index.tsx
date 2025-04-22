import { useState } from 'react';

interface Option {
  id: string;
  label: string;
}

interface BtcSelectorProps {
  onSelect?: (id: 'uniBTC' | 'brBTC') => void;
  selected?: 'uniBTC' | 'brBTC';
}

export default function BtcSelector({ onSelect, selected = 'uniBTC' }: BtcSelectorProps) {
  const options: Option[] = [
    { id: 'uniBTC', label: 'uniBTC' },
    { id: 'brBTC', label: 'brBTC' }
  ];
  
  const [selectedOption, setSelectedOption] = useState<string>(selected);
  
  const handleSelect = (id: string) => {
    setSelectedOption(id);
    onSelect?.(id as 'uniBTC' | 'brBTC');
  };
  
  return (
    <div className="flex items-center space-x-2">
      {options.map((option) => (
        <button
          key={option.id}
          className={`py-1 px-4 rounded-full text-base leading-[1] font-[700] font-Montserrat transition-colors ${
            selectedOption === option.id
              ? 'bg-[#FFDC50] text-black border border-black'
              : 'border border-black'
          }`}
          onClick={() => handleSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}