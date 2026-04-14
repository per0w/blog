import { useEffect, useState } from "react";

/** Подмигивание кнопки «вернуть Орбо», когда виджет свернут. */
export function useOrboPeek(dismissed: boolean) {
  const [peekDismissed, setPeekDismissed] = useState(false);

  useEffect(() => {
    if (!dismissed) return;
    const id = window.setInterval(() => {
      setPeekDismissed(true);
      window.setTimeout(() => setPeekDismissed(false), 700);
    }, 22_000);
    return () => clearInterval(id);
  }, [dismissed]);

  return peekDismissed;
}
