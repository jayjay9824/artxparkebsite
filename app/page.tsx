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
    ["Thesis", "#thesis"],
    ["AXVELA AI", "#axvela"],
    ["AXVELA VIEW", "#ai-glass"],
    ["Passport", "#passport"],
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
  /* Cycling runs on every viewport that hasn't opted out of motion. To
     prevent layout shift on mobile (where the panel's tallest frame —
     the full AI response — is significantly taller than the shorter
     attachment/typing frames), the panel body is given a CSS-driven
     min-height that's locked to the tallest natural height per
     breakpoint: 960px on mobile, 700px on desktop (see globals.css
     `.hero-chat-body`). The min-height is always applied (not gated on
     `animate`), so reduced-motion users — who see the final/largest
     frame statically — also get the same stable height.

     SSR/first paint renders the panel in its final state so there is no
     hydration mismatch and no flash of empty panel. On mount, if the
     user has motion enabled, we reset to step ① and start cycling. */
  const [animate, setAnimate]               = useState(false);
  const [cycleKey, setCycleKey]             = useState(0);
  const [showAttachment, setShowAttachment] = useState(true);
  const [typedText, setTypedText]           = useState("");
  const [showUserMsg, setShowUserMsg]       = useState(true);
  const [showThinking, setShowThinking]     = useState(false);
  const [showResponse, setShowResponse]     = useState(true);
  const [fadeOut, setFadeOut]               = useState(false);

  /* Decide once on mount whether the cycling animation should run.
     Reduced-motion users keep the static final state rendered at SSR. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionOk) setAnimate(true);
  }, []);

  useEffect(() => {
    if (!animate) return;

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
  }, [cycleKey, animate]);

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
          AXVELA AI
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
      {/* The panel body is locked to the tallest frame per breakpoint so
          short cycle states (attachment-only, typing) don't shift layout
          when they transition into the full response. Heights are set in
          globals.css via `.hero-chat-body` and a media query — applied
          unconditionally so reduced-motion users also get a stable box.
          Messages stack from the top (flex-start) so empty space sits
          below, mirroring real chat UI. */}
      <div
        className="hero-chat-body"
        style={{
          padding: "20px 20px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
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
            src="/images/axvela_logo_wh.png"
            alt=""
            width={320}
            height={320}
            style={{
              width: "82%",
              height: "auto",
              objectFit: "contain",
              opacity: 0.08,
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
                      This interpretation evolves as AXVELA learns from broader cultural
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
              <Label>ArtXpark · Physical Asset Intelligence Infrastructure</Label>
            </Fade>
            <Fade delay={80}>
              <h1
                style={{
                  fontSize: "clamp(48px, 6.5vw, 76px)",
                  fontWeight: 600,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.06,
                  marginTop: 18,
                  marginBottom: 12,
                  color: "var(--fg)",
                }}
              >
                AI generates.
                <br />
                <span style={{ whiteSpace: "nowrap" }}>
                  AXVELA
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: "0.45em",
                      verticalAlign: "0.32em",
                      fontSize: "0.22em",
                      fontWeight: 400,
                      letterSpacing: "normal",
                      lineHeight: 1.2,
                      color: "var(--muted)",
                      fontFeatureSettings: '"liga" off',
                      fontVariantLigatures: "none",
                      wordBreak: "keep-all",
                    }}
                  >
                    엑스벨라
                    <span style={{ margin: "0 0.4em", opacity: 0.55 }}>·</span>
                    <span style={{ fontVariantLigatures: "none" }}>/æks&nbsp;ˈvel.ə/</span>
                  </span>
                </span>
                {" "}verifies.
              </h1>
              <p
                style={{
                  fontSize: "clamp(18px, 2.4vw, 26px)",
                  fontWeight: 300,
                  letterSpacing: "-0.018em",
                  lineHeight: 1.35,
                  marginTop: 10,
                  marginBottom: 28,
                  color: "var(--body)",
                }}
              >
                AI가 만들고, AXVELA가 검증한다.
              </p>
            </Fade>
            <Fade delay={180}>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.78,
                  color: "var(--body)",
                  maxWidth: 520,
                  marginBottom: 14,
                }}
              >
                AXVELA is the data infrastructure for physical cultural assets —
                connecting their state, movement, culture, and transactions into
                a single, verifiable record.
              </p>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: "var(--muted)",
                  maxWidth: 520,
                  marginBottom: 44,
                  wordBreak: "keep-all",
                }}
              >
                AXVELA는 실물 문화 자산의 상태·이동·문화·거래를 하나의 검증 가능한
                기록으로 잇는 데이터 인프라입니다.
              </p>
            </Fade>
            <Fade delay={280}>
              <a
                href="#thesis"
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
                Explore the infrastructure ↓
              </a>
            </Fade>
          </div>

          {/* Right: AXVELA AI chat panel */}
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
                label: "Macro Flow",
                title: "Physical Asset → Data → AI → Assetization",
                desc: "From the real world to a verifiable record.",
              },
              {
                label: "Master Brand",
                title: "AXVELA",
                desc: "Physical Asset Intelligence Infrastructure",
              },
              {
                label: "Company",
                title: "ArtXpark Inc.",
                desc: "Seoul, Republic of Korea",
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
   1.5  THESIS
════════════════════════════════════════ */
const THESIS_STREAMS = [
  {
    num: "01",
    label: "Operations Data",
    product: "Gallery System",
    items: "Exhibition history · Transactions · Collectors · Consignment · Invoices",
  },
  {
    num: "02",
    label: "Intelligence Data",
    product: "AXVELA AI",
    items: "Artist analysis · Movement · Market trends · Comparables",
  },
  {
    num: "03",
    label: "Capture Data",
    product: "AXVELA SCAN",
    items: "3D points · Condition · Material · Artist touch · Change history",
  },
  {
    num: "04",
    label: "Engagement Data",
    product: "AXVELA VIEW",
    items: "AR recognition · Works of interest · Viewing history",
  },
];

function Thesis() {
  return (
    <section
      id="thesis"
      style={{
        background: "var(--dark-bg)",
        color: "var(--dark-fg)",
        padding: "clamp(80px, 12vw, 140px) clamp(20px, 4vw, 32px)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <Label light>The Thesis</Label>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.032em",
              lineHeight: 1.1,
              marginTop: 18,
              marginBottom: 14,
              color: "#fff",
              maxWidth: 820,
            }}
          >
            <span style={{ display: "block" }}>Six products. Three phases.</span>
            <span style={{ display: "block" }}>One infrastructure.</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "#b8b8b8",
              maxWidth: 720,
              marginBottom: 44,
              wordBreak: "keep-all",
            }}
          >
            여섯 제품, 세 단계, 하나의 인프라.
          </p>
        </Fade>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "clamp(28px, 4vw, 56px)",
            marginBottom: "clamp(64px, 8vw, 96px)",
          }}
        >
          <Fade delay={80}>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "#b8b8b8",
                margin: 0,
                fontWeight: 300,
                maxWidth: 520,
              }}
            >
              On the surface, AXVELA is a family of products released in three
              phases. Underneath, it is a single asset-data infrastructure.
              AXVELA does not build a smarter AI — it builds the layer that
              connects the state, movement, culture, and transactions of
              physical assets into one continuous record.
            </p>
          </Fade>
          <Fade delay={160}>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.95,
                color: "#7a7a7a",
                margin: 0,
                fontWeight: 300,
                maxWidth: 520,
                wordBreak: "keep-all",
              }}
            >
              표면적으로 AXVELA는 세 단계로 출시되는 여섯 개의 제품입니다.
              그러나 그 아래는 하나의 자산 데이터 인프라입니다. AXVELA는 더
              똑똑한 AI를 만들지 않습니다 — 실물 자산의 상태·이동·문화·거래를
              하나의 연속된 기록으로 잇는 레이어를 만듭니다.
            </p>
          </Fade>
        </div>

        {/* ── Product proof: Gallery System dashboard + AI / SCAN mockups ── */}
        <div
          style={{
            paddingTop: "clamp(40px, 5vw, 64px)",
            borderTop: "1px solid #1a1a1a",
            marginBottom: "clamp(64px, 8vw, 96px)",
          }}
        >
          <Fade>
            <p
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "#c4a96e",
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              01 · Operations · Gallery System
            </p>
            <div
              style={{
                position: "relative",
                aspectRatio: "1536 / 1024",
                maxWidth: 1280,
                margin: "0 auto",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0f0f0f",
                boxShadow:
                  "0 40px 120px -30px rgba(0,0,0,0.9), 0 20px 60px -20px rgba(196,169,110,0.08)",
              }}
            >
              <Image
                src="/images/gallery-system.png"
                alt="Gallery System 운영 대시보드 — 전시·거래·컬렉터·위탁·인보이스 통합 화면"
                fill
                sizes="(min-width: 1200px) 1200px, (min-width: 640px) 90vw, 100vw"
                quality={95}
                unoptimized
                style={{ objectFit: "cover" }}
              />
            </div>
          </Fade>

          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{
              gap: "clamp(24px, 3.5vw, 40px)",
              marginTop: "clamp(28px, 4vw, 48px)",
            }}
          >
            <Fade delay={100}>
              <div>
                <p
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase" as const,
                    color: "#c4a96e",
                    fontWeight: 500,
                    marginBottom: 16,
                  }}
                >
                  02 · Intelligence · AXVELA AI
                </p>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "851 / 1847",
                    maxWidth: 360,
                    margin: "0 auto",
                    borderRadius: 22,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0f0f0f",
                    boxShadow:
                      "0 30px 80px -30px rgba(0,0,0,0.9)",
                  }}
                >
                  <Image
                    src="/images/axvela-ai.png"
                    alt="AXVELA AI — 작품 분석 모바일 앱 화면"
                    fill
                    sizes="(min-width: 640px) 400px, 90vw"
                    quality={95}
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </Fade>

            <Fade delay={180}>
              <div>
                <p
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase" as const,
                    color: "#c4a96e",
                    fontWeight: 500,
                    marginBottom: 16,
                  }}
                >
                  03 · Capture · AXVELA SCAN
                </p>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "853 / 1844",
                    maxWidth: 360,
                    margin: "0 auto",
                    borderRadius: 22,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0f0f0f",
                    boxShadow:
                      "0 30px 80px -30px rgba(0,0,0,0.9)",
                  }}
                >
                  <Image
                    src="/images/axvela-scan.png"
                    alt="AXVELA SCAN — LiDAR 3D 스캔 모바일 앱 화면"
                    fill
                    sizes="(min-width: 640px) 400px, 90vw"
                    quality={95}
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </Fade>
          </div>

          {/* ── 04 · Process — SCAN + LiDAR 디지털 트윈 10단계 워크플로우 ── */}
          <Fade delay={260}>
            <div
              style={{
                marginTop: "clamp(40px, 5vw, 64px)",
              }}
            >
              <p
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  color: "#c4a96e",
                  fontWeight: 500,
                  margin: "0 0 16px",
                }}
              >
                04 · Process · LiDAR Digital Twin Workflow
              </p>
              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#0f0f0f",
                  boxShadow:
                    "0 40px 120px -30px rgba(0,0,0,0.9), 0 20px 60px -20px rgba(196,169,110,0.08)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1535 / 1024",
                  }}
                >
                  <Image
                    src="/images/scan-flow-2.png"
                    alt="AXVELA SCAN — iPhone 16 Pro LiDAR로 도자기 디지털 트윈을 만드는 10단계 워크플로우 (백자청화자전어문호)"
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    quality={95}
                    unoptimized
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </Fade>
        </div>

        <div
          style={{
            paddingTop: "clamp(40px, 5vw, 64px)",
            borderTop: "1px solid #1a1a1a",
          }}
        >
          <Fade>
            <h3
              style={{
                fontSize: "clamp(20px, 2.4vw, 28px)",
                fontWeight: 500,
                letterSpacing: "-0.022em",
                lineHeight: 1.3,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Four data streams. One asset identity.
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#888",
                letterSpacing: "0.01em",
                marginBottom: "clamp(36px, 5vw, 56px)",
              }}
            >
              네 개의 데이터 스트림, 하나의 자산 정체성.
            </p>
          </Fade>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            style={{ gap: "clamp(20px, 2.5vw, 28px)" }}
          >
            {THESIS_STREAMS.map((s, i) => (
              <Fade key={s.label} delay={i * 80}>
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "28px 24px",
                    height: "100%",
                    background: "rgba(255,255,255,0.015)",
                  }}
                >
                  <p
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 11,
                      letterSpacing: "0.20em",
                      color: "#c4a96e",
                      fontWeight: 500,
                      marginBottom: 18,
                    }}
                  >
                    {s.num}
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "-0.018em",
                      marginBottom: 6,
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#888",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase" as const,
                      marginBottom: 16,
                      fontWeight: 500,
                    }}
                  >
                    {s.product}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#9a9a9a",
                      lineHeight: 1.7,
                      margin: 0,
                      fontWeight: 300,
                      wordBreak: "keep-all",
                    }}
                  >
                    {s.items}
                  </p>
                </div>
              </Fade>
            ))}
          </div>

          <Fade delay={360}>
            <div
              style={{
                marginTop: "clamp(40px, 5vw, 64px)",
                paddingTop: "clamp(28px, 3.5vw, 40px)",
                borderTop: "1px solid #1a1a1a",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px 32px",
              }}
            >
              {[
                ["Append-only", "누적된다"],
                ["Cross-referenced", "서로 교차 검증된다"],
                ["Temporal", "시간이 깊이를 만든다"],
              ].map(([en, ko]) => (
                <div key={en} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.20em",
                      textTransform: "uppercase" as const,
                      color: "#c4a96e",
                      fontWeight: 500,
                    }}
                  >
                    {en}
                  </span>
                  <span style={{ fontSize: 13, color: "#7a7a7a", fontWeight: 300 }}>
                    {ko}
                  </span>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   2. AXVELA AI OVERVIEW
════════════════════════════════════════ */
function AxvelaOverview() {
  return (
    <section id="axvela" style={{ background: "var(--surface)", padding: "clamp(64px, 10vw, 120px) clamp(20px, 4vw, 32px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 items-center"
          style={{ gap: "clamp(40px, 6vw, 88px)" }}
        >
          {/* Left: AXVELA AI logo */}
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
                src="/images/axvela_logo_wh.png"
                alt="AXVELA AI — Cultural Intelligence System"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Fade>

          {/* Right: Text */}
          <div>
            <Fade>
              <Label>AXVELA AI</Label>
            </Fade>
            <Fade delay={80}>
              <h2
                style={{
                  fontSize: "clamp(28px, 3.5vw, 46px)",
                  fontWeight: 600,
                  letterSpacing: "-0.028em",
                  lineHeight: 1.13,
                  marginTop: 16,
                  marginBottom: 10,
                  color: "var(--fg)",
                }}
              >
                Not a chatbot.
                <br />A cultural intelligence system.
              </h2>
              <p
                style={{
                  fontSize: "clamp(15px, 1.6vw, 18px)",
                  fontWeight: 300,
                  letterSpacing: "-0.012em",
                  lineHeight: 1.5,
                  color: "var(--muted)",
                  marginBottom: 28,
                  wordBreak: "keep-all",
                }}
              >
                챗봇이 아니다. 문화 인텔리전스 시스템이다.
              </p>
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
                AXVELA AI is designed from the ground up for artworks, exhibitions,
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
                AXVELA AI does not merely retrieve information — it builds structured
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
   3. WHY AXVELA AI
════════════════════════════════════════ */
const WHY_FEATURES = [
  {
    title: "Cultural Intelligence",
    desc: "Built specifically for art and cultural assets. Domain knowledge — artist history, material properties, market context — is structural, not supplementary.",
  },
  {
    title: "Learning-Driven",
    desc: "Every scan, exhibition, and transaction makes AXVELA AI more accurate. Intelligence compounds with every asset it processes.",
  },
  {
    title: "Context-Aware Interpretation",
    desc: "AXVELA AI understands cultural significance, provenance weight, and condition nuance — not just pattern recognition on surface features.",
  },
  {
    title: "Ecosystem-Connected",
    desc: "Linked directly to real-world physical data through AXVELA SCAN, AXVELA DRONE, and AXVELA ROBOT — grounding every AI output in verified field evidence.",
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

function WhyAxvelaCard({ feature }: { feature: typeof WHY_FEATURES[0] }) {
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

function WhyAxvela() {
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
              Why AXVELA AI
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
            custom={0.12}
            variants={fadeUp}
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "#8a8a8a",
              marginTop: 12,
              wordBreak: "keep-all",
            }}
          >
            문화를 위해 설계된 인텔리전스.
          </motion.p>

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
            Dynasty vase significant. AXVELA AI can — and it keeps getting better
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
            <WhyAxvelaCard key={f.title} feature={f} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   3.5  AXVELA AI GLASS
════════════════════════════════════════ */
const AI_GLASS_FEATURES = [
  {
    num: "01",
    title: "Real-time Recognition",
    subtitle: "실시간 인식",
    description:
      "The moment a work enters your view, AXVELA identifies it. No search, no input — ask by voice and the artist, period, material, and history respond at once, within the flow of the visit.",
  },
  {
    num: "02",
    title: "Contextual Overlay",
    subtitle: "컨텍스트 오버레이",
    description:
      "Market value, visitor response, and comparable works surface naturally in view — curated to sit where they never block the work. Visible on demand, gone when you focus.",
  },
  {
    num: "03",
    title: "Continuous Learning",
    subtitle: "지속 학습",
    description:
      "Every viewing signal — time spent, works revisited, works compared — makes AXVELA more precise. The intelligence deepens as more people use it, returning sharper insight to collectors and galleries.",
  },
];

function AIGlass() {
  return (
    <section
      id="ai-glass"
      style={{
        background: "var(--dark-bg)",
        color: "var(--dark-fg)",
        padding: "clamp(80px, 12vw, 140px) clamp(20px, 4vw, 32px)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ── Section Header ── */}
        <Fade>
          <Label light>AXVELA VIEW</Label>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.028em",
              lineHeight: 1.13,
              marginTop: 18,
              marginBottom: 10,
              color: "#fff",
            }}
          >
            Look. Ask. Understand.
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "#8a8a8a",
              marginBottom: 28,
            }}
          >
            보고, 묻고, 이해한다.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: "#c8c8c8",
              maxWidth: 720,
              marginBottom: 14,
              fontWeight: 300,
            }}
          >
            A wearable cultural intelligence that recognizes and interprets a
            work the moment you look at it. In galleries and museums, every
            detail appears within your field of view — no search, no device in
            hand.
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.85,
              color: "#8a8a8a",
              maxWidth: 720,
              marginBottom: "clamp(48px, 6vw, 72px)",
              fontWeight: 300,
              wordBreak: "keep-all",
            }}
          >
            AXVELA VIEW는 작품을 응시하는 순간 작품을 인식하고 해설하는
            웨어러블 Cultural Intelligence입니다. 갤러리·미술관·전시장에서
            별도의 검색이나 디바이스 조작 없이, 시야 안에서 모든 정보를
            받습니다.
          </p>
        </Fade>

        {/* ── Hero POV image (contained, no full-bleed) ── */}
        <Fade>
          <div
            className="group"
            style={{
              position: "relative",
              aspectRatio: "16 / 10",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 40px 120px -30px rgba(0,0,0,0.9), 0 20px 60px -20px rgba(196,169,110,0.10)",
            }}
          >
            <Image
              src="/images/axvela_glass_pov.png"
              alt="AXVELA VIEW overlay on artwork — Cultural Intelligence in AR view"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              style={{ objectFit: "cover" }}
            />
          </div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "#6a6a6a",
              fontWeight: 500,
              textAlign: "center",
              marginTop: 24,
            }}
          >
            Real World · Real Culture · Real Intelligence.
          </p>
        </Fade>

        {/* ── The Experience: image + narrative copy ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 items-center"
          style={{
            gap: "clamp(40px, 6vw, 80px)",
            marginTop: "clamp(80px, 10vw, 120px)",
            marginBottom: "clamp(80px, 10vw, 120px)",
          }}
        >
          <Fade>
            <div
              className="group"
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 30px 80px -30px rgba(0,0,0,0.8)",
              }}
            >
              <Image
                src="/images/axvela_glass_experience.png"
                alt="A viewer wearing AXVELA VIEW to read an artwork"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                style={{ objectFit: "cover" }}
              />
            </div>
          </Fade>

          <Fade delay={100}>
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  color: "#c4a96e",
                  fontWeight: 500,
                  marginBottom: 18,
                }}
              >
                The Experience
              </p>
              <h3
                style={{
                  fontSize: "clamp(22px, 2.6vw, 32px)",
                  fontWeight: 500,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.3,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                <span style={{ display: "block" }}>Intelligence that</span>
                <span style={{ display: "block" }}>never breaks your gaze.</span>
              </h3>
              <p
                style={{
                  fontSize: "clamp(14px, 1.4vw, 16px)",
                  fontWeight: 300,
                  letterSpacing: "-0.012em",
                  lineHeight: 1.5,
                  color: "#8a8a8a",
                  marginBottom: 26,
                  wordBreak: "keep-all",
                }}
              >
                작품을 보는 시선을 끊지 않는 인텔리전스.
              </p>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: "#c8c8c8",
                  marginBottom: 8,
                  fontWeight: 300,
                }}
              >
                Audio guides, QR scans, and mobile apps all interrupt the act
                of looking. AXVELA VIEW works within your line of sight — ask
                by voice and get answers instantly, without ever taking your
                eyes off the work.
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.85,
                  color: "#8a8a8a",
                  marginBottom: 22,
                  fontWeight: 300,
                  wordBreak: "keep-all",
                }}
              >
                기존의 음성 가이드·QR 스캔·모바일 앱은 모두 관람의 흐름을
                끊습니다. AXVELA VIEW는 시야 안에서 작동합니다. 작품에서
                눈을 떼지 않은 채, 음성으로 묻고 즉시 답을 받습니다.
              </p>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: "#c8c8c8",
                  marginBottom: 8,
                  fontWeight: 300,
                }}
              >
                Artist, period, material, market value, visitor response, and
                comparable works surface right where your eyes rest. Visible
                when you want them, gone when you focus.
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.85,
                  color: "#8a8a8a",
                  margin: 0,
                  fontWeight: 300,
                  wordBreak: "keep-all",
                }}
              >
                작가·시대·재료·시장 가격·관람객 반응·유사 작품 비교가
                시선이 닿는 곳에 자연스럽게 떠오릅니다. 보고 싶을 때 보이고,
                집중할 때 사라집니다.
              </p>
            </div>
          </Fade>
        </div>

        {/* ── Core Capabilities (3-feature grid with full copy) ── */}
        <div
          style={{
            paddingTop: "clamp(48px, 6vw, 72px)",
            borderTop: "1px solid #1a1a1a",
          }}
        >
          <Fade>
            <Label light>Core Capabilities</Label>
            <h3
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 500,
                letterSpacing: "-0.024em",
                lineHeight: 1.25,
                marginTop: 18,
                marginBottom: 10,
                color: "#fff",
                maxWidth: 640,
              }}
            >
              Built on three core capabilities.
            </h3>
            <p
              style={{
                fontSize: "clamp(14px, 1.4vw, 16px)",
                fontWeight: 300,
                letterSpacing: "-0.012em",
                lineHeight: 1.5,
                color: "#8a8a8a",
                marginBottom: "clamp(40px, 5vw, 56px)",
                wordBreak: "keep-all",
              }}
            >
              세 가지 핵심 기술로 작동합니다.
            </p>
          </Fade>

          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: "clamp(32px, 4vw, 56px)" }}
          >
            {AI_GLASS_FEATURES.map((feature, i) => (
              <Fade key={feature.title} delay={i * 80}>
                <div>
                  <p
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 11,
                      letterSpacing: "0.20em",
                      color: "#c4a96e",
                      fontWeight: 500,
                      marginBottom: 18,
                    }}
                  >
                    {feature.num}
                  </p>
                  <h4
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "-0.018em",
                      marginBottom: 6,
                    }}
                  >
                    {feature.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#888",
                      letterSpacing: "0.01em",
                      marginBottom: 20,
                    }}
                  >
                    {feature.subtitle}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.8,
                      color: "#b0b0b0",
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   3.6  AXVELA PASSPORT
════════════════════════════════════════ */
const AXVELA_ID_FLOW = [
  {
    num: "01",
    title: "SCAN",
    sub: "Capture the truth",
    body: "LiDAR와 미세 표면 분석으로 붓터치·재질·균열을 읽어 작품의 물리적 지문과 광학 실재성(PUF)을 생성합니다.",
  },
  {
    num: "02",
    title: "ID",
    sub: "Create the immutable identity",
    body: "지문과 PUF가 암호학적으로 결합해 단 하나의 AXVELA ID가 됩니다. 영구 불변·append-only 기록으로 위작 재세탁을 차단합니다.",
  },
  {
    num: "03",
    title: "AI",
    sub: "Intelligence & trust engine",
    body: "ID를 중심으로 진위·provenance·상태 변화·리스크를 분석하는 기관용 신뢰 엔진. 사진이 아니라 시간 속 실물 객체를 이해합니다.",
  },
  {
    num: "04",
    title: "Gallery System",
    sub: "Operate. Manage. Trust.",
    body: "갤러리·미술관·경매·보험이 모두 하나의 ID를 기준으로 등록·소유권 이전·전시·증명서 발급을 연결합니다.",
  },
];

