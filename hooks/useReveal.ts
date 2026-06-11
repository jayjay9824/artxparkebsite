import { useEffect } from "react";

/**
 * Ports the concept's `.rv` scroll-reveal: observe every `.rv` element in the
 * document, add `.in` once it intersects (then unobserve), and stagger the
 * transition by (index % 4) * 60ms in document order.
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    els.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}
