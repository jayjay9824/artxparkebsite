"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Hero analysis console: looping playback (play → hold → instant reset → replay)
 *  plus a pointer-driven 3D tilt on fine pointers. Ported from the concept's
 *  vanilla logic with full listener/timer/rAF cleanup. */
export default function ChatConsole() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatCard = cardRef.current;
    const chatScene = sceneRef.current;
    if (!chatCard) return;

    let chatInView = false;
    let chatRunning = false;
    let chatTimer: ReturnType<typeof setTimeout> | null = null;
    const chatReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const CYCLE_HOLD = 5600; // ms to hold the finished state
    const SEQ_LEN = 4600; // ms until sequence finishes

    const chatPlayOnce = () => {
      chatCard.classList.remove("noanim");
      chatCard.classList.add("play");
    };
    const chatResetInstant = () => {
      chatCard.classList.add("noanim");
      chatCard.classList.remove("play");
      void chatCard.offsetWidth; // reflow to apply reset
    };
    const chatCycle = () => {
      if (!chatInView) {
        chatRunning = false;
        return;
      }
      chatRunning = true;
      chatResetInstant();
      requestAnimationFrame(() => requestAnimationFrame(chatPlayOnce));
      chatTimer = setTimeout(chatCycle, SEQ_LEN + CYCLE_HOLD);
    };

    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          chatInView = e.isIntersecting;
          if (chatInView && !chatRunning) {
            if (chatReduce) {
              chatCard.classList.add("play");
              chatRunning = true;
            } else {
              chatCycle();
            }
          }
          if (!chatInView && !chatReduce) {
            if (chatTimer) clearTimeout(chatTimer);
            chatRunning = false;
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(chatCard);

    // pointer tilt (fine pointers only, respects reduced motion)
    let raf: number | null = null;
    let tRX = 0,
      tRY = 0,
      cRX = 0,
      cRY = 0;
    const tiltLoop = () => {
      cRX += (tRX - cRX) * 0.1;
      cRY += (tRY - cRY) * 0.1;
      chatCard.style.transform = `rotateX(${cRX.toFixed(
        2
      )}deg) rotateY(${cRY.toFixed(2)}deg)`;
      if (Math.abs(tRX - cRX) > 0.01 || Math.abs(tRY - cRY) > 0.01)
        raf = requestAnimationFrame(tiltLoop);
      else raf = null;
    };
    const onMove = (e: PointerEvent) => {
      if (!chatScene) return;
      const r = chatScene.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tRY = nx * 10;
      tRX = -ny * 8;
      if (!raf) raf = requestAnimationFrame(tiltLoop);
    };
    const onLeave = () => {
      tRX = 0;
      tRY = 0;
      if (!raf) raf = requestAnimationFrame(tiltLoop);
    };
    const canTilt =
      window.matchMedia("(pointer:fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canTilt && chatScene) {
      chatScene.addEventListener("pointermove", onMove);
      chatScene.addEventListener("pointerleave", onLeave);
    }

    return () => {
      io.disconnect();
      if (chatTimer) clearTimeout(chatTimer);
      if (raf) cancelAnimationFrame(raf);
      if (chatScene) {
        chatScene.removeEventListener("pointermove", onMove);
        chatScene.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  return (
    <div className="chat-scene rv" id="chatScene" ref={sceneRef}>
      <div className="chat-card" id="chatCard" ref={cardRef}>
        <span className="tick tl">
          <i />
          <i />
        </span>
        <span className="tick tr">
          <i />
          <i />
        </span>
        <span className="tick bl">
          <i />
          <i />
        </span>
        <span className="tick br">
          <i />
          <i />
        </span>

        <div className="chat-head">
          <Image
            src="/images/renewal/axvela-logo-white.png"
            alt="AXVELA"
            width={700}
            height={700}
            priority
          />
          <span className="tt">Cultural Intelligence Assistant</span>
          <span className="live">
            <span className="dot" />
            LIVE
          </span>
        </div>

        <div className="chat-body">
          <div className="cmsg art">
            <Image
              src="/images/renewal/fujiwara-whos-iconic.jpg"
              alt="Simon Fujiwara, Who's Iconic? (Spanish Identity), 2022 — charcoal, pastel and ink on canvas, framed"
              width={720}
              height={848}
              priority
            />
            <div className="art-overlay">
              <div className="grid" />
              <div className="sweep" />
              <span className="corner c-tl" />
              <span className="corner c-tr" />
              <span className="corner c-bl" />
              <span className="corner c-br" />
              <span className="fp" style={{ top: "24%", left: "30%" }} />
              <span className="fp" style={{ top: "46%", left: "64%" }} />
              <span className="fp" style={{ top: "68%", left: "38%" }} />
              <span className="rtag">ANALYZING · 4K</span>
              <span className="btag">FP 1,204 · 0.38s</span>
            </div>
          </div>
          <div className="cmsg user">이 작품에 대해 설명해줘</div>
          <div className="typing">
            <i />
            <i />
            <i />
          </div>
          <div className="cmsg ai">
            <div className="ai-tag">
              AXVELA AI<span className="ms">0.38s</span>
            </div>
            <div className="conf">
              <span className="ck">Match</span>
              <span className="bar">
                <i />
              </span>
              <span className="cv">98.2%</span>
            </div>
            <div className="ai-rows">
              <div className="r">
                <span className="k">Title</span>
                <span className="v">Who&apos;s Iconic? (Spanish Identity)</span>
              </div>
              <div className="r">
                <span className="k">Artist</span>
                <span className="v">Simon Fujiwara</span>
              </div>
              <div className="r">
                <span className="k">Year</span>
                <span className="v">2022</span>
              </div>
              <div className="r">
                <span className="k">Medium</span>
                <span className="v">Charcoal, pastel and ink on canvas</span>
              </div>
              <div className="r">
                <span className="k">Size</span>
                <span className="v">50.3 × 40.1 cm (unframed)</span>
              </div>
              <div className="r">
                <span className="k">Style</span>
                <span className="v">
                  Contemporary portraiture — identity, image construction,
                  visual symbolism
                </span>
              </div>
            </div>
            <p className="interp">
              이미지를 통해 구성되는 정체성에 대한 후지와라의 탐구가 담긴
              작품입니다. 해체된 얼굴의 형상, 즉흥적인 먹선과 원색의 색면,
              그리고 &quot;Who?&quot;라는 물음은 정체성이 고정된 실재가 아니라
              표상과 인식으로 만들어진다는 것을 시사합니다. 이 해석은 AXVELA가 더
              넓은 문화 데이터와 실물 스캔 기록을 학습할수록 정교해집니다.
            </p>
          </div>
        </div>
        <div className="chat-input">
          Ask about any artwork…<span className="up">↑</span>
        </div>
      </div>
    </div>
  );
}
