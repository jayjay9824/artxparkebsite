"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

/* ─── useFadeIn ─── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Fade({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      style={{
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase" as const,
        color: light ? "#555" : "var(--muted)",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

/* ════════════════════════════════════════
   NAV
════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links: [string, string][] = [
    ["ARTENA AI", "#artena"],
    ["Ecosystem", "#ecosystem"],
    ["About", "#about"],
    ["Team", "#team"],
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled || menuOpen ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(14px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid var(--border)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={() => setMenuOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/logo.jpg"
            alt="ArtXpark"
            width={68}
            height={68}
            style={{ borderRadius: 11, objectFit: "cover" }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex" style={{ gap: 34, alignItems: "center" }}>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--body)",
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
          aria-label="Toggle menu"
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "var(--fg)",
              transition: "transform 0.2s",
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "var(--fg)",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 1.5,
              background: "var(--fg)",
              transition: "transform 0.2s",
              transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="sm:hidden"
          style={{
            borderTop: "1px solid var(--border)",
            padding: "8px 32px 24px",
          }}
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "14px 0",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--fg)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ════════════════════════════════════════
   1. HERO
════════════════════════════════════════ */
/* module-level so useEffect dep array stays clean */
const DEMO_MSG = "What is this artwork?";

function HeroChatPanel() {
  const [cycleKey, setCycleKey]             = useState(0);
  const [showAttachment, setShowAttachment] = useState(false);
  const [typedText, setTypedText]           = useState("");
  const [showUserMsg, setShowUserMsg]       = useState(false);
  const [showThinking, setShowThinking]     = useState(false);
  const [showResponse, setShowResponse]     = useState(false);
  const [fadeOut, setFadeOut]               = useState(false);

  useEffect(() => {
    setShowAttachment(false);
    setTypedText("");
    setShowUserMsg(false);
    setShowThinking(false);
    setShowResponse(false);
    setFadeOut(false);

    let charIdx = 0;
    let ticker: ReturnType<typeof setInterval> | null = null;
    const ids: ReturnType<typeof setTimeout>[] = [];

    /* ① artwork attachment appears after brief pause */
    ids.push(setTimeout(() => {
      setShowAttachment(true);

      /* ② start typing 700ms after image appears */
      ids.push(setTimeout(() => {
        ticker = setInterval(() => {
          charIdx++;
          setTypedText(DEMO_MSG.slice(0, charIdx));
          if (charIdx >= DEMO_MSG.length) {
            if (ticker) clearInterval(ticker);

            /* ③ pause then send */
            ids.push(setTimeout(() => {
              setShowUserMsg(true);
              setTypedText("");

              /* ④ AI thinking dots */
              ids.push(setTimeout(() => {
                setShowThinking(true);

                /* ⑤ AI response */
                ids.push(setTimeout(() => {
                  setShowThinking(false);
                  setShowResponse(true);

                  /* ⑥ hold → fade → loop */
                  ids.push(setTimeout(() => {
                    setFadeOut(true);
                    ids.push(setTimeout(() => {
                      setCycleKey((k) => k + 1);
                    }, 600));
                  }, 4800));
                }, 1400));
              }, 460));
            }, 520));
          }
        }, 105);
      }, 700));
    }, 300));

    return () => {
      if (ticker) clearInterval(ticker);
      ids.forEach(clearTimeout);
    };
  }, [cycleKey]);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: [
          "0 0 0 1px rgba(0,0,0,0.03)",
          "0 2px 8px rgba(0,0,0,0.04)",
          "0 14px 44px rgba(0,0,0,0.07)",
          "0 40px 100px rgba(0,0,0,0.05)",
        ].join(", "),
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid #f2f2f2",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ width: 9, height: 9, borderRadius: "50%", background: "#e4e4e4" }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0a0a0a",
            letterSpacing: "-0.01em",
            marginLeft: 4,
          }}
        >
          ARTENA AI
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#c8c8c8",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            fontWeight: 500,
          }}
        >
          Cultural Intelligence Assistant
        </span>
      </div>

      {/* ── Chat messages ── */}
      <div
        style={{
          padding: "20px 20px 16px",
          minHeight: 360,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.5s ease",
          position: "relative",
        }}
      >
        {/* Watermark logo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <Image
            src="/images/artena_logo.png"
            alt=""
            width={320}
            height={320}
            style={{
              width: "82%",
              height: "auto",
              objectFit: "contain",
              opacity: 0.4,
              mixBlendMode: "multiply" as const,
              userSelect: "none",
            }}
          />
        </div>
        {/* User attachment (artwork image sent by user) */}
        {showAttachment && (
          <div className="message-enter" style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid #efefef",
                maxWidth: "60%",
              }}
            >
              <Image
                src="/images/simon_fujiwara_hq.png"
                alt="Uploaded artwork"
                width={300}
                height={220}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                  maxHeight: 200,
                }}
              />
            </div>
          </div>
        )}

        {/* User text message */}
        {showUserMsg && (
          <div className="message-enter" style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                background: "#f4f4f4",
                borderRadius: "14px 14px 4px 14px",
                padding: "11px 16px",
                maxWidth: "80%",
              }}
            >
              <p style={{ fontSize: 14, color: "#1a1a1a", margin: 0, lineHeight: 1.5 }}>
                {DEMO_MSG}
              </p>
            </div>
          </div>
        )}

        {/* AI row */}
        {(showThinking || showResponse) && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {/* Avatar */}
            <div
              style={{
                width: 28,
                height: 28,
                background: "#0a0a0a",
                borderRadius: 7,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>A</span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Thinking dots */}
              {showThinking && (
                <div style={{ display: "flex", gap: 5, alignItems: "center", paddingTop: 7 }}>
                  {[0, 180, 360].map((d) => (
                    <div
                      key={d}
                      className="typing-dot"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              )}

              {/* Full response */}
              {showResponse && (
                <div className="response-enter">

                  {/* ── Metadata rows ── */}
                  {[
                    { label: "Title",   value: "Who\u2019s Iconic? (Spanish Identity)" },
                    { label: "Artist",  value: "Simon Fujiwara" },
                    { label: "Year",    value: "2022" },
                    { label: "Medium",  value: "Charcoal, pastel and ink on canvas" },
                    { label: "Style",   value: "Contemporary portraiture — identity, image construction, visual symbolism" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "72px 1fr",
                        gap: 8,
                        paddingBottom: 8,
                        marginBottom: 8,
                        borderBottom: "1px solid #f4f4f4",
                        alignItems: "baseline",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase" as const,
                          color: "#b8b8b8",
                        }}
                      >
                        {label}
                      </span>
                      <span style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.5 }}>
                        {value}
                      </span>
                    </div>
                  ))}

                  {/* ── Interpretation ── */}
                  <div style={{ marginTop: 14 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "#b8b8b8",
                        marginBottom: 8,
                      }}
                    >
                      Interpretation
                    </span>
                    <p style={{ fontSize: 14, color: "#3c3c3c", lineHeight: 1.78, margin: "0 0 10px 0" }}>
                      This work reflects Fujiwara&apos;s interest in how identity is shaped
                      through representation and perception. The fragmented face, expressive
                      marks, and bold color fields suggest that personality is constructed
                      through images — not fixed as a stable reality.
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#b8b8b8",
                        lineHeight: 1.6,
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      This interpretation evolves as ARTENA learns from broader cultural
                      data and user interaction.
                    </p>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          borderTop: "1px solid #f2f2f2",
          padding: "11px 14px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#fff",
            border: "1px solid #ebebeb",
            borderRadius: 8,
            padding: "9px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* typed text or placeholder */}
          <p
            style={{
              fontSize: 14,
              color: typedText ? "#1a1a1a" : "#c8c8c8",
              margin: 0,
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {typedText || "Ask about any artwork..."}
          </p>
          {/* blinking cursor — only while typing */}
          {typedText && (
            <div
              className="cursor-blink"
              style={{
                width: 1.5,
                height: 15,
                background: "#8a8a8a",
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
          )}
        </div>

        {/* Send button — activates when text is present */}
        <div
          style={{
            width: 34,
            height: 34,
            background: typedText ? "#0a0a0a" : "#e8e8e8",
            borderRadius: 8,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s ease",
          }}
        >
          <span
            style={{ fontSize: 14, color: typedText ? "#fff" : "#aaa", lineHeight: 1 }}
          >
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(88px, 12vw, 120px) clamp(20px, 4vw, 32px) clamp(60px, 8vw, 80px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>

        {/* Two-column: text left, phone right */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 items-center"
          style={{ gap: "clamp(40px, 6vw, 88px)" }}
        >
          {/* Left: Text */}
          <div>
            <Fade>
              <Label>ArtXpark · Cultural Intelligence</Label>
            </Fade>
            <Fade delay={80}>
              <h1
                style={{
                  fontSize: "clamp(48px, 6.5vw, 76px)",
                  fontWeight: 600,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.06,
                  marginTop: 18,
                  marginBottom: 2,
                  color: "var(--fg)",
                }}
              >
                ARTENA AI
              </h1>
              <p
                style={{
                  fontSize: "clamp(20px, 2.8vw, 32px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                  marginTop: 6,
                  marginBottom: 28,
                  color: "var(--body)",
                }}
              >
                Cultural Intelligence Engine
              </p>
            </Fade>
            <Fade delay={180}>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.78,
                  color: "var(--body)",
                  maxWidth: 460,
                  marginBottom: 44,
                }}
              >
                ArtXpark is building a next-generation AI system that understands,
                explains, and learns from artworks through real-world human
                interaction.
              </p>
            </Fade>
            <Fade delay={280}>
              <a
                href="#artena"
                style={{
                  display: "inline-block",
                  padding: "13px 30px",
                  background: "var(--fg)",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                Explore ARTENA AI
              </a>
            </Fade>
          </div>

          {/* Right: ARTENA AI chat panel */}
          <Fade delay={120}>
            <HeroChatPanel />
          </Fade>
        </div>

        {/* Bottom identity anchors */}
        <Fade delay={380}>
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{
              marginTop: 80,
              paddingTop: 40,
              borderTop: "1px solid var(--border)",
              gap: "clamp(24px, 4vw, 48px)",
            }}
          >
            {[
              {
                label: "Core Product",
                title: "ARTENA AI",
                desc: "Understands and explains art through interaction",
              },
              {
                label: "Ecosystem",
                title: "ArtXscan · ArtXdrone · ArtXbot",
                desc: "Physical data infrastructure",
              },
              {
                label: "Company",
                title: "ArtXpark Inc.",
                desc: "Seoul, Korea",
              },
            ].map((item) => (
              <div key={item.title}>
                <Label>{item.label}</Label>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginTop: 8,
                    marginBottom: 4,
                    color: "var(--fg)",
                  }}
                >
                  {item.title}
                </p>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   2. ARTENA AI OVERVIEW
════════════════════════════════════════ */
function ArtenaOverview() {
  return (
    <section id="artena" style={{ background: "var(--surface)", padding: "clamp(64px, 10vw, 120px) clamp(20px, 4vw, 32px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 items-center"
          style={{ gap: "clamp(40px, 6vw, 88px)" }}
        >
          {/* Left: artena_ai.jpg */}
          <Fade>
            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
                aspectRatio: "3/4",
              }}
            >
              <Image
                src="/images/artena_logo.png"
                alt="ARTENA AI — Cultural Intelligence System"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Fade>

          {/* Right: Text */}
          <div>
            <Fade>
              <Label>ARTENA AI</Label>
            </Fade>
            <Fade delay={80}>
              <h2
                style={{
                  fontSize: "clamp(28px, 3.5vw, 46px)",
                  fontWeight: 600,
                  letterSpacing: "-0.028em",
                  lineHeight: 1.13,
                  marginTop: 16,
                  marginBottom: 28,
                  color: "var(--fg)",
                }}
              >
                Not a chatbot.
                <br />A cultural intelligence system.
              </h2>
            </Fade>
            <Fade delay={140}>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "var(--body)",
                  marginBottom: 20,
                }}
              >
                ARTENA AI is designed from the ground up for artworks, exhibitions,
                and cultural context — not repurposed from generic AI models. Domain
                knowledge is foundational, not bolted on.
              </p>
            </Fade>
            <Fade delay={200}>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "var(--body)",
                  marginBottom: 20,
                }}
              >
                It learns continuously from every asset it processes: scanning data,
                provenance records, condition history, exhibition context, and market
                signals. The more it sees, the more precisely it understands.
              </p>
            </Fade>
            <Fade delay={260}>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "var(--body)",
                }}
              >
                ARTENA AI does not merely retrieve information — it builds structured
                cultural knowledge, improving through data, context, and real-world
                interaction with the art ecosystem.
              </p>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   3. WHY ARTENA AI
════════════════════════════════════════ */
const WHY_FEATURES = [
  {
    title: "Cultural Intelligence",
    desc: "Built specifically for art and cultural assets. Domain knowledge — artist history, material properties, market context — is structural, not supplementary.",
  },
  {
    title: "Learning-Driven",
    desc: "Every scan, exhibition, and transaction makes ARTENA AI more accurate. Intelligence compounds with every asset it processes.",
  },
  {
    title: "Context-Aware Interpretation",
    desc: "ARTENA AI understands cultural significance, provenance weight, and condition nuance — not just pattern recognition on surface features.",
  },
  {
    title: "Ecosystem-Connected",
    desc: "Linked directly to real-world physical data through ArtXscan, ArtXdrone, and ArtXbot — grounding every AI output in verified field evidence.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const cardsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.13,
    },
  },
};

function WhyArtenаCard({ feature }: { feature: typeof WHY_FEATURES[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        border: hovered ? "1px solid #B5963A" : "1px solid #C6A86A",
        borderRadius: 14,
        padding: "40px 36px",
        height: "100%",
        background: "#fff",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)"
          : "0 2px 8px rgba(0,0,0,0.025)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        overflow: "hidden",
      }}
    >
      {/* Top accent line — muted gold on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "#C4A96E",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.28s ease",
        }}
      />

      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          marginBottom: 16,
          color: "#0a0a0a",
        }}
      >
        {feature.title}
      </p>
      <p
        style={{
          fontSize: 14,
          color: "#5a5a5a",
          lineHeight: 1.82,
          margin: 0,
        }}
      >
        {feature.desc}
      </p>
    </motion.div>
  );
}

function WhyArtena() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ background: "#fafafa", padding: "clamp(64px, 11vw, 136px) clamp(20px, 4vw, 32px)" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Intro block ── */}
        <motion.div
          animate={inView ? "visible" : "hidden"}
          initial="hidden"
          style={{ marginBottom: 72 }}
        >
          <motion.div custom={0} variants={fadeUp}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "#a0a0a0",
                fontWeight: 600,
              }}
            >
              Why ARTENA AI
            </span>
          </motion.div>

          <motion.h2
            custom={0.08}
            variants={fadeUp}
            style={{
              fontSize: "clamp(30px, 3.8vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.032em",
              lineHeight: 1.1,
              marginTop: 20,
              marginBottom: 0,
              color: "#0a0a0a",
            }}
          >
            Intelligence built for culture.
          </motion.h2>

          <motion.p
            custom={0.16}
            variants={fadeUp}
            style={{
              fontSize: 16,
              color: "#6a6a6a",
              maxWidth: 480,
              marginTop: 22,
              lineHeight: 1.8,
            }}
          >
            Generic AI cannot determine what makes a Basquiat authentic or a Song
            Dynasty vase significant. ARTENA AI can — and it keeps getting better
            with every interaction.
          </motion.p>
        </motion.div>

        {/* ── Cards ── */}
        <motion.div
          animate={inView ? "visible" : "hidden"}
          initial="hidden"
          variants={cardsContainerVariants}
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 16 }}
        >
          {WHY_FEATURES.map((f) => (
            <WhyArtenаCard key={f.title} feature={f} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   4. ECOSYSTEM
════════════════════════════════════════ */
function Ecosystem() {
  const items = [
    {
      src: "/images/van_exterior.jpg",
      name: "ArtXscan",
      tag: "Mobile Scanning System",
      desc: "High-precision mobile scanning deployed directly to the asset. Multi-spectral imaging and 3D capture in the field, on-site — wherever the work is.",
    },
    {
      src: "/images/van_interior.jpg",
      name: "Mobile Scan Lab",
      tag: "Controlled Environment Unit",
      desc: "Custom-built mobile laboratory with a controlled scanning environment. Full digitization capability, deployable to any location worldwide.",
    },
    {
      src: "/images/drone.jpg",
      name: "ArtXdrone",
      tag: "Aerial Scanning",
      desc: "Autonomous aerial scanning for large-scale works, outdoor sculptures, murals, and architectural cultural assets — capturing every dimension.",
    },
    {
      src: "/images/bot.jpg",
      name: "ArtXbot",
      tag: "Precision Robotics",
      desc: "Robotic scanning unit designed for gallery and museum environments. Systematic, high-throughput, non-contact documentation at scale.",
    },
  ];

  return (
    <section id="ecosystem" style={{ background: "var(--surface)", padding: "clamp(64px, 10vw, 120px) clamp(20px, 4vw, 32px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <Label>Ecosystem</Label>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 600,
              letterSpacing: "-0.028em",
              marginTop: 16,
              marginBottom: 14,
              color: "var(--fg)",
            }}
          >
            Infrastructure that feeds ARTENA AI.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--body)",
              maxWidth: 560,
              marginBottom: 64,
              lineHeight: 1.75,
            }}
          >
            ArtXscan, ArtXdrone, and ArtXbot are not separate products. They are
            the physical intelligence layer — generating the verified real-world
            data that ARTENA AI learns from and operates on.
          </p>
        </Fade>

        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 20 }}
        >
          {items.map((item, i) => (
            <Fade key={item.name} delay={i * 70}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/10" }}>
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "26px 28px 30px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 12,
                      marginBottom: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--fg)",
                        margin: 0,
                      }}
                    >
                      {item.name}
                    </p>
                    <span
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "var(--muted)",
                        fontWeight: 500,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.75, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   5. ABOUT ARTXPARK
