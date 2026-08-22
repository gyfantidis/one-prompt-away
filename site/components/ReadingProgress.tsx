"use client";

import { useEffect, useState } from "react";

/**
 * Λεπτή μπάρα προόδου ανάγνωσης, ακριβώς κάτω από το nav.
 * Καθαρά διακοσμητική — κρύβεται από τους screen readers.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      // rAF ώστε να μη γίνεται layout read σε κάθε scroll event
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrollable = el.scrollHeight - el.clientHeight;
        setProgress(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0);
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-16 z-40 h-0.5 w-full bg-brand-border/30"
    >
      <div
        className="h-full bg-brand-teal"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
