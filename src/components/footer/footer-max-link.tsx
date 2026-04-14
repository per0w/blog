"use client";

import { MAX_MESSENGER_PROFILE_URL, ORBO_MAX_HOVER_EVENT } from "@/constants/common";
import { MaxMessengerIcon } from "@/ui/icons";

export function FooterMaxLink() {
  const notifyOrbo = () => {
    window.dispatchEvent(new CustomEvent(ORBO_MAX_HOVER_EVENT));
  };

  return (
    <a
      aria-label="MAX"
      className="focus-ring-accent rounded-md text-muted transition-colors hover:text-foreground"
      data-orbo-max=""
      href={MAX_MESSENGER_PROFILE_URL}
      rel="noopener noreferrer"
      target="_blank"
      onFocus={notifyOrbo}
      onMouseEnter={notifyOrbo}
    >
      <MaxMessengerIcon className="size-5" />
    </a>
  );
}