const PASSPORT_PILLARS = [
  {
    num: "01",
    title: "AXID · Unique ID",
    sub: "평생 동일한 고유 일련번호",
    body: "AXP-YYYY-XXXXXX · one ID for life",
    confirm: true,
  },
  {
    num: "02",
    title: "Verified by AXVELA",
    sub: "트러스트 스코어 + 9단계 타임라인",
    body: "Trust Score + 9-stage timeline",
  },
  {
    num: "03",
    title: "Document Trust Layer",
    sub: "변조 불가능한 영구 기록",
    body: "Tamper-proof, permanently retained",
    confirm: true,
  },
];

function AxvelaID() {
  return (
    <section
      id="id"
      style={{
        background: "var(--surface)",
        padding: "clamp(80px, 12vw, 140px) clamp(20px, 4vw, 32px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <Label>The Root Identity</Label>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.032em",
              lineHeight: 1.1,
              marginTop: 18,
              marginBottom: 14,
              color: "var(--fg)",
              maxWidth: 880,
            }}
          >
            The immutable identity of real-world assets.
          </h2>
          <p
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "var(--body)",
              maxWidth: 720,
              marginBottom: "clamp(48px, 6vw, 72px)",
              wordBreak: "keep-all",
            }}
          >
            실물 자산의 영구적 신원.
          </p>
        </Fade>

        {/* AXVELA ID infographic — SCAN → ID → AI → Gallery System + Ledger */}
        <Fade delay={120}>
          <div
            style={{
              marginBottom: "clamp(48px, 6vw, 72px)",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "#fafafa",
                boxShadow:
                  "0 30px 80px -30px rgba(0,0,0,0.18), 0 12px 32px -12px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1536 / 1024",
                }}
              >
                <Image
                  src="/images/axvela-id.png"
                  alt="AXVELA ID 인포그래픽 — SCAN, AI, Gallery System, Ledger가 연결된 실물 자산의 영구 식별 시스템과 적용 산업"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  quality={95}
                  unoptimized
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </Fade>

        {/* Lead — EN main / KO sub (Passport lead pattern) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "clamp(28px, 4vw, 56px)",
            marginBottom: "clamp(56px, 7vw, 88px)",
          }}
        >
          <Fade delay={160}>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "var(--body)",
                margin: 0,
                maxWidth: 520,
              }}
            >
              AXVELA ID is the root identity a physical asset generates for
              itself — not a QR code or a paper certificate, but an identifier
              born from the object&rsquo;s own physical and optical signature.
            </p>
          </Fade>
          <Fade delay={220}>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.95,
                color: "var(--body)",
                margin: 0,
                maxWidth: 520,
                wordBreak: "keep-all",
              }}
            >
              AXVELA ID는 작품이 스스로 생성하는 근원 정체성입니다. QR 코드나
              종이 증명서가 아니라, 객체 고유의 물리적·광학적 시그니처에서
              태어나는 식별자입니다.
            </p>
          </Fade>
        </div>

        {/* Four-step flow cards — SCAN → ID → AI → Gallery System */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
          style={{ gap: "clamp(16px, 2vw, 20px)" }}
        >
          {AXVELA_ID_FLOW.map((step, i) => (
            <Fade key={step.title} delay={i * 80}>
              <div
                style={{
                  position: "relative",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "36px 28px",
                  height: "100%",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "#C4A96E",
                  }}
                />
                <p
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    letterSpacing: "0.20em",
                    color: "#c4a96e",
                    fontWeight: 500,
                    marginBottom: 18,
                    marginTop: 6,
                  }}
                >
                  {step.num}
                </p>
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: "var(--fg)",
                    letterSpacing: "-0.018em",
                    marginBottom: 6,
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    letterSpacing: "0.01em",
                    marginBottom: 18,
                    wordBreak: "keep-all",
                  }}
                >
                  {step.sub}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--body)",
                    lineHeight: 1.7,
                    margin: 0,
                    wordBreak: "keep-all",
                  }}
                >
                  {step.body}
                </p>
              </div>
            </Fade>
          ))}
        </div>

        {/* Closing line — transitions naturally into Passport */}
        <Fade delay={360}>
          <div
            style={{
              marginTop: "clamp(56px, 7vw, 88px)",
              paddingTop: "clamp(36px, 5vw, 56px)",
              borderTop: "1px solid var(--border)",
              maxWidth: 820,
            }}
          >
            <p
              style={{
                fontSize: "clamp(22px, 2.6vw, 30px)",
                fontWeight: 500,
                letterSpacing: "-0.022em",
                lineHeight: 1.3,
                color: "var(--fg)",
                marginBottom: 12,
              }}
            >
              From object to identity. From possession to proof.
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.85,
                color: "var(--body)",
                margin: 0,
                wordBreak: "keep-all",
              }}
            >
              객체에서 정체성으로. 소유에서 증명으로.
            </p>
          </div>
        </Fade>
      </div>
    </section>
  );
}

