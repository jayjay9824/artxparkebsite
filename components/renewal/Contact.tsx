const CONTACT_EMAIL = "artxpark.ceo@gmail.com";

export default function Contact() {
  return (
    <section id="contact">
      <div className="wrap contact-inner">
        <div className="eyebrow rv" style={{ justifyContent: "center" }}>
          Contact
        </div>
        <h2 className="rv" style={{ marginTop: "26px" }}>
          Build the trust layer
          <br />
          <em>with us.</em>
        </h2>
        <div className="ko rv">
          문화 자산의 신뢰 인프라를 함께 만들 파트너를 찾습니다.
        </div>
        <div className="rv">
          <a className="contact-cta" href={`mailto:${CONTACT_EMAIL}`}>
            Partner with AXVELA <span>→</span>
          </a>
        </div>
        <div className="contact-sub rv">
          Seoul, Republic of Korea ·{" "}
          <a href="https://www.artxpark.com" target="_blank" rel="noopener">
            artxpark.com
          </a>
        </div>
      </div>
    </section>
  );
}
