import Image from "next/image";

export default function Museum() {
  return (
    <section id="museum">
      <div className="wrap">
        <div className="eyebrow rv">AXVELA MUSEUM</div>
        <h2 className="display rv">
          Today’s Culture,
          <br />
          <em>Tomorrow’s Heritage.</em>
        </h2>
        <div className="sub-ko rv">오늘의 문화를 내일의 문화유산으로.</div>
        <p className="lede rv">
          박물관 앱이 아닙니다. 실물 문화유산을 스캔해 디지털로 영구 보존하고,
          누구나 어디서나 다시 경험하도록 축적하는 문화자산 플랫폼입니다.
          K-Culture는 세계로 확산되지만, 한국 문화유산의 디지털 접점은 아직
          부족합니다 — 관심이 흩어지기 전에, AXVELA MUSEUM이 그 관심을 장기 디지털
          자산으로 전환합니다.
        </p>

        <div className="mu-steps rv">
          <div className="mu">
            <div className="num">01</div>
            <h4>Cultural Heritage</h4>
            <p>
              실물 문화유산 — 회화·전적·공예·유물. 원본의 질감과 상태가 데이터의
              출발점입니다.
            </p>
          </div>
          <div className="mu">
            <div className="num">02</div>
            <h4>
              <span className="ax">AXVELA</span> SCAN
            </h4>
            <p>
              초고해상도 비접촉 현장 디지털화. 색·질감·미세 손상까지 캡처하고,
              환경·상태 데이터를 동시에 수집합니다.
            </p>
          </div>
          <div className="mu">
            <div className="num">03</div>
            <h4>Digital Twin</h4>
            <p>
              3D 디지털 트윈으로 영구 보존. 시간이 지나도 변하지 않는 원본 기록과
              작품별 식별 구조 AXID.
            </p>
          </div>
          <div className="mu">
            <div className="num">04</div>
            <h4>
              <span className="ax">AXVELA</span> MUSEUM
            </h4>
            <p>
              모바일·웹에서 어디서나 재경험. AI 도슨트가 맥락까지 해설하고, 관람
              티켓과 문화 여권으로 기록합니다.
            </p>
          </div>
        </div>

        <div className="img-panel rv">
          <Image
            src="/images/renewal/museum-platform.jpg"
            alt="AXVELA MUSEUM — 100,000+ 디지털 자산, 50,000,000+ 데이터 포인트, 200+ 기관을 연결하는 문화자산 디지털 인프라"
            width={1452}
            height={815}
            loading="lazy"
          />
          <div className="cap">
            <span>
              <b>AXVELA MUSEUM</b> · From Stored Heritage to Living Intelligence
            </span>
            <span>100,000+ Assets · 50M+ Data Points</span>
          </div>
        </div>

        <div className="mu-journey rv">
          <b>Enter</b>
          <span className="sep">→</span>
          <b>Explore</b>
          <span className="sep">→</span>
          <b>Learn</b>
          <span className="sep">→</span>
          <b>Save</b>
          <span className="sep">→</span>
          <b>Share</b>
        </div>

        <div className="mu-close rv">
          경험은 단순 조회가 아니라 <em>감상·학습·기록·공유</em>로 이어집니다.
        </div>
      </div>
    </section>
  );
}