function Passport() {
  return (
    <section
      id="passport"
      style={{
        background: "#fff",
        padding: "clamp(80px, 12vw, 140px) clamp(20px, 4vw, 32px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Fade>
          <Label>The Infrastructure</Label>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.032em",
              lineHeight: 1.1,
              marginTop: 18,
              marginBottom: 14,
              color: "var(--fg)",
              maxWidth: 820,
            }}
          >
            One Passport. Every asset.
          </h2>
          <p
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "var(--body)",
              maxWidth: 720,
              marginBottom: 44,
              wordBreak: "keep-all",
            }}
          >
            하나의 여권, 모든 자산.
          </p>
        </Fade>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "clamp(28px, 4vw, 56px)",
            marginBottom: "clamp(56px, 7vw, 88px)",
          }}
        >
          <Fade delay={80}>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "var(--body)",
                margin: 0,
                maxWidth: 520,
              }}
            >
              Every work AXVELA touches receives an AXID — a permanent identifier
              it keeps for life. Around it, the Passport assembles a verifiable,
              time-stamped record: a trust score and a nine-stage timeline from
              capture through verification, exhibition, transaction, shipping,
              and collection.
            </p>
          </Fade>
          <Fade delay={160}>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.95,
                color: "var(--body)",
                margin: 0,
                maxWidth: 520,
                wordBreak: "keep-all",
              }}
            >
              AXVELA가 다루는 모든 작품은 평생 유지되는 고유 식별자 AXID를
              받습니다. 그 위에 Passport가 검증 가능한 시계열 기록을 쌓습니다 —
              트러스트 스코어, 그리고 캡처·검증·전시·거래·배송·소장에 이르는
              9단계 타임라인.
            </p>
          </Fade>
        </div>

        {/* Passport visual — closed card, opened Overview, AI analysis panel */}
        <Fade delay={120}>
          <div
            style={{
              marginBottom: "clamp(56px, 7vw, 88px)",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "#fafafa",
                boxShadow:
                  "0 30px 80px -30px rgba(0,0,0,0.18), 0 12px 32px -12px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1536 / 1024",
                }}
              >
                <Image
                  src="/images/passport.png"
                  alt="AXVELA Passport — 닫힌 여권 카드, 펼친 Overview 화면, AI 분석 패널로 자산의 AXID와 9단계 타임라인을 보여주는 인터페이스"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  quality={95}
                  unoptimized
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </Fade>

        {/* Three pillars */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "clamp(16px, 2vw, 20px)" }}
        >
          {PASSPORT_PILLARS.map((p, i) => (
            <Fade key={p.title} delay={i * 80}>
              <div
                style={{
                  position: "relative",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "36px 32px",
                  height: "100%",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "#C4A96E",
                  }}
                />
                <p
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    letterSpacing: "0.20em",
                    color: "#c4a96e",
                    fontWeight: 500,
                    marginBottom: 18,
                    marginTop: 6,
                  }}
                >
                  {p.num}
                </p>
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: "var(--fg)",
                    letterSpacing: "-0.018em",
                    marginBottom: 6,
                  }}
                >
                  {p.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    letterSpacing: "0.01em",
                    marginBottom: 18,
                    wordBreak: "keep-all",
                  }}
                >
                  {p.sub}
                </p>
                <p
                  style={{
                    fontFamily: p.num === "01"
                      ? "ui-monospace, SFMono-Regular, Menlo, monospace"
                      : "inherit",
                    fontSize: p.num === "01" ? 13 : 14,
                    color: "var(--body)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {p.body}
                </p>
                {p.confirm && (
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase" as const,
                      color: "#b8b8b8",
                      marginTop: 20,
                      paddingTop: 16,
                      borderTop: "1px solid var(--border)",
                      fontWeight: 500,
                    }}
                  >
                    Pending publication review
                  </p>
                )}
              </div>
            </Fade>
          ))}
        </div>

        {/* Closing line */}
        <Fade delay={300}>
          <div
            style={{
              marginTop: "clamp(56px, 7vw, 88px)",
              paddingTop: "clamp(36px, 5vw, 56px)",
              borderTop: "1px solid var(--border)",
              maxWidth: 820,
            }}
          >
            <p
              style={{
                fontSize: "clamp(22px, 2.6vw, 30px)",
                fontWeight: 500,
                letterSpacing: "-0.022em",
                lineHeight: 1.3,
                color: "var(--fg)",
                marginBottom: 12,
              }}
            >
              This is the moat. Models can be rebuilt. Time cannot.
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.85,
                color: "var(--body)",
                margin: 0,
                wordBreak: "keep-all",
              }}
            >
              이것이 해자입니다. 모델은 다시 만들 수 있지만, 시간은 다시 만들
              수 없습니다.
            </p>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   3.9  PATENT PORTFOLIO — Reality State Preservation
