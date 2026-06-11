import ChatConsole from "./ChatConsole";

export default function Hero() {
  return (
    <header className="hero" id="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="hero-tag rv">
              <span className="dot" />
              ArtXpark · Physical Asset Intelligence Infrastructure
            </div>
            <h1>
              <span className="hl">
                <span>AI generates.</span>
              </span>
              <span className="hl">
                <span>
                  <em>AXVELA</em> verifies.
                </span>
              </span>
            </h1>
            <div className="ko rv">AI가 만들고, AXVELA가 검증한다.</div>
            <p className="desc rv">
              AXVELA is the data infrastructure for physical cultural assets —
              connecting their state, movement, culture, and transactions into a
              single, verifiable record.
              <br />
              <br />
              AXVELA는 실물 문화 자산의 상태·이동·문화·거래를 하나의 검증 가능한
              기록으로 잇는 데이터 인프라입니다.
            </p>
            <a className="hero-cta rv" href="#thesis">
              Explore the infrastructure <span>↓</span>
            </a>
          </div>

          <ChatConsole />
        </div>

        <div className="hero-flow rv">
          <span className="cap">Macro Flow</span>
          <span className="fl">Physical Asset</span>
          <span className="ar">→</span>
          <span className="fl">Data</span>
          <span className="ar">→</span>
          <span className="fl">AI</span>
          <span className="ar">→</span>
          <span className="fl">Assetization</span>
        </div>
      </div>
    </header>
  );
}
