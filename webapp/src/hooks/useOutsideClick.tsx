//ref: https://github.com/kaderbrl/custom-dropdown-component/blob/main/src/hooks/useOutsideClick.tsx
import { useEffect } from "react";

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
};

export default useOutsideClick;
