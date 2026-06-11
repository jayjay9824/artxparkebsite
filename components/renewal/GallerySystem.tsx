export default function GallerySystem() {
  return (
    <section id="gallery-system">
      <div className="wrap">
        <div className="eyebrow rv">01 · Operations · Gallery System</div>
        <h2 className="display rv">
          The operating system
          <br />
          <em>for galleries.</em>
        </h2>
        <div className="sub-ko rv">갤러리를 위한 운영체제.</div>
        <p className="lede rv">
          Artwork-Centric Operating System. 고객도, 거래도 아닌 작품이 시스템의
          중심입니다. 전시 이력·거래·컬렉터·위탁·인보이스 — 갤러리 운영의 모든
          기록이 하나의 작품 레코드 위에 쌓이고, 그 기록이 AXVELA 인프라 전체의
          Operations Data 스트림이 됩니다.
        </p>

        <div className="gs-core rv">
          <div className="k">Single Source of Truth</div>
          <h4>Artwork</h4>
          <p>every record begins with the work itself</p>
        </div>
        <div className="gs-stem rv" />
        <div className="gs-domains rv">
          <span>Artist</span>
          <span>Edition</span>
          <span>Provenance</span>
          <span>Inquiry</span>
          <span>Payment</span>
          <span>Settlement</span>
          <span>TaxRecord</span>
        </div>

        <div className="gs-flows rv">
          <div className="gsf">
            <div className="num">Money Flow · 01</div>
            <h5>Payment</h5>
            <div className="ko">컬렉터 → 갤러리</div>
            <p>
              컬렉터 입금을 추적하는 거래 기록. 문의에서 제안, 계약, 입금까지
              하나의 흐름으로 연결됩니다.
            </p>
          </div>
          <div className="gsf">
            <div className="num">Money Flow · 02</div>
            <h5>Settlement</h5>
            <div className="ko">갤러리 → 작가</div>
            <p>
              위탁 분배율 기반의 작가 정산. 사적 계약의 영역으로, 결제·세무
              기록과 절대 한 객체에 섞이지 않습니다.
            </p>
          </div>
          <div className="gsf">
            <div className="num">Money Flow · 03</div>
            <h5>TaxRecord</h5>
            <div className="ko">갤러리 → 국세청</div>
            <p>
              공적 신고 의무의 기록. 결제·정산과 구조적으로 분리되어 세무
              투명성을 시스템 차원에서 보장합니다.
            </p>
          </div>
        </div>

        <div className="gs-layers rv">
          <div className="gsl">
            <span className="nm">AXVELA</span>
            <span className="ds">
              Record Layer — <em>기록한다</em>
            </span>
          </div>
          <div className="gsl">
            <span className="nm">Gallery</span>
            <span className="ds">
              Trust Layer — <em>신뢰를 만든다</em>
            </span>
          </div>
          <div className="gsl">
            <span className="nm">AI</span>
            <span className="ds">
              Assist Layer — <em>보조한다</em>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
