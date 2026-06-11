"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // solid background once scrolled past 40px
  useEffect(() => {
    const onScroll = () =>
      navRef.current?.classList.toggle("solid", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // body.menu-open drives the mobile menu visibility in CSS
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <nav id="nav" ref={navRef}>
        <div className="nav-inner">
          <a className="brand" href="#hero" aria-label="ArtXpark">
            <Image
              className="brand-img"
              src="/images/renewal/wordmark-white.png"
              alt="ArtXpark"
              width={1223}
              height={301}
              priority
            />
          </a>
          <div className="nav-links">
            <a href="#thesis">Thesis</a>
            <a href="#gallery-system">Gallery System</a>
            <a href="#axvela-ai">AXVELA AI</a>
            <a href="#scan">SCAN</a>
            <a href="#view">VIEW</a>
            <a href="#museum">Museum</a>
            <a href="#passport">Passport</a>
            <a href="#ecosystem">Ecosystem</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <button
            className="menu-btn"
            id="menuBtn"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </nav>

      <div className="mobile-menu" id="mobileMenu">
        <a href="#thesis" onClick={() => setOpen(false)}>
          <span className="n">01</span>Thesis
        </a>
        <a href="#gallery-system" onClick={() => setOpen(false)}>
          <span className="n">02</span>Gallery System
        </a>
        <a href="#axvela-ai" onClick={() => setOpen(false)}>
          <span className="n">03</span>AXVELA AI
        </a>
        <a href="#scan" onClick={() => setOpen(false)}>
          <span className="n">04</span>AXVELA SCAN
        </a>
        <a href="#view" onClick={() => setOpen(false)}>
          <span className="n">05</span>AXVELA VIEW
        </a>
        <a href="#museum" onClick={() => setOpen(false)}>
          <span className="n">06</span>AXVELA MUSEUM
        </a>
        <a href="#passport" onClick={() => setOpen(false)}>
          <span className="n">07</span>Passport
        </a>
        <a href="#ecosystem" onClick={() => setOpen(false)}>
          <span className="n">08</span>Ecosystem
        </a>
        <a href="#about" onClick={() => setOpen(false)}>
          <span className="n">09</span>About
        </a>
        <a href="#contact" onClick={() => setOpen(false)}>
          <span className="n">10</span>Contact
        </a>
      </div>
    </>
  );
}
