import React, { FC } from 'react';

interface DecimalInputProps {
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?(value: string): void;
  onClick?(e: any): void;
  onBlur?(e: any): void;
};

const DecimalInput: FC<DecimalInputProps> = (props) => {
  const { className, value, defaultValue, onChange, onClick, onBlur } = props;

  const decimalMask = (str: string, options = { isBackspace: false }) => {
    const { isBackspace } = options;
    let chars = str.split('');

    if (isBackspace) {
      const temp = chars[chars.length - 3];
      chars[chars.length - 3] = chars[chars.length - 2];
      chars[chars.length - 2] = temp;

      if (chars[0] === ',') {
        chars = ['0', ...chars];
      }

      return chars.join('');
    }

    if (chars.length >= 5) {
      const temp = chars[chars.length - 4];
      chars[chars.length - 4] = chars[chars.length - 3];
      chars[chars.length - 3] = temp;

      if (chars[0] === '0') {
        chars.splice(0, 1);
      }
    } else {
      chars = ['0', ',', '0', ...chars];
    }

    return chars.join('');
  };

  const handleChange = (e: any) => {
    let value = e.target.value;

    if (e.nativeEvent.data) {
      value = decimalMask(value);
    } else {
      value = decimalMask(value, { isBackspace: true });
    }

    e.target.value = value;
    if (onChange) onChange(value);
  };

  return (
    <input
      className={className}
      inputMode="numeric"
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      onClick={onClick}
      onBlur={onBlur}
    />
  );
};

export default DecimalInput;