import Image from "next/image";

export default function Passport() {
  return (
    <section id="passport">
      <div className="wrap">
        <div className="eyebrow rv">The Infrastructure</div>
        <h2 className="display rv">
          One Passport. <em>Every asset.</em>
        </h2>
        <div className="sub-ko rv">하나의 여권, 모든 자산.</div>
        <p className="lede rv">
          Every work AXVELA touches receives an AXID — a permanent identifier it
          keeps for life. Around it, the Passport assembles a verifiable,
          time-stamped record: a trust score and a nine-stage timeline from
          capture through verification, exhibition, transaction, shipping, and
          collection.
        </p>

        <div className="pass-wrap rv">
          <div className="pass-card">
            <div className="pc-top">
              <span className="pc-brand">AXVELA · PASSPORT</span>
              <span className="pc-chip" />
            </div>
            <div className="pc-id-l">AXID · Unique Identifier</div>
            <div className="pc-id">AXP-2026-000124</div>
            <div className="pc-rows">
              <div className="pr">
                <span className="k">Object</span>
                <span className="v">Celadon Prunus Vase 청자 매병</span>
              </div>
              <div className="pr">
                <span className="k">Period</span>
                <span className="v">Goryeo Dynasty, 12C</span>
              </div>
              <div className="pr">
                <span className="k">Trust Score</span>
                <span className="v gold">A+ · Verified</span>
              </div>
              <div className="pr">
                <span className="k">Timeline</span>
                <span className="v">9-stage · Append-only</span>
              </div>
              <div className="pr">
                <span className="k">Status</span>
                <span className="v gold">Verified by AXVELA</span>
              </div>
            </div>
          </div>

          <div className="pass-steps">
            <div className="ps">
              <div className="num">01</div>
              <div>
                <h4>AXID · Unique ID</h4>
                <div className="ko">평생 동일한 고유 일련번호</div>
                <div className="en">AXP-YYYY-XXXXXX · ONE ID FOR LIFE</div>
              </div>
            </div>
            <div className="ps">
              <div className="num">02</div>
              <div>
                <h4>Verified by AXVELA</h4>
                <div className="ko">트러스트 스코어 + 9단계 타임라인</div>
                <div className="en">TRUST SCORE + 9-STAGE TIMELINE</div>
              </div>
            </div>
            <div className="ps">
              <div className="num">03</div>
              <div>
                <h4>Document Trust Layer</h4>
                <div className="ko">변조 불가능한 영구 기록</div>
                <div className="en">TAMPER-PROOF · PERMANENTLY RETAINED</div>
              </div>
            </div>
          </div>
        </div>

        <div className="img-panel rv">
          <Image
            src="/images/renewal/passport-record.jpg"
            alt="AXVELA PASSPORT — AXID를 중심으로 모든 정보·관측·이력이 연결되는 문화자산의 살아있는 기록"
            width={1452}
            height={815}
            loading="lazy"
          />
          <div className="cap">
            <span>
              <b>AXVELA PASSPORT</b> · The Living Record of a Cultural Asset
            </span>
            <span>AXID · Blockchain Verified · Append-only</span>
          </div>
        </div>

        <div className="seal-block rv">
          <div>
            <h3>
              AXVELA SEAL —
              <br />
              <em>the physical link to digital trust.</em>
            </h3>
            <div className="sb-en">One Seal. One ID. One Trust.</div>
            <p>
              실물 작품에서 시작되는 신뢰할 수 있는 디지털 연결. AXVELA SEAL은
              작품·수장품·패키지에 부착되어 모든 정보와 이력을 안전하게
              연결합니다. 위변조 방지 기술과 블록체인 기반의 보증으로 작품의
              진위와 가치를 영구적으로 보호합니다.
            </p>
            <div className="seal-feats">
              <span>Tamper Proof</span>
              <span>Instant Connect</span>
              <span>Global Standard</span>
              <span>Lifetime Guarantee</span>
              <span>Blockchain Verified</span>
            </div>
          </div>
          <div className="seal-img">
            <Image
              src="/images/renewal/seal-tag.jpg"
              alt="AXVELA SEAL — 작품 프레임에 부착되는 위변조 방지 태그, 탭 또는 스캔으로 즉시 작품 이력에 연결"
              width={1340}
              height={892}
              loading="lazy"
            />
          </div>
        </div>

        <div className="moat rv">
          <div className="en shimmer">
            This is the moat. Models can be rebuilt.
            <br />
            Time cannot.
          </div>
          <div className="ko">
            이것이 해자입니다. 모델은 다시 만들 수 있지만, 시간은 다시 만들 수
            없습니다.
          </div>
        </div>
      </div>
    </section>
  );
}
