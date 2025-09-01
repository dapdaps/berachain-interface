import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from 'react';

const InputNumber = (props: Props) => {
  const { onChange, onNumberChange, integerOnly = false } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let temp = e.target.value;
    if (temp) {
      if (integerOnly) {
        temp = temp.replace(/[^\d]/g, '');
      }
      else {
        temp = temp.replace(/[^\d.]/g, '');

        if (temp && temp.length && temp.indexOf('.') !== temp.lastIndexOf('.')) {
          const arr = temp.split('.');
          let first = arr.shift();
          temp = first + '.' + arr.join('');
        }
      }

      while (/^0[0-9]/.test(temp)) {
        temp = temp.substring(1);
      }

      if (temp === '.') temp = '';
    }
    e.target.value = temp;
    onChange?.(e);
    onNumberChange?.(temp);
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      onChange={handleChange}
    />
  );
};

export default InputNumber;

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onNumberChange?(value: string): void;
  integerOnly?: boolean;
}