════════════════════════════════════════ */
const RSP_FLOW = [
  { num: "01", title: "Observe",    sub: "다중 센서 관측" },
  { num: "02", title: "Infer",      sub: "상태 추론" },
  { num: "03", title: "Preserve",   sub: "불확실성 보존" },
  { num: "04", title: "Lineage",    sub: "증거 귀속" },
  { num: "05", title: "Reconstruct", sub: "의도 기반 재구성" },
];

const RSP_PILLARS = [
  {
    num: "01",
    title: "Uncertainty Preservation",
    sub: "불확실성 보존",
    body: "불확실성을 폐기하지 않고 저장, Explicit Unknown 유지.",
  },
  {
    num: "02",
    title: "Evidence-grounded Reconstruction",
    sub: "근거 기반 재구성",
    body: "hallucination 방지, 증거 기반으로만 재구성.",
  },
  {
    num: "03",
    title: "Explicit Unknown",
    sub: "명시적 미지 표현",
    body: "미관측 영역은 “모른다”를 구조적으로 표현.",
  },
  {
    num: "04",
    title: "Selective Re-inference",
    sub: "선택적 재추론",
    body: "lineage 기반 부분 갱신 가능.",
  },
];

const RSP_PATENTS = [
  {
    no: "ZDP253037",
    title: "디지털 트윈 환경의 미술품 상태 모니터링 시스템 및 방법",
    linked: "AXVELA SCAN",
  },
  {
    no: "ZDP253038",
    title: "AI 기반 미술품 진품 판별 단계적 분석 방법·장치",
    linked: "AXVELA AI",
  },
  {
    no: "ZDP253039",
    title: "블록체인 기반 미술품 안전거래 플랫폼 방법·시스템",
    linked: "AXVELA Gallery",
  },
  {
    no: "ZDP253040",
    title: "사용자 경험 기반 아트페어 가이드 제공 방법·장치",
    linked: "AXVELA Viewer",
  },
];

