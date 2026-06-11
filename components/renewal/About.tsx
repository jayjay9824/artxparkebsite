export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="eyebrow rv">About ArtXpark</div>
        <h2 className="display rv">
          An AI technology company building
          <br />
          <em>cultural intelligence infrastructure.</em>
        </h2>
        <div className="sub-ko rv">
          문화 인텔리전스 인프라를 만드는 AI 기술 기업.
        </div>

        <div className="about-quote rv">
          “Culture holds some of the most irreplaceable value humans have ever
          created. It deserves the same data infrastructure we have built for
          financial markets — and AXVELA AI is how we get there.”
          <span className="who">Jinhwi Park — Founder &amp; CEO, ArtXpark</span>
        </div>

        <div className="fact-row rv">
          <div className="fact">
            <div className="k">Founded</div>
            <div className="v">Seoul, Korea</div>
          </div>
          <div className="fact">
            <div className="k">Core Product</div>
            <div className="v">AXVELA AI</div>
          </div>
          <div className="fact">
            <div className="k">Market Focus</div>
            <div className="v">Cultural Assets</div>
          </div>
          <div className="fact">
            <div className="k">Domain</div>
            <div className="v">AI Infrastructure</div>
          </div>
        </div>

        <div className="team-grid rv">
          <div className="tm">
            <div className="role">Leadership · Founder &amp; CEO</div>
            <h4>Jinhwi Park</h4>
            <div className="ti">ArtXpark Inc.</div>
            <ul>
              <li>
                <b>University of Northern Colorado</b> — Art History
              </li>
              <li>UOVO Art (USA) · JN Gallery · Opera Gallery Korea</li>
              <li>
                Identified structural gaps in artwork data — condition,
                provenance, transaction records
              </li>
              <li>
                Experience across logistics, exhibition, and sales operations —
                validated problem recognition through hands-on work
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
