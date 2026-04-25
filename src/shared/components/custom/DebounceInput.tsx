import { DebounceInputProps } from "@/shared/types/types";
import { useEffect, useState } from "react";

export function DebounceInput({
  value: initialValue,
  onChange,
  debounceTimeout = 500,
  ...props
}: DebounceInputProps) {
  const [value, setValue] = useState(initialValue);

  // sync internal state with external bound values
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
