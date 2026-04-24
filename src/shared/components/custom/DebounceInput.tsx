import { InputHTMLAttributes, useEffect, useState } from "react";

interface DebounceInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounceTimeout?: number;
}

export function DebounceInput({
  value: initialValue,
  onChange,
  debounceTimeout = 500,
  ...props
}: DebounceInputProps) {
  const [value, setValue] = useState(initialValue);

  // Sync internal state with external bound values
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(initialValue);
  }, [initialValue]);

  // Handle the debounce delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounceTimeout);

    return () => clearTimeout(timeout);
  }, [value, debounceTimeout, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
