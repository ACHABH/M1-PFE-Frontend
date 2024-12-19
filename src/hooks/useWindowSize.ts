import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

export function useWindowSize(sizes: number[]) {
  const reversedSize = useMemo(() => sizes.reverse(), [sizes]);
  const [size, setSize] = useState(sizes[0]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isPending, startTransition] = useTransition();
  const deferredSize = useDeferredValue(size);

  const resizeCallback = useCallback(() => {
    startTransition(() => {
      const newSize = reversedSize.find((s) => s <= window.innerWidth);
      if (typeof newSize === "number") {
        setSize(newSize);
      }
    });
  }, [reversedSize]);

  useEffect(() => {
    window.addEventListener("resize", resizeCallback);
    return () => window.removeEventListener("resize", resizeCallback);
  }, [resizeCallback]);

  return deferredSize;
}
