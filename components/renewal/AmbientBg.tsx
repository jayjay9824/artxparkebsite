"use client";

import { useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";

/** Fixed ambient layer: scroll-progress bar, drifting blobs, and grid.
 *  Also boots the global `.rv` reveal observer since it is always mounted. */
export default function AmbientBg() {
  useReveal();

  useEffect(() => {
    const prog = document.getElementById("progress");
    const onScroll = () => {
      const d = document.documentElement;
      const p = d.scrollTop / (d.scrollHeight - d.clientHeight);
      if (prog) prog.style.width = (p * 100).toFixed(2) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div id="progress" aria-hidden="true" />
      <div className="bg-ambient" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <div className="bg-grid" aria-hidden="true" />
    </>
  );
}
