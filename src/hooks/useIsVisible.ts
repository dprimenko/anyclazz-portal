import { useEffect, useState } from "react";
import type { RefObject } from "react";

export function useIsVisible(ref: RefObject<HTMLElement | null>) {
    const [isIntersecting, setIntersecting] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      );
  
      observer.observe(ref.current!);
      return () => {
        observer.disconnect();
      };
    }, [ref]);
  
    return isIntersecting;
  }