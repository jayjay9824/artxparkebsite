import Image from "next/image";

export default function Ecosystem() {
  return (
    <section id="ecosystem">
      <div className="wrap">
        <div className="eyebrow rv">Ecosystem</div>
        <h2 className="display rv">
          Infrastructure that <em>feeds AXVELA AI.</em>
        </h2>
        <div className="sub-ko rv">AXVELA AI를 키우는 인프라.</div>
        <p className="lede rv">
          AXVELA SCAN, Mobile Scan Lab, AXVELA DRONE, and AXVELA ROBOT are not
          separate products. They are the physical intelligence layer —
          generating the verified real-world data that AXVELA AI learns from and
          operates on.
        </p>

        <div className="eco-grid rv">
          <div className="eco">
            <div className="eco-img">
              <Image
                src="/images/renewal/mobility-lab.jpg"
                alt="AXVELA Mobility Lab — 3D 스캐닝, 항온항습 환경 제어, 독립 전원, 보안 스토리지, 실시간 데이터 동기화를 갖춘 이동형 보존 연구소"
                width={1340}
                height={892}
                loading="lazy"
              />
            </div>
            <div className="tag">Mobile Conservation Lab</div>
            <h4>
              <span className="ax">AXVELA</span> Mobility Lab
            </h4>
            <p>
              이동형 보존 연구소. 3D 스캐닝 &amp; 이미징, 항온·항습 환경 제어,
              독립 전원·네트워크, 보안 스토리지, 실시간 데이터 동기화 — 작품이
              있는 곳이 곧 연구소가 됩니다.
            </p>
          </div>
          <div className="eco">
            <div className="eco-img">
              <Image
                src="/images/renewal/bd-rover.jpg"
                alt="AXVELA B&D — 자율주행 지상 로버와 드론. Built to protect. Designed to move."
                width={1340}
                height={892}
                loading="lazy"
              />
            </div>
            <div className="tag">Autonomous Rover &amp; Drone</div>
            <h4>
              <span className="ax">AXVELA</span> B&amp;D
            </h4>
            <p>
              Built to protect. Designed to move. 야외 조각·벽화·건축 문화재를
              위한 자율 지상 로버와 드론 — 모든 차원을 캡처하는 항공·지상 통합
              스캐닝 유닛입니다.
            </p>
          </div>
          <div className="eco">
            <div className="eco-img contain">
              <Image
                src="/images/renewal/humanoid-robot.jpg"
                alt="AXVELA Humanoid Robot — 미술관 환경에서 작품을 비접촉 스캔하는 휴머노이드. Identity, Protection, Mobility, Preservation, Intelligence."
                width={1041}
                height={1144}
                loading="lazy"
              />
            </div>
            <div className="tag">Precision Robotics</div>
            <h4>
              <span className="ax">AXVELA</span> Humanoid Robot
            </h4>
            <p>
              Intelligence in action. 갤러리·미술관 환경을 위한 정밀 로보틱스 —
              Identity · Protection · Mobility · Preservation · Intelligence를
              하나의 유닛으로 수행합니다.
            </p>
          </div>
          <div className="eco">
            <div className="eco-img">
              <Image
                src="/images/renewal/amp-platform.jpg"
                alt="AXVELA AMP — 메카넘 휠 기반 자율 이동 플랫폼, 실시간 온습도 모니터링과 지문 인증 보안"
                width={1221}
                height={976}
                loading="lazy"
              />
            </div>
            <div className="tag">Autonomous Mobility Platform</div>
            <h4>
              <span className="ax">AXVELA</span> AMP
            </h4>
            <p>
              작품 이동을 위한 자율 모빌리티 플랫폼. 전방향 메카넘 휠, 실시간
              온·습도 모니터링, 지문 인증 보안 — 수장고에서 전시장까지 안전하게
              운반합니다.
            </p>
          </div>
          <div className="eco">
            <div className="eco-img">
              <Image
                src="/images/renewal/apd-deck.jpg"
                alt="AXVELA Art Protection Deck — Shock Event Blackbox, Adaptive Frame, IMU를 갖춘 작품 보호 데크"
                width={1221}
                height={976}
                loading="lazy"
              />
            </div>
            <div className="tag">Art Protection Deck</div>
            <h4>
              <span className="ax">AXVELA</span> APD
            </h4>
            <p>
              운송 중 작품을 지키는 보호 데크. Shock Event Blackbox가 모든 충격을
              기록하고, Adaptive Frame과 IMU가 진동·기울기를 실시간 감지해
              Passport 타임라인에 남깁니다.
            </p>
          </div>
          <div className="eco">
            <div className="eco-img">
              <Image
                src="/images/renewal/scan-pipeline.jpg"
                alt="AXVELA SCAN 기술 상세 — LiDAR 포인트 클라우드, RGB 컬러 캡처, 표면 질감 매핑, 특징점 검출"
                width={1452}
                height={815}
                loading="lazy"
              />
            </div>
            <div className="tag">Multi-modal Capture</div>
            <h4>
              <span className="ax">AXVELA</span> SCAN
            </h4>
            <p>
              비접촉 안전 스캐닝, 0.05mm 정밀도, AI 실시간 특징점 추출,
              엔드투엔드 암호화 — 모든 데이터 스트림의 출발점이 되는 캡처
              파이프라인입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
