/** Infinite marquee. The CSS animation translates the track by -50%, so the
 *  item sequence is rendered twice for a seamless loop (concept duplicated the
 *  innerHTML at runtime; rendering twice in JSX is the static equivalent). */
function MqItems() {
  return (
    <>
      <span className="mi">Physical Asset</span>
      <span className="mi sep">→</span>
      <span className="mi">Data</span>
      <span className="mi sep">→</span>
      <span className="mi">AI</span>
      <span className="mi sep">→</span>
      <span className="mi">Assetization</span>
      <span className="mi sep">·</span>
      <span className="mi serif">AI generates. AXVELA verifies.</span>
      <span className="mi sep">·</span>
      <span className="mi">AXVELA SCAN</span>
      <span className="mi sep">·</span>
      <span className="mi">AXVELA AI</span>
      <span className="mi sep">·</span>
      <span className="mi">AXVELA VIEW</span>
      <span className="mi sep">·</span>
      <span className="mi">AXVELA MUSEUM</span>
      <span className="mi sep">·</span>
      <span className="mi serif">We preserve reality, not files.</span>
      <span className="mi sep">·</span>
      <span className="mi">AXID</span>
      <span className="mi sep">·</span>
      <span className="mi">Passport</span>
      <span className="mi sep">·</span>
      <span className="mi">Gallery System</span>
      <span className="mi sep">·</span>
    </>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="mq-track" id="mqTrack">
        <MqItems />
        <MqItems />
      </div>
    </div>
  );
}