════════════════════════════════════════ */
function About() {
  return (
    <section
      id="about"
      style={{
        background: "var(--dark-bg)",
        color: "var(--dark-fg)",
        padding: "clamp(64px, 10vw, 120px) clamp(20px, 4vw, 32px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <Label light>About ArtXpark</Label>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              marginTop: 16,
              marginBottom: 48,
              color: "#fff",
              maxWidth: 700,
              lineHeight: 1.13,
            }}
          >
            An AI technology company building cultural intelligence infrastructure.
          </h2>
        </Fade>

        <Fade delay={100}>
          <div
            style={{
              borderLeft: "2px solid #252525",
              paddingLeft: 32,
              marginBottom: 56,
              maxWidth: 680,
            }}
          >
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: "#9a9a9a",
                fontWeight: 300,
              }}
            >
              &ldquo;Culture holds some of the most irreplaceable value humans have
              ever created. It deserves the same data infrastructure we have built for
              financial markets — and ARTENA AI is how we get there.&rdquo;
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#3a3a3a",
                marginTop: 20,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
              }}
            >
              Jinhwi Park — Founder &amp; CEO, ArtXpark
            </p>
          </div>
        </Fade>

        <Fade delay={180}>
          <div style={{ maxWidth: 700, marginBottom: 64 }}>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "#7a7a7a",
                marginBottom: 20,
              }}
            >
              ArtXpark is an AI technology company headquartered in Seoul, Korea.
              Founded at the intersection of art history, AI systems architecture, and
              physical asset markets, ArtXpark is focused on one mission: building
              ARTENA AI as the canonical intelligence infrastructure for the global
              cultural asset market.
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "#7a7a7a",
              }}
            >
              Our team combines deep expertise in art market operations, AI systems
              design, intellectual property strategy, legal frameworks, and financial
              regulation — built specifically to address the unique complexity of
              cultural assets at a global scale.
            </p>
          </div>
        </Fade>

        <Fade delay={260}>
          <div
            className="grid grid-cols-2 sm:grid-cols-4"
            style={{
              paddingTop: 48,
              borderTop: "1px solid #1a1a1a",
              gap: "clamp(24px, 4vw, 48px)",
            }}
          >
            {[
              { label: "Founded", value: "Seoul, Korea" },
              { label: "Core Product", value: "ARTENA AI" },
              { label: "Market Focus", value: "Cultural Assets" },
              { label: "Domain", value: "AI Infrastructure" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontSize: 11,
                    color: "#3a3a3a",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase" as const,
                    marginBottom: 10,
                  }}
                >
                  {stat.label}
                </p>
                <p style={{ fontSize: 15, fontWeight: 500, color: "#e0e0e0" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   6. TEAM
════════════════════════════════════════ */
/* Team sub-layout helpers */
function TRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        borderBottom: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "var(--muted)",
          fontWeight: 500,
          marginBottom: 12,
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function TBullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 7, alignItems: "flex-start" }}>
      <span style={{ fontSize: 13, color: "var(--muted)", flexShrink: 0, lineHeight: 1.65 }}>
        —
      </span>
      <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.65, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function Team() {
  return (
    <section id="team" style={{ background: "#fff", padding: "clamp(64px, 10vw, 120px) clamp(20px, 4vw, 32px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Section title */}
        <Fade>
          <Label>Team</Label>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 600,
              letterSpacing: "-0.028em",
              marginTop: 16,
              marginBottom: 64,
              color: "var(--fg)",
            }}
          >
            Founder &amp; Team
          </h2>
        </Fade>

        {/* ── Leadership label ── */}
        <Fade>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "var(--muted)",
              fontWeight: 500,
              marginBottom: 28,
            }}
          >
            Leadership
          </p>
        </Fade>

        {/* ── [1] Founder — full-width primary ── */}
        <Fade>
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "clamp(28px, 4vw, 44px) clamp(20px, 3.5vw, 40px)",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Primary accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "#0a0a0a",
              }}
            />

            {/* Name + Title row */}
            <div
              className="flex flex-col sm:flex-row sm:items-baseline"
              style={{ gap: "8px 20px", marginBottom: 32 }}
            >
              <p
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "var(--fg)",
                  letterSpacing: "-0.025em",
                  margin: 0,
                }}
              >
                Jinhwi Park
              </p>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: "var(--muted)",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Founder &amp; CEO, ArtXpark Inc.
              </p>
            </div>

            {/* Rows — 2-col on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "0 48px" }}>
              <div>
                <TRow label="Academic Background">
                  <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.65, margin: 0 }}>
                    University of Northern Colorado — Art History
                  </p>
                </TRow>
                <TRow label="Professional Experience">
                  <TBullet>UOVO Art (USA)</TBullet>
                  <TBullet>JN Gallery</TBullet>
                  <TBullet>Opera Gallery Korea</TBullet>
                </TRow>
              </div>
              <div>
                <TRow label="Market Insight">
                  <TBullet>
                    Identified structural gaps in artwork data — condition, provenance, transaction records
                  </TBullet>
                  <TBullet>
                    Lack of data integration reduces institutional trust and pricing efficiency
                  </TBullet>
                </TRow>
                <TRow label="Founder-Market Fit">
                  <TBullet>Experience across logistics, exhibition, and sales operations</TBullet>
                  <TBullet>Direct exposure to real-world art market problems</TBullet>
                  <TBullet>Validated problem recognition through hands-on operations</TBullet>
                </TRow>
              </div>
            </div>
          </div>
        </Fade>

        {/* ── [2] Chief AI Officer — full-width secondary ── */}
        <Fade delay={80}>
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "clamp(24px, 3.5vw, 36px) clamp(20px, 3.5vw, 40px)",
              marginBottom: 80,
            }}
          >
            {/* Name + Title row */}
            <div
              className="flex flex-col sm:flex-row sm:items-baseline"
              style={{ gap: "8px 20px", marginBottom: 28 }}
            >
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--fg)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Young-sang Seo (Dr. Seo)
              </p>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: "var(--muted)",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Chief AI Officer (CAIO) · AI Architecture Lead
              </p>
            </div>

            {/* Rows — 2-col on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "0 48px" }}>
              <div>
                <TRow label="Academic Background">
                  <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.65, margin: 0 }}>
                    Harvard University — MPH / PhD-level background
                  </p>
                </TRow>
                <TRow label="Research & Technical Expertise">
                  <TBullet>LLM / Vision AI / Multimodal AI</TBullet>
                  <TBullet>Learning systems and data-driven intelligence</TBullet>
                  <TBullet>AI system architecture design</TBullet>
                </TRow>
              </div>
              <div>
                <TRow label="Role in ArtXpark">
                  <TBullet>Leads development of ARTENA AI</TBullet>
                  <TBullet>Defines AI architecture and system structure</TBullet>
                  <TBullet>Builds learning-driven cultural intelligence system</TBullet>
                </TRow>
                <TRow label="Strategic Impact">
                  <TBullet>Converts cultural data into structured AI intelligence</TBullet>
                  <TBullet>Builds the core engine that powers ARTENA AI</TBullet>
                  <TBullet>Ensures differentiation from generic AI systems</TBullet>
                </TRow>
              </div>
            </div>
          </div>
        </Fade>

        {/* ── Divider ── */}
        <Fade>
          <div style={{ height: 1, background: "var(--border)", marginBottom: 64 }} />
        </Fade>

        {/* ── Strategic Advisory Board label ── */}
        <Fade>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "var(--muted)",
              fontWeight: 500,
              marginBottom: 28,
            }}
          >
            Strategic Advisory Board
          </p>
        </Fade>

        {/* ── Three advisors ── */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>

          {/* 정영훈 */}
          <Fade>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "32px 28px" }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>
                  Young-hoon Jung
                </p>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                    color: "var(--muted)",
                    fontWeight: 500,
                  }}
                >
                  IP Strategy Advisor
                </p>
              </div>
              <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />
              <div style={{ marginBottom: 20 }}>
                <TBullet>Seoul National University, Engineering</TBullet>
                <TBullet>Representative Patent Attorney</TBullet>
                <TBullet>System-level patent strategy / FTO / global IP</TBullet>
              </div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--fg)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                  lineHeight: 1.6,
                }}
              >
                → Builds defensible technology barrier
              </p>
            </div>
          </Fade>

          {/* 김욱준 */}
          <Fade delay={70}>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "32px 28px" }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>
                  Wook-jun Kim
                </p>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                    color: "var(--muted)",
                    fontWeight: 500,
                  }}
                >
                  Legal Advisor
                </p>
              </div>
              <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />
              <div style={{ marginBottom: 20 }}>
                <TBullet>Seoul National University, Law</TBullet>
                <TBullet>Kim &amp; Chang attorney</TBullet>
                <TBullet>Former prosecutor</TBullet>
              </div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--fg)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                  lineHeight: 1.6,
                }}
              >
                → Removes legal risk in scaling
              </p>
            </div>
          </Fade>

          {/* 이복현 */}
          <Fade delay={140}>
            <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "32px 28px" }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>
                  Bok-hyun Lee
                </p>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase" as const,
                    color: "var(--muted)",
                    fontWeight: 500,
                  }}
                >
                  Regulatory &amp; Finance Advisor
                </p>
              </div>
              <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />
              <div style={{ marginBottom: 20 }}>
                <TBullet>Seoul National University, Economics</TBullet>
                <TBullet>Attorney / CPA</TBullet>
                <TBullet>Former Financial Supervisory Service head</TBullet>
              </div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--fg)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                  lineHeight: 1.6,
                }}
              >
                → Enables institutional trust and expansion
              </p>
            </div>
          </Fade>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "clamp(32px, 4vw, 44px) clamp(20px, 4vw, 32px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
          style={{ gap: 24 }}
        >
          {/* Logo */}
          <a
            href="#hero"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <Image
              src="/images/logo.jpg"
              alt="ArtXpark"
              width={22}
              height={22}
              style={{ borderRadius: 4, objectFit: "cover" }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--fg)",
                letterSpacing: "-0.01em",
              }}
            >
              ArtXpark
            </span>
          </a>

          {/* Copyright */}
          <p style={{ fontSize: 12, color: "var(--muted)" }}>
            © {new Date().getFullYear()} ArtXpark Inc. All rights reserved.
          </p>

          {/* Nav links */}
          <nav className="hidden sm:flex" style={{ gap: 28 }}>
            {[
              ["ARTENA AI", "#artena"],
              ["Ecosystem", "#ecosystem"],
              ["About", "#about"],
              ["Team", "#team"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ArtenaOverview />
        <WhyArtena />
        <Ecosystem />
        <About />
        <Team />
      </main>
      <Footer />
    </>
  );
}
