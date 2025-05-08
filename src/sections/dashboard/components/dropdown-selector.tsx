import React, { useState } from 'react';

const options = ['Last 7 days', 'Last month', 'Last 3 months', 'Last 6 months'];

interface DropdownSelectorProps {
  onSelect?: (selected: string) => void;
  defaultValue?: string;
}

export default function DropdownSelector({ onSelect, defaultValue = 'Last 3 months' }: DropdownSelectorProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-between items-center w-40 px-4 py-2 text-sm font-medium text-gray-700"
      >
        {selected}
        <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 1L7.5 7L13.5 1" stroke="black" stroke-width="2"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-40 rounded-md shadow-lg bg-[#FFFDEB] ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selected === option
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {selected === option && <span className="mr-1">✔</span>}
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
