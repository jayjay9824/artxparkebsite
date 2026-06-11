export default function Thesis() {
  return (
    <section id="thesis">
      <div className="wrap">
        <div className="eyebrow rv">The Thesis</div>
        <h2 className="display rv">
          Six products. Three phases.
          <br />
          <em>One infrastructure.</em>
        </h2>
        <div className="sub-ko rv">여섯 제품, 세 단계, 하나의 인프라.</div>
        <p className="lede rv">
          On the surface, AXVELA is a family of products released in three
          phases. Underneath, it is a single asset-data infrastructure. AXVELA
          does not build a smarter AI — it builds the layer that connects the
          state, movement, culture, and transactions of physical assets into one
          continuous record.
        </p>
        <p className="lede rv">
          표면적으로 AXVELA는 세 단계로 출시되는 여섯 개의 제품입니다. 그러나 그
          아래는 하나의 자산 데이터 인프라입니다. AXVELA는 더 똑똑한 AI를 만들지
          않습니다 — 실물 자산의 상태·이동·문화·거래를 하나의 연속된 기록으로 잇는
          레이어를 만듭니다.
        </p>

        <div className="thesis-grid rv">
          <div className="stream">
            <div className="num">01</div>
            <h4>Operations Data</h4>
            <div className="prod">Gallery System</div>
            <p>
              Exhibition history · Transactions · Collectors · Consignment ·
              Invoices
            </p>
          </div>
          <div className="stream">
            <div className="num">02</div>
            <h4>Intelligence Data</h4>
            <div className="prod">AXVELA AI</div>
            <p>Artist analysis · Movement · Market trends · Comparables</p>
          </div>
          <div className="stream">
            <div className="num">03</div>
            <h4>Capture Data</h4>
            <div className="prod">AXVELA SCAN</div>
            <p>3D points · Condition · Material · Artist touch · Change history</p>
          </div>
          <div className="stream">
            <div className="num">04</div>
            <h4>Engagement Data</h4>
            <div className="prod">AXVELA VIEW</div>
            <p>AR recognition · Works of interest · Viewing history</p>
          </div>
        </div>

        <div className="thesis-props rv">
          <div className="prop">
            <span className="en">Append-only</span>
            <span>누적된다</span>
          </div>
          <div className="prop">
            <span className="en">Cross-referenced</span>
            <span>서로 교차 검증된다</span>
          </div>
          <div className="prop">
            <span className="en">Temporal</span>
            <span>시간이 깊이를 만든다</span>
          </div>
        </div>
      </div>
    </section>
  );
}
