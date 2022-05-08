import { useEffect, useRef, useState } from "react";

export type WindowSize = { width: number; height: number };

export function useWindowSize(fn?: (size: WindowSize) => void, deps?: any[]) {
  const _fn = useRef(fn);
  _fn.current = fn;

  const [size, setSize] = useState<WindowSize>();

  useEffect(() => {
    const onResize = () => {
      const size = { width: window.innerWidth, height: window.innerHeight };
      setSize(size);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setSize]);

  useEffect(() => {
    if (size) {
      _fn.current?.(size);
    }
  }, deps ?? [size]);

  return size;
}
