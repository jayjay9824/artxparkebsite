import Image from "next/image";

export default function AxvelaAI() {
  return (
    <section id="axvela-ai">
      <div className="wrap">
        <Image
          className="ai-logo rv"
          src="/images/renewal/axvela-logo-white.png"
          alt="AXVELA — AI for Cultural Intelligence"
          width={700}
          height={700}
        />
        <div className="eyebrow rv">AXVELA AI</div>
        <h2 className="display rv">
          Not a chatbot.
          <br />
          <em>A cultural intelligence system.</em>
        </h2>
        <div className="sub-ko rv">챗봇이 아니다. 문화 인텔리전스 시스템이다.</div>
        <p className="lede rv">
          AXVELA AI is designed from the ground up for artworks, exhibitions, and
          cultural context — not repurposed from generic AI models. Domain
          knowledge is foundational, not bolted on. It learns continuously from
          every asset it processes: scanning data, provenance records, condition
          history, exhibition context, and market signals. The more it sees, the
          more precisely it understands.
        </p>

        <div className="ai-grid rv">
          <div className="ai-card">
            <div className="glyph">a</div>
            <h4>Cultural Intelligence</h4>
            <div className="ko">문화를 위해 설계된 인텔리전스</div>
            <p>
              Built specifically for art and cultural assets. Domain knowledge —
              artist history, material properties, market context — is
              structural, not supplementary.
            </p>
          </div>
          <div className="ai-card">
            <div className="glyph">b</div>
            <h4>Learning-Driven</h4>
            <div className="ko">데이터로 깊어지는 학습</div>
            <p>
              Every scan, exhibition, and transaction makes AXVELA AI more
              accurate. Intelligence compounds with every asset it processes.
            </p>
          </div>
          <div className="ai-card">
            <div className="glyph">c</div>
            <h4>Context-Aware Interpretation</h4>
            <div className="ko">맥락을 읽는 해석</div>
            <p>
              AXVELA AI understands cultural significance, provenance weight, and
              condition nuance — not just pattern recognition on surface
              features.
            </p>
          </div>
          <div className="ai-card">
            <div className="glyph">d</div>
            <h4>Ecosystem-Connected</h4>
            <div className="ko">실물 데이터에 접지된 출력</div>
            <p>
              Linked directly to real-world physical data through AXVELA SCAN,
              AXVELA DRONE, and AXVELA ROBOT — grounding every AI output in
              verified field evidence.
            </p>
          </div>
        </div>

        <div className="ai-quote rv">
          Generic AI cannot determine what makes a Basquiat authentic or a Song
          Dynasty vase significant. AXVELA AI can — and it keeps getting better
          with every interaction.
        </div>
      </div>
    </section>
  );
}
