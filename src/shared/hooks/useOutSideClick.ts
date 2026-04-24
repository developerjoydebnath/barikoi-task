import { useEffect, RefObject } from "react";

export default function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | { current: T | null },
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}