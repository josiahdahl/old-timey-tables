import { useCallback, useEffect, useRef } from "react";

export const keyDirections = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];
export type ArrowKeyHandler = (direction: string) => void;

export function useArrowKeys(
  handler: ArrowKeyHandler,
  triggerOn: "keyup" | "keydown" = "keydown"
) {
  const handlerRef = useRef<(ev: KeyboardEvent) => void | undefined>();
  const removeEventListener = useCallback(() => {
    if (handlerRef.current) {
      document.removeEventListener(triggerOn, handlerRef.current);
    }
  }, [triggerOn]);
  useEffect(() => {
    function eventFilter(ev: KeyboardEvent) {
      if (keyDirections.includes(ev.key)) {
        handler(ev.key);
      }
    }
    removeEventListener();
    handlerRef.current = eventFilter;
    document.addEventListener(triggerOn, handlerRef.current);
    return () => {
      removeEventListener();
    };
  }, [handler, triggerOn, removeEventListener]);
}
