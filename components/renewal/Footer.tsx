import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-sign rv">
          <div className="en shimmer">We preserve reality, not files.</div>
          <div className="ko">우리는 파일이 아니라, 현실을 보존합니다</div>
        </div>
      </div>
      <div className="wrap foot-inner">
        <div>
          <Image
            className="foot-brand-img"
            src="/images/renewal/wordmark-white.png"
            alt="ArtXpark"
            width={1223}
            height={301}
            loading="lazy"
          />
          <div className="foot-line">
            Physical Asset Intelligence Infrastructure
          </div>
        </div>
        <div className="foot-links">
          <a href="#thesis">Thesis</a>
          <a href="#gallery-system">Gallery System</a>
          <a href="#axvela-ai">AXVELA AI</a>
          <a href="#scan">SCAN</a>
          <a href="#view">VIEW</a>
          <a href="#museum">Museum</a>
          <a href="#passport">Passport</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="foot-copy">
          주식회사 아트엑스파크 (ArtXpark Inc.) · © 2026 ArtXpark Inc. All rights
          reserved. · Seoul, Republic of Korea
        </div>
      </div>
    </footer>
  );
}
