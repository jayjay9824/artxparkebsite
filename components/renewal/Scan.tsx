import JarCanvasClient from "./JarCanvasClient";

/** AXVELA SCAN section. The copy column (headline + capture stages + counter)
 *  is server-rendered for SEO; the interactive 3D celadon scan loads client-only
 *  via JarCanvasClient and reaches into #featCount / .sf to drive them. */
export default function Scan() {
  return (
    <section id="scan">
      <div className="scan-stage">
        <div className="scan-copy">
          <div className="eyebrow rv">AXVELA SCAN</div>
          <h2 className="rv">
            Capturing reality.
            <br />
            <em>Preserving evidence.</em>
          </h2>
          <div className="sub-ko rv">현실을 캡처하고, 증거를 보존한다.</div>

          <div className="scan-feats rv">
            <div className="sf" data-stage="0">
              <span className="pip" />
              <span className="lb">LiDAR Point Cloud — 고밀도 3D 형상 캡처</span>
              <span className="st">STANDBY</span>
            </div>
            <div className="sf" data-stage="1">
              <span className="pip" />
              <span className="lb">
                Surface Texture Mapping — 미세 질감·재질 분석
              </span>
              <span className="st">STANDBY</span>
            </div>
            <div className="sf" data-stage="2">
              <span className="pip" />
              <span className="lb">
                Feature Point Detection — 고유 특징점 매핑
              </span>
              <span className="st">STANDBY</span>
            </div>
            <div className="sf" data-stage="3">
              <span className="pip" />
              <span className="lb">
                AXID Generation — 영구 디지털 신원 생성
              </span>
              <span className="st">STANDBY</span>
            </div>
          </div>

          <div className="scan-counter rv">
            <span className="n" id="featCount">
              0
            </span>
            <span className="l">
              Feature Points
              <br />
              Detected
            </span>
          </div>
        </div>

        <div className="scan-3d">
          <JarCanvasClient />
        </div>
      </div>
    </section>
  );
}
