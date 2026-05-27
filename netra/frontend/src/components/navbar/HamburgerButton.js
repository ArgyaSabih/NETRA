"use client";

import {cn} from "@/src/utils/helper/cn";

export default function HamburgerButton({isOpen, setIsOpen}) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="relative flex min-h-10 min-w-10 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl p-2 sm:hidden"
      aria-label="Toggle menu"
    >
      <span
        className={cn(
          "h-0.5 w-5 bg-neutral-950 transition-[opacity,transform] duration-300",
          isOpen ? "absolute top-0 right-0 bottom-0 left-0 m-auto opacity-0" : "relative opacity-100"
        )}
      />
      <span
        className={cn(
          "h-0.5 w-5 bg-neutral-950 transition-transform duration-300",
          isOpen ? "absolute top-0 right-0 bottom-0 left-0 m-auto rotate-135" : "relative"
        )}
      />
      <span
        className={cn(
          "absolute h-0.5 w-5 bg-neutral-950 transition-[opacity,transform] duration-500",
          isOpen ? "top-0 right-0 bottom-0 left-0 m-auto rotate-45 opacity-100" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "h-0.5 w-5 bg-neutral-950 transition-[opacity,transform] duration-300",
          isOpen ? "absolute opacity-0" : "relative opacity-100"
        )}
      />
    </button>
  );
}
