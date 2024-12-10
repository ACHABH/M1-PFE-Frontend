import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

export function useWindowSize(sizes: number[]) {
  const [size, setSize] = useState(sizes[0]);
  const deferredSize = useDeferredValue(size);
  const descSizes = useMemo(() => sizes.slice().reverse(), [sizes]);

  const resizeCallback = useCallback(() => {
    startTransition(() => {
      const newSize = descSizes.find((s) => s <= window.innerWidth);
      if (typeof newSize === "number") {
        setSize(newSize);
      }
    });
  }, [descSizes]);

  useEffect(() => {
    window.addEventListener("resize", resizeCallback);
    return () => window.removeEventListener("resize", resizeCallback);
  }, [resizeCallback]);

  return deferredSize;
}