function PatentPortfolio() {
  return (
    <section
      id="patents"
      style={{
        background: "var(--dark-bg)",
        color: "var(--dark-fg)",
        padding: "clamp(80px, 12vw, 140px) clamp(20px, 4vw, 32px)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ── Block 0 · Section header ── */}
        <Fade>
          <Label light>Patent Portfolio</Label>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.032em",
              lineHeight: 1.1,
              marginTop: 18,
              marginBottom: 14,
              color: "#fff",
              maxWidth: 820,
            }}
          >
            Reality State Preservation
          </h2>
          <p
            style={{
              fontSize: "clamp(18px, 2vw, 22px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "#b8b8b8",
              maxWidth: 720,
              marginBottom: 44,
              wordBreak: "keep-all",
            }}
          >
            현실 상태 보존 인프라.
          </p>
        </Fade>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "clamp(28px, 4vw, 56px)",
            marginBottom: "clamp(64px, 8vw, 96px)",
          }}
        >
          <Fade delay={80}>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: "#c8c8c8",
                margin: 0,
                fontWeight: 300,
                maxWidth: 520,
              }}
            >
              We don&rsquo;t store files. We preserve reconstructable reality
              states.
            </p>
          </Fade>
          <Fade delay={160}>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.95,
                color: "#8a8a8a",
                margin: 0,
                fontWeight: 300,
                maxWidth: 520,
                wordBreak: "keep-all",
              }}
            >
              우리는 파일이 아니라, 재구성 가능한 현실 상태를 보존합니다.
            </p>
          </Fade>
        </div>

        {/* ── Block 1 · 5-step Reality State Preservation flow ── */}
        <Fade delay={120}>
          <div
            style={{
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.015)",
              padding: "clamp(28px, 4vw, 44px) clamp(20px, 3vw, 36px)",
              marginBottom: "clamp(40px, 5vw, 56px)",
            }}
          >
            <div
              className="flex flex-col md:flex-row md:items-center"
              style={{
                gap: "clamp(20px, 2vw, 28px)",
              }}
            >
              {/* Left label — REALITY */}
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase" as const,
                    color: "#c4a96e",
                    fontWeight: 500,
                  }}
                >
                  Reality
                </span>
              </div>

              {/* 5 nodes */}
              <div
                className="flex flex-col md:flex-row md:items-stretch"
                style={{
                  flex: 1,
                  gap: "clamp(14px, 1.6vw, 20px)",
                  position: "relative",
                }}
              >
                {RSP_FLOW.map((n, i) => (
                  <div
                    key={n.num}
                    className="flex flex-row md:flex-col md:items-start items-center"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      gap: 12,
                      position: "relative",
                    }}
                  >
                    {/* node */}
                    <div
                      style={{
                        flex: 1,
                        border: "1px solid rgba(196,169,110,0.30)",
                        borderRadius: 10,
                        padding: "14px 14px",
                        background: "rgba(196,169,110,0.04)",
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      <p
                        style={{
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                          fontSize: 11,
                          letterSpacing: "0.22em",
                          color: "#c4a96e",
                          fontWeight: 500,
                          marginBottom: 6,
                        }}
                      >
                        {n.num}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fff",
                          letterSpacing: "-0.012em",
                          marginBottom: 4,
                        }}
                      >
                        {n.title}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#9a9a9a",
                          lineHeight: 1.6,
                          margin: 0,
                          fontWeight: 300,
                          wordBreak: "keep-all",
                        }}
                      >
                        {n.sub}
                      </p>
                    </div>

                    {/* connector — gold line between nodes */}
                    {i < RSP_FLOW.length - 1 && (
                      <>
                        {/* desktop: horizontal line to the right of the node */}
                        <span
                          aria-hidden="true"
                          className="hidden md:block"
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "calc(-1 * clamp(14px, 1.6vw, 20px))",
                            width: "clamp(14px, 1.6vw, 20px)",
                            height: 1,
                            background: "rgba(196,169,110,0.45)",
                          }}
                        />
                        {/* mobile: vertical chevron between stacked nodes */}
                        <span
                          aria-hidden="true"
                          className="md:hidden"
                          style={{
                            display: "block",
                            textAlign: "center",
                            color: "rgba(196,169,110,0.55)",
                            fontSize: 12,
                            lineHeight: 1,
                            margin: "2px 0",
                          }}
                        >
                          ↓
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Right label — RECONSTRUCTABLE STATE */}
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase" as const,
                    color: "#c4a96e",
                    fontWeight: 500,
                    textAlign: "right",
                    wordBreak: "keep-all",
                  }}
                >
                  Reconstructable State
                </span>
              </div>
            </div>
          </div>
        </Fade>

        {/* Core quote */}
        <Fade delay={160}>
          <div
            style={{
              maxWidth: 820,
              marginBottom: "clamp(72px, 9vw, 104px)",
              paddingLeft: "clamp(16px, 2vw, 22px)",
              borderLeft: "2px solid #c4a96e",
            }}
          >
            <p
              style={{
                fontSize: "clamp(17px, 1.9vw, 21px)",
                fontWeight: 300,
                letterSpacing: "-0.012em",
                lineHeight: 1.55,
                color: "#e6e6e6",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;AXVELA neither collapses uncertainty into false certainty,
              nor fabricates detail into false reality.&rdquo;
            </p>
          </div>
        </Fade>

        {/* ── Block 2 · 4 Core Pillars ── */}
        <div
          style={{
            paddingTop: "clamp(40px, 5vw, 64px)",
            borderTop: "1px solid #1a1a1a",
            marginBottom: "clamp(64px, 8vw, 96px)",
          }}
        >
          <Fade>
            <h3
              style={{
                fontSize: "clamp(20px, 2.4vw, 28px)",
                fontWeight: 500,
                letterSpacing: "-0.022em",
                lineHeight: 1.3,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Four core pillars.
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#888",
                letterSpacing: "0.01em",
                marginBottom: "clamp(36px, 5vw, 56px)",
                wordBreak: "keep-all",
              }}
            >
              네 가지 핵심 축.
            </p>
          </Fade>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            style={{ gap: "clamp(16px, 2vw, 20px)" }}
          >
            {RSP_PILLARS.map((p, i) => (
              <Fade key={p.title} delay={i * 80}>
                <div
                  style={{
                    position: "relative",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "36px 28px",
                    height: "100%",
                    background: "rgba(255,255,255,0.015)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "#C4A96E",
                    }}
                  />
                  <p
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 11,
                      letterSpacing: "0.20em",
                      color: "#c4a96e",
                      fontWeight: 500,
                      marginBottom: 18,
                      marginTop: 6,
                    }}
                  >
                    {p.num}
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "-0.018em",
                      marginBottom: 6,
                    }}
                  >
                    {p.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#9a9a9a",
                      letterSpacing: "0.01em",
                      marginBottom: 16,
                      wordBreak: "keep-all",
                    }}
                  >
                    {p.sub}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#c8c8c8",
                      lineHeight: 1.7,
                      margin: 0,
                      fontWeight: 300,
                      wordBreak: "keep-all",
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              </Fade>
            ))}
          </div>
        </div>

        {/* ── Block 3 · 4 Filed Patents ── */}
        <div
          style={{
            paddingTop: "clamp(40px, 5vw, 64px)",
            borderTop: "1px solid #1a1a1a",
            marginBottom: "clamp(64px, 8vw, 96px)",
          }}
        >
          <Fade>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                gap: "10px 20px",
                marginBottom: 8,
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(20px, 2.4vw, 28px)",
                  fontWeight: 500,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.3,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Patents Filed.
              </h3>
              <span
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase" as const,
                  color: "#c4a96e",
                  fontWeight: 500,
                }}
              >
                Filed · 출원 완료
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#888",
                letterSpacing: "0.01em",
                marginBottom: "clamp(36px, 5vw, 56px)",
                wordBreak: "keep-all",
              }}
            >
              출원 특허 4건.
            </p>
          </Fade>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            style={{ gap: "clamp(16px, 2vw, 20px)" }}
          >
            {RSP_PATENTS.map((p, i) => (
              <Fade key={p.no} delay={i * 80}>
                <div
                  style={{
                    position: "relative",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "36px 28px",
                    height: "100%",
                    background: "rgba(255,255,255,0.015)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "#C4A96E",
                    }}
                  />
                  <p
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 11,
                      letterSpacing: "0.20em",
                      color: "#c4a96e",
                      fontWeight: 500,
                      marginBottom: 18,
                      marginTop: 6,
                    }}
                  >
                    {p.no}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "-0.012em",
                      lineHeight: 1.5,
                      marginBottom: 16,
                      wordBreak: "keep-all",
                      flex: 1,
                    }}
                  >
                    {p.title}
                  </p>
                  <div
                    style={{
                      paddingTop: 14,
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase" as const,
                        color: "#888",
                        margin: "0 0 4px",
                        fontWeight: 500,
                      }}
                    >
                      Linked to
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#c8c8c8",
                        margin: 0,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {p.linked}
                    </p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>

        {/* ── Block 4 · Cluster strategy + closing line ── */}
        <div
          style={{
            paddingTop: "clamp(40px, 5vw, 64px)",
            borderTop: "1px solid #1a1a1a",
          }}
        >
          <Fade>
            <p
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "#c4a96e",
                fontWeight: 500,
                marginBottom: 18,
              }}
            >
              Cluster Strategy
            </p>
            <p
              style={{
                fontSize: "clamp(16px, 1.8vw, 19px)",
                lineHeight: 1.7,
                color: "#c8c8c8",
                fontWeight: 300,
                marginBottom: 18,
                maxWidth: 880,
                wordBreak: "keep-all",
              }}
            >
              <span style={{ color: "#e6e6e6" }}>
                Reality State Preservation + Identity + Evidence Lineage +
                Temporal Drift + Trust Infrastructure
              </span>
              {" "}— 단일 특허가 아닌 특허 클러스터로 장기 진입장벽을
              구축합니다.
            </p>
          </Fade>

          <Fade delay={140}>
            <div
              style={{
                marginTop: "clamp(40px, 5vw, 64px)",
                paddingTop: "clamp(28px, 3.5vw, 40px)",
                borderTop: "1px solid #1a1a1a",
                maxWidth: 820,
              }}
            >
              <p
                style={{
                  fontSize: "clamp(22px, 2.6vw, 30px)",
                  fontWeight: 500,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.3,
                  color: "#fff",
                  margin: 0,
                }}
              >
                We preserve reality, not files.
              </p>
            </div>
          </Fade>
        </div>
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
      name: "AXVELA SCAN",
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
      name: "AXVELA DRONE",
      tag: "Aerial Scanning",
      desc: "Autonomous aerial scanning for large-scale works, outdoor sculptures, murals, and architectural cultural assets — capturing every dimension.",
    },
    {
      src: "/images/bot.jpg",
      name: "AXVELA ROBOT",
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
              marginBottom: 10,
              color: "var(--fg)",
            }}
          >
            Infrastructure that feeds AXVELA AI.
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "var(--muted)",
              marginBottom: 22,
              wordBreak: "keep-all",
            }}
          >
            AXVELA AI를 키우는 인프라.
          </p>
          <p
            style={{
              fontSize: 16,
              color: "var(--body)",
              maxWidth: 560,
              marginBottom: 64,
              lineHeight: 1.75,
            }}
          >
            AXVELA SCAN, Mobile Scan Lab, AXVELA DRONE, and AXVELA ROBOT are not separate products.
            They are the physical intelligence layer — generating the verified real-world
            data that AXVELA AI learns from and operates on.
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
              marginBottom: 12,
              color: "#fff",
              maxWidth: 700,
              lineHeight: 1.13,
            }}
          >
            <span style={{ display: "block" }}>An AI technology company</span>
            <span style={{ display: "block" }}>building cultural intelligence infrastructure.</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "#8a8a8a",
              marginBottom: 48,
              maxWidth: 700,
              wordBreak: "keep-all",
            }}
          >
            문화 인텔리전스 인프라를 만드는 AI 기술 기업.
          </p>
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
              financial markets — and AXVELA AI is how we get there.&rdquo;
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
              AXVELA AI as the canonical intelligence infrastructure for the global
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
              { label: "Core Product", value: "AXVELA AI" },
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
              marginBottom: 10,
              color: "var(--fg)",
            }}
          >
            Founder &amp; Team
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              fontWeight: 300,
              letterSpacing: "-0.012em",
              lineHeight: 1.5,
              color: "var(--muted)",
              marginBottom: 64,
              wordBreak: "keep-all",
            }}
          >
            창업자 및 팀
          </p>
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
              ["Thesis", "#thesis"],
              ["AXVELA AI", "#axvela"],
              ["AXVELA VIEW", "#ai-glass"],
              ["Passport", "#passport"],
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
        <Thesis />
        <AxvelaOverview />
        <WhyAxvela />
        <AIGlass />
        <AxvelaID />
        <Passport />
        <PatentPortfolio />
        <Ecosystem />
        <About />
        <Team />
      </main>
      <Footer />
    </>
  );
}
