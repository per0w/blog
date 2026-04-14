import type { MutableRefObject } from "react";

import type { OrbMood } from "@/components/ai-buddy/orb-avatar";

type ThinkingPipelineRefs = {
  displayTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  orboSectionPipelineRef: MutableRefObject<boolean>;
  orboSuppressAmbientUntilRef: MutableRefObject<number>;
};

type ThinkingPipelineUi = {
  setIsThinking: (v: boolean) => void;
  setOrbMood: (m: OrbMood) => void;
  setComment: (v: string | null) => void;
  setTooltipVisible: (v: boolean) => void;
  setSpeaking: (v: boolean) => void;
};

/**
 * Общий каркас: блокируем ambient, показываем «думаю», выполняем work (возвращает, был ли показ),
 * в finally снимаем блокировку и откатываем UI при неудаче.
 */
export async function runOrboThinkingShowPipeline(
  refs: ThinkingPipelineRefs,
  ui: ThinkingPipelineUi,
  work: () => Promise<boolean>,
): Promise<boolean> {
  if (refs.displayTimerRef.current) clearTimeout(refs.displayTimerRef.current);
  refs.orboSectionPipelineRef.current = true;
  ui.setComment(null);
  ui.setIsThinking(true);
  ui.setOrbMood("thinking");
  ui.setTooltipVisible(true);
  ui.setSpeaking(true);

  let didShow = false;
  try {
    didShow = await work();
    return didShow;
  } finally {
    refs.orboSectionPipelineRef.current = false;
    refs.orboSuppressAmbientUntilRef.current = Date.now() + 2200;
    if (!didShow) {
      ui.setIsThinking(false);
      ui.setTooltipVisible(false);
      ui.setSpeaking(false);
      ui.setOrbMood("neutral");
    }
  }
}
