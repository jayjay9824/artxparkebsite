import Image from "next/image";

export default function ScanDetail() {
  return (
    <section className="scan-detail">
      <div className="wrap">
        <div className="img-panel rv">
          <Image
            src="/images/renewal/scan-pipeline.jpg"
            alt="AXVELA SCAN — LiDAR point cloud, RGB capture, surface texture mapping, feature point detection을 통한 멀티모달 스캐닝 기술 상세"
            width={1452}
            height={815}
            loading="lazy"
          />
          <div className="cap">
            <span>
              <b>AXVELA SCAN</b> · Multi-modal Capture Pipeline
            </span>
            <span>LiDAR · RGB · Texture · Feature Points · 0.05mm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
