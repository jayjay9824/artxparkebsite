export default function Patents() {
  return (
    <section id="patents">
      <div className="wrap">
        <div className="eyebrow rv">Patent Portfolio</div>
        <h2 className="display rv">
          Reality State <em>Preservation.</em>
        </h2>
        <div className="sub-ko rv">현실 상태 보존 인프라.</div>
        <p className="lede rv">
          We don’t store files. We preserve reconstructable reality states.
          <br />
          우리는 파일이 아니라, 재구성 가능한 현실 상태를 보존합니다.
        </p>

        <div className="flow-chain rv">
          <div className="fc">
            <div className="num">01</div>
            <h5>Observe</h5>
            <p>다중 센서 관측</p>
          </div>
          <div className="fc">
            <div className="num">02</div>
            <h5>Infer</h5>
            <p>상태 추론</p>
          </div>
          <div className="fc">
            <div className="num">03</div>
            <h5>Preserve</h5>
            <p>불확실성 보존</p>
          </div>
          <div className="fc">
            <div className="num">04</div>
            <h5>Lineage</h5>
            <p>증거 귀속</p>
          </div>
          <div className="fc">
            <div className="num">05</div>
            <h5>Reconstruct</h5>
            <p>의도 기반 재구성</p>
          </div>
        </div>

        <div className="patent-list rv">
          <div className="pt-row">
            <span className="id">ZDP253037</span>
            <span className="nm">
              디지털 트윈 환경의 미술품 상태 모니터링 시스템 및 방법
            </span>
            <span className="lk">AXVELA SCAN</span>
          </div>
          <div className="pt-row">
            <span className="id">ZDP253038</span>
            <span className="nm">
              AI 기반 미술품 진품 판별 단계적 분석 방법·장치
            </span>
            <span className="lk">AXVELA AI</span>
          </div>
          <div className="pt-row">
            <span className="id">ZDP253039</span>
            <span className="nm">
              블록체인 기반 미술품 안전거래 플랫폼 방법·시스템
            </span>
            <span className="lk">AXVELA Gallery</span>
          </div>
          <div className="pt-row">
            <span className="id">ZDP253040</span>
            <span className="nm">
              사용자 경험 기반 아트페어 가이드 제공 방법·장치
            </span>
            <span className="lk">AXVELA Viewer</span>
          </div>
        </div>

        <div className="patent-quote rv">
          “AXVELA neither collapses uncertainty into false certainty,
          <br />
          nor fabricates detail into false reality.”
        </div>
      </div>
    </section>
  );
}
