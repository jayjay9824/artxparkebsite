"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* 3D Goryeo-celadon maebyeong scan. A faithful 1:1 port of the concept's
 * vanilla Three.js (r128) script: procedural celadon material, gold point
 * cloud revealed by a vertical scan, 3D-tracked findings annotations, digital
 * twin view modes, gold dust, drag-rotate, and graceful WebGL fallback.
 * All listeners / timers / observers / GPU resources are cleaned up on unmount. */
export default function JarScan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement as HTMLElement;
    const scanLoading = document.getElementById("scanLoading");
    const scanFallback = document.getElementById("scanFallback");

    function show3DFallback() {
      if (scanLoading) scanLoading.classList.add("off");
      if (scanFallback) scanFallback.classList.add("on");
      canvas!.style.display = "none";
    }

    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      if (!renderer.getContext()) throw new Error("no webgl context");
    } catch (err) {
      show3DFallback();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.05, 5.4);
    camera.lookAt(0, 0.55, 0);

    /* lights — museum spot mood */
    scene.add(new THREE.HemisphereLight(0x26262c, 0x050505, 1.15));
    const key = new THREE.SpotLight(0xfff2dd, 1.35, 30, Math.PI / 5, 0.5, 1.4);
    key.position.set(2.6, 6, 3.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9b68a, 0.0); /* gold rim — raised after scan completes */
    rim.position.set(-3, 2, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x9ec0aa, 0.5);
    fill.position.set(-2.5, 1.2, 2.5);
    scene.add(fill);
    const backLight = new THREE.DirectionalLight(0xaac4b2, 0.4);
    backLight.position.set(3.2, 1.8, -2.8);
    scene.add(backLight);

    const group = new THREE.Group();
    scene.add(group);

    /* ---- Goryeo celadon maebyeong profile (청자 매병) — hand-tuned control points ---- */
    const profile = [
      [0.4, 0.0], [0.43, 0.06], [0.5, 0.22], [0.58, 0.45], [0.68, 0.7],
      [0.8, 0.95], [0.92, 1.2], [1.0, 1.42], [1.02, 1.58], [0.97, 1.72],
      [0.85, 1.84], [0.62, 1.93], [0.41, 1.98], [0.31, 2.02], [0.3, 2.08], [0.34, 2.12],
    ];
    const pts = profile.map((p) => new THREE.Vector2(p[0], p[1]));
    const curve = new THREE.SplineCurve(pts);
    const lathePts = curve.getPoints(80);

    /* ---- procedural celadon surface (비색 유약·빙렬·상감 운학문·철반) ---- */
    function makeJarTextures() {
      const S = 1024;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const x = c.getContext("2d")!;

      /* 비색 — jade-green base glaze */
      const base = x.createLinearGradient(0, 0, 0, S);
      base.addColorStop(0, "#A8C2AE");
      base.addColorStop(0.5, "#9CB9A6");
      base.addColorStop(1, "#92B09C");
      x.fillStyle = base;
      x.fillRect(0, 0, S, S);

      /* draw the same element at three horizontal offsets (-S, 0, +S) so every
       * position-based mark tiles seamlessly across the texture's horizontal
       * wrap (repeat = 2). The radial-gradient blobs expand their fillRect to
       * S*3 width so the translated fill still covers the whole canvas. */
      function wrapX(draw: () => void) {
        for (const ox of [-S, 0, S]) {
          x.save();
          x.translate(ox, 0);
          draw();
          x.restore();
        }
      }

      /* glaze pooling — deeper green & blue-gray blotches */
      for (let i = 0; i < 56; i++) {
        const gx = Math.random() * S, gy = Math.random() * S, gr = 100 + Math.random() * 330;
        const g = x.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, Math.random() < 0.55 ? "rgba(62,104,84,0.12)" : "rgba(110,134,128,0.09)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = g;
        wrapX(() => x.fillRect(-S, 0, S * 3, S));
      }
      /* faint warm undertone where glaze thins */
      for (let iw = 0; iw < 14; iw++) {
        const wx = Math.random() * S, wy = Math.random() * S, wr = 60 + Math.random() * 140;
        const wg = x.createRadialGradient(wx, wy, 0, wx, wy, wr);
        wg.addColorStop(0, "rgba(176,160,120,0.06)");
        wg.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = wg;
        wrapX(() => x.fillRect(-S, 0, S * 3, S));
      }

      /* horizontal throwing rings */
      for (let y = 0; y < S; y++) {
        const v = Math.sin(y * 0.16) + 0.5 * Math.sin(y * 0.041 + 1.7) + 0.3 * Math.sin(y * 0.57 + 0.4);
        if (v > 0.55) {
          x.fillStyle = "rgba(52,84,68," + (0.012 + 0.02 * (v - 0.55)).toFixed(3) + ")";
          x.fillRect(0, y, S, 1);
        } else if (v < -0.55) {
          x.fillStyle = "rgba(232,244,232," + (0.014 + 0.026 * (-v - 0.55)).toFixed(3) + ")";
          x.fillRect(0, y, S, 1);
        }
      }

      /* 상감 운학문 — inlaid double-ring medallions with stylized cranes */
      function medallion(mx: number, my: number, r: number) {
        x.save();
        x.strokeStyle = "rgba(238,242,232,0.55)";
        x.lineWidth = 2.2;
        x.beginPath();
        x.arc(mx, my, r, 0, 7);
        x.stroke();
        x.lineWidth = 1.2;
        x.beginPath();
        x.arc(mx, my, r * 0.82, 0, 7);
        x.stroke();
        /* stylized crane: body arc + wing arc + beak line */
        x.strokeStyle = "rgba(240,244,236,0.6)";
        x.lineWidth = 1.6;
        x.lineCap = "round";
        x.beginPath();
        x.arc(mx, my + r * 0.18, r * 0.34, Math.PI * 0.95, Math.PI * 1.85); /* body/neck */
        x.stroke();
        x.beginPath();
        x.arc(mx - r * 0.05, my + r * 0.05, r * 0.3, Math.PI * 1.15, Math.PI * 1.75); /* wing */
        x.stroke();
        x.beginPath();
        x.moveTo(mx + r * 0.18, my - r * 0.28);
        x.lineTo(mx + r * 0.34, my - r * 0.36); /* beak */
        x.stroke();
        /* black inlay accents (흑상감) */
        x.fillStyle = "rgba(30,40,34,0.55)";
        x.beginPath();
        x.arc(mx + r * 0.15, my - r * 0.27, 1.4, 0, 7);
        x.fill(); /* eye */
        x.restore();
      }
      /* two staggered bands on the belly */
      const cols = 5;
      for (let b = 0; b < 2; b++) {
        for (let m = 0; m < cols; m++) {
          const mx = ((m + (b ? 0.5 : 0)) / cols) * S, my = S * (0.4 + b * 0.2) + (Math.random() - 0.5) * 18;
          const mr = 30 + Math.random() * 5;
          wrapX(() => medallion(mx, my, mr));
        }
      }
      /* 백상감 cloud dots scattered between medallions */
      for (let cd = 0; cd < 60; cd++) {
        const dx = Math.random() * S, dy = S * (0.28 + Math.random() * 0.44);
        const dr = 0.8 + Math.random() * 1.4;
        x.fillStyle = "rgba(238,242,232," + (0.18 + Math.random() * 0.22).toFixed(2) + ")";
        wrapX(() => {
          x.beginPath();
          x.arc(dx, dy, dr, 0, 7);
          x.fill();
        });
      }

      /* sparse iron speckles */
      for (let i2 = 0; i2 < 480; i2++) {
        const sx = Math.random() * S, sy = Math.random() * S, sr = 0.4 + Math.random() * 1.2;
        x.fillStyle = "rgba(40,58,46," + (0.1 + Math.random() * 0.26).toFixed(2) + ")";
        wrapX(() => {
          x.beginPath();
          x.arc(sx, sy, sr, 0, 7);
          x.fill();
        });
      }

      /* 빙렬 — celadon ice-crackle, denser than porcelain */
      x.lineWidth = 0.7;
      function crack(px: number, py: number, ang: number, len: number) {
        x.strokeStyle = "rgba(48,70,56," + (0.09 + Math.random() * 0.09).toFixed(2) + ")";
        x.beginPath();
        x.moveTo(px, py);
        for (let s = 0; s < len; s++) {
          ang += (Math.random() - 0.5) * 1.0;
          px += Math.cos(ang) * (5 + Math.random() * 11);
          py += Math.sin(ang) * (5 + Math.random() * 11);
          x.lineTo(px, py);
          if (Math.random() < 0.1 && len > 6)
            crack(px, py, ang + (Math.random() < 0.5 ? 1.25 : -1.25), (len * 0.45) | 0);
        }
        x.stroke();
      }
      for (let i4 = 0; i4 < 92; i4++) {
        const cx0 = Math.random() * S, cy0 = Math.random() * S;
        const ca0 = Math.random() * Math.PI * 2, cl0 = 8 + ((Math.random() * 18) | 0);
        wrapX(() => crack(cx0, cy0, ca0, cl0));
      }

      const map = new THREE.CanvasTexture(c);
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(2, 1);
      map.anisotropy = renderer.capabilities.getMaxAnisotropy();

      /* bump map — clay grain + rings + speckle dents */
      const B = 512;
      const bc = document.createElement("canvas");
      bc.width = bc.height = B;
      const bx2 = bc.getContext("2d")!;
      const img = bx2.createImageData(B, B);
      for (let p = 0; p < B * B; p++) {
        const py2 = (p / B) | 0;
        const ring = Math.sin(py2 * 0.32) * 9 + Math.sin(py2 * 0.082 + 1.1) * 5;
        const n = (Math.random() - 0.5) * 15;
        const val = Math.max(0, Math.min(255, 128 + ring + n));
        img.data[p * 4] = img.data[p * 4 + 1] = img.data[p * 4 + 2] = val;
        img.data[p * 4 + 3] = 255;
      }
      bx2.putImageData(img, 0, 0);
      for (let i5 = 0; i5 < 420; i5++) {
        bx2.fillStyle = "rgba(40,40,40," + (0.2 + Math.random() * 0.4).toFixed(2) + ")";
        bx2.beginPath();
        bx2.arc(Math.random() * B, Math.random() * B, 0.5 + Math.random() * 1.2, 0, 7);
        bx2.fill();
      }
      const bump = new THREE.CanvasTexture(bc);
      bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
      bump.repeat.set(2, 1);
      bump.anisotropy = map.anisotropy;

      return { map, bump };
    }

    const jarGeo = new THREE.LatheGeometry(lathePts, 128);
    const jarTex = makeJarTextures();
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: jarTex.map,
      bumpMap: jarTex.bump,
      bumpScale: 0.012,
      roughnessMap: jarTex.bump,
      roughness: 0.42,
      metalness: 0.0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.28,
      emissive: 0x141310,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 1.0,
    });
    const jar = new THREE.Mesh(jarGeo, jarMat);
    group.add(jar);

    /* digital twin wireframe (low-res mesh view) */
    const wireGeo = new THREE.LatheGeometry(curve.getPoints(26), 30);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xc9b68a, transparent: true, opacity: 0.0 });
    const wireFrame = new THREE.WireframeGeometry(wireGeo);
    const wire = new THREE.LineSegments(wireFrame, wireMat);
    wire.visible = false;
    group.add(wire);

    /* subtle inner mouth */
    const mouthGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 64, 1, true);
    const mouth = new THREE.Mesh(
      mouthGeo,
      new THREE.MeshStandardMaterial({ color: 0x5e7466, roughness: 0.7, side: THREE.BackSide, transparent: true, opacity: 1.0 })
    );
    mouth.position.y = 2.08;
    group.add(mouth);

    /* ---- pedestal ---- */
    const pedMat = new THREE.MeshStandardMaterial({ color: 0x0d0d10, roughness: 0.35, metalness: 0.4 });
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.65, 0.22, 96), pedMat);
    ped.position.y = -0.12;
    group.add(ped);
    const pedRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.012, 12, 120),
      new THREE.MeshBasicMaterial({ color: 0xc9b68a })
    );
    pedRim.rotation.x = Math.PI / 2;
    pedRim.position.y = -0.01;
    pedRim.material.transparent = true;
    pedRim.material.opacity = 0.55;
    group.add(pedRim);

    /* concentric data rings on pedestal top */
    for (let ri = 0; ri < 3; ri++) {
      const rr = new THREE.Mesh(
        new THREE.TorusGeometry(0.7 + ri * 0.34, 0.004, 8, 100),
        new THREE.MeshBasicMaterial({ color: 0xc9b68a, transparent: true, opacity: 0.14 })
      );
      rr.rotation.x = Math.PI / 2;
      rr.position.y = 0.0;
      group.add(rr);
    }

    /* ---- point cloud on jar surface (gold, revealed by scan) ---- */
    const COUNT = 3482;
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const maxY = 2.1;
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random();
      const p = curve.getPoint(t);
      const a = Math.random() * Math.PI * 2;
      const r = p.x * 1.012; /* hover just above surface */
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
    }
    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    cloudGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const cloudMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uScanY: { value: -0.5 },
        uDone: { value: 0.0 },
        uBoost: { value: 0.0 },
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0xe8dab8) },
      },
      vertexShader: [
        "attribute float aSeed;",
        "uniform float uScanY; uniform float uTime; uniform float uDone; uniform float uBoost;",
        "varying float vAlpha;",
        "void main(){",
        "  float revealed = step(position.y, uScanY);",
        "  float tw = 0.65 + 0.35*sin(uTime*2.2 + aSeed*40.0);",
        "  float nearLine = smoothstep(0.22,0.0,abs(position.y-uScanY));",
        "  vAlpha = revealed * (0.30 + 0.5*uDone) * tw + nearLine*0.9 + uBoost*tw*0.7;",
        "  vec4 mv = modelViewMatrix * vec4(position,1.0);",
        "  gl_PointSize = (1.6 + 1.6*nearLine + aSeed*1.2) * (300.0/-mv.z) * 0.02;",
        "  gl_PointSize = max(gl_PointSize, 1.2) * (1.0 + uBoost*0.6);",
        "  gl_Position = projectionMatrix * mv;",
        "}",
      ].join("\n"),
      fragmentShader: [
        "uniform vec3 uColor; varying float vAlpha;",
        "void main(){",
        "  vec2 c = gl_PointCoord - 0.5;",
        "  float d = smoothstep(0.5, 0.1, length(c));",
        "  gl_FragColor = vec4(uColor, vAlpha * d);",
        "}",
      ].join("\n"),
    });
    const cloud = new THREE.Points(cloudGeo, cloudMat);
    group.add(cloud);

    /* ---- scan ring (sweeps vertically) ---- */
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8dab8, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.006, 10, 140), ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    /* faint scan disc */
    const discMat = new THREE.MeshBasicMaterial({ color: 0xc9b68a, transparent: true, opacity: 0.0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.0, 80), discMat);
    disc.rotation.x = -Math.PI / 2;
    group.add(disc);

    /* ---- ambient gold dust ---- */
    const DUST = 420;
    const dpos = new Float32Array(DUST * 3);
    for (let di = 0; di < DUST; di++) {
      const dr = 2.6 + Math.random() * 5.5;
      const da = Math.random() * Math.PI * 2;
      dpos[di * 3] = Math.cos(da) * dr;
      dpos[di * 3 + 1] = -0.6 + Math.random() * 4.2;
      dpos[di * 3 + 2] = Math.sin(da) * dr;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xc9b68a,
        size: 0.018,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
    );
    scene.add(dust);

    /* ---- post-scan findings annotations (3D-tracked) ---- */
    const ANNOS = [
      { el: document.getElementById("anno0"), ang: 0.55, y: 1.9, delay: 400 } /* 구연부 — glaze */,
      { el: document.getElementById("anno1"), ang: -1.05, y: 1.45, delay: 1000 } /* 어깨 — craquelure */,
      { el: document.getElementById("anno2"), ang: 0.25, y: 0.62, delay: 1600 } /* 하부 몸체 — sub-surface */,
    ];
    let annoTimers: Array<ReturnType<typeof setTimeout>> = [];
    const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _c = new THREE.Vector3();

    function showAnnos() {
      hideAnnos();
      ANNOS.forEach((a) => {
        annoTimers.push(setTimeout(() => { a.el?.classList.add("show"); }, a.delay));
      });
    }
    function hideAnnos() {
      annoTimers.forEach(clearTimeout);
      annoTimers = [];
      ANNOS.forEach((a) => { a.el?.classList.remove("show"); });
    }

    function updateAnnos() {
      const w = container.clientWidth, h = container.clientHeight;
      for (let i = 0; i < ANNOS.length; i++) {
        const a = ANNOS[i];
        if (!a.el || !a.el.classList.contains("show")) continue;
        const r = radiusAtY(a.y) * 1.01;
        /* local -> world (group rotation + float) */
        const ca = Math.cos(a.ang + group.rotation.y), sa = Math.sin(a.ang + group.rotation.y);
        _v.set(ca * r, a.y + group.position.y, sa * r);
        /* backface check: outward normal vs camera direction */
        _n.set(ca, 0, sa);
        _c.copy(camera.position).sub(_v).normalize();
        a.el.classList.toggle("back", _n.dot(_c) < 0.18);
        /* project to screen */
        _v.project(camera);
        a.el.style.left = _v.x * 0.5 * w + 0.5 * w + "px";
        a.el.style.top = -_v.y * 0.5 * h + 0.5 * h + "px";
      }
    }

    function radiusAtY(y: number) {
      /* find approx radius for ring sizing */
      let best = 0.05, bd = 1e9;
      for (let k = 0; k < lathePts.length; k++) {
        const d = Math.abs(lathePts[k].y - y);
        if (d < bd) { bd = d; best = lathePts[k].x; }
      }
      return best;
    }

    /* ---- pointer camera parallax (fine pointers) ---- */
    let camTX = 0, camTY = 1.05, camCX = 0, camCY = 1.05;
    const onContainerMove = (e: PointerEvent) => {
      if (dragging) return;
      const r = container.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      camTX = nx * 0.45;
      camTY = 1.05 - ny * 0.3;
    };
    const onContainerLeave = () => { camTX = 0; camTY = 1.05; };
    if (window.matchMedia("(pointer:fine)").matches) {
      container.addEventListener("pointermove", onContainerMove);
      container.addEventListener("pointerleave", onContainerLeave);
    }

    /* ---- interaction: drag rotate ---- */
    let targetRotY = 0.45, curRotY = 0.45;
    const autoSpin = 0.05;
    let dragging = false, lastX = 0;
    const onCanvasDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); };
    const onCanvasMove = (e: PointerEvent) => {
      if (!dragging) return;
      targetRotY += (e.clientX - lastX) * 0.008;
      lastX = e.clientX;
    };
    const onWinUp = () => { dragging = false; };
    canvas.addEventListener("pointerdown", onCanvasDown);
    canvas.addEventListener("pointermove", onCanvasMove);
    window.addEventListener("pointerup", onWinUp);

    /* ---- scan sequence state ---- */
    const featEl = document.getElementById("featCount")!;
    const sfs = document.querySelectorAll(".sf");
    let scanT = -1; /* -1 idle, 0..1 scanning, >1 done */
    const SCAN_DUR = 6.5; /* seconds */
    let done = 0;

    function setStage(idx: number, state: string) { /* state: 'STANDBY'|'ACTIVE'|'DONE' */
      const el = sfs[idx] as HTMLElement;
      if (!el) return;
      const st = el.querySelector(".st")!;
      if (state === "STANDBY") { el.classList.remove("on"); st.textContent = "STANDBY"; }
      else if (state === "ACTIVE") { el.classList.add("on"); st.textContent = "SCANNING"; }
      else { el.classList.add("on"); st.textContent = "COMPLETE"; }
    }
    /* ---- digital twin view modes ---- */
    const twinToggle = document.getElementById("twinToggle")!;
    const viewT = { jar: 1, wire: 0, boost: 0 }; /* targets */
    const viewC = { jar: 1, wire: 0, boost: 0 }; /* current (lerped) */
    const VIEW_MODES: Record<string, { jar: number; wire: number; boost: number }> = {
      color: { jar: 1, wire: 0, boost: 0 },
      points: { jar: 0, wire: 0, boost: 1 },
      mesh: { jar: 0, wire: 0.45, boost: 0.15 },
    };
    function setViewMode(mode: string) {
      const m = VIEW_MODES[mode] || VIEW_MODES.color;
      viewT.jar = m.jar;
      viewT.wire = m.wire;
      viewT.boost = m.boost;
      twinToggle.querySelectorAll(".twin-btn").forEach((b) => {
        b.classList.toggle("on", (b as HTMLElement).dataset.mode === mode);
      });
    }
    const twinBtns = Array.from(twinToggle.querySelectorAll(".twin-btn"));
    const twinHandlers: Array<[Element, (e: Event) => void]> = [];
    twinBtns.forEach((b) => {
      const h = () => setViewMode((b as HTMLElement).dataset.mode!);
      b.addEventListener("click", h);
      twinHandlers.push([b, h]);
    });

    function resetScan() {
      scanT = 0;
      done = 0;
      hideAnnos();
      twinToggle.classList.remove("show");
      setViewMode("color");
      cloudMat.uniforms.uDone.value = 0;
      rim.intensity = 0;
      for (let i = 0; i < 4; i++) setStage(i, "STANDBY");
      featEl.textContent = "0";
    }
    const rescanBtn = document.getElementById("rescanBtn")!;
    rescanBtn.addEventListener("click", resetScan);

    /* start scan when 3D enters view */
    let started = false;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    const startObs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            startTimer = setTimeout(resetScan, 600);
          }
        });
      },
      { threshold: 0.35 }
    );
    startObs.observe(container);

    /* stage thresholds */
    const THRESH = [0.02, 0.3, 0.6, 0.92];

    /* ---- resize ---- */
    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      /* keep jar framed on narrow screens */
      camera.fov = w < 640 ? 46 : 38;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    /* ---- loop ---- */
    const clock = new THREE.Clock();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    function loop() {
      rafId = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      cloudMat.uniforms.uTime.value = t;

      /* rotation */
      if (!dragging && !reduce) targetRotY += autoSpin * dt;
      curRotY += (targetRotY - curRotY) * 0.08;
      group.rotation.y = curRotY;

      /* scan progress */
      if (scanT >= 0 && scanT <= 1) {
        scanT += dt / SCAN_DUR;
        const p = Math.min(scanT, 1);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const y = -0.15 + ease * (maxY + 0.35);
        cloudMat.uniforms.uScanY.value = y;
        const rr = Math.max(radiusAtY(y) * 1.06, 0.12);
        ring.position.y = y;
        disc.position.y = y;
        ring.scale.set(rr, rr, rr);
        disc.scale.set(rr, rr, rr);
        ringMat.opacity = 0.85 * (1 - Math.abs(p * 2 - 1) * 0.25);
        discMat.opacity = 0.05;

        /* counter */
        featEl.textContent = Math.floor(3482 * ease).toLocaleString();

        /* stages */
        for (let i = 0; i < 4; i++) {
          if (p >= THRESH[i]) setStage(i, p >= (THRESH[i + 1] || 0.999) ? "DONE" : "ACTIVE");
        }
        if (p >= 1) {
          scanT = 2;
          done = 1;
          featEl.textContent = "3,482";
          for (let j = 0; j < 4; j++) setStage(j, "DONE");
          sfs[3].querySelector(".st")!.textContent = "AXID ISSUED";
          showAnnos();
          twinToggle.classList.add("show");
        }
      }
      /* after-done glow */
      const target = done ? 1 : 0;
      cloudMat.uniforms.uDone.value += (target - cloudMat.uniforms.uDone.value) * 0.04;
      rim.intensity += ((done ? 0.55 : 0) - rim.intensity) * 0.04;
      if (done) { ringMat.opacity *= 0.95; discMat.opacity *= 0.95; }

      /* gentle float + drifting dust */
      if (!reduce) {
        group.position.y = Math.sin(t * 0.6) * 0.02;
        dust.rotation.y = t * 0.018;
        dust.position.y = Math.sin(t * 0.25) * 0.08;
      }
      /* camera parallax */
      camCX += (camTX - camCX) * 0.045;
      camCY += (camTY - camCY) * 0.045;
      camera.position.x = camCX;
      camera.position.y = camCY;
      camera.lookAt(0, 0.95, 0);

      /* digital twin view morph */
      viewC.jar += (viewT.jar - viewC.jar) * 0.07;
      viewC.wire += (viewT.wire - viewC.wire) * 0.07;
      viewC.boost += (viewT.boost - viewC.boost) * 0.07;
      jarMat.opacity = viewC.jar;
      mouth.material.opacity = viewC.jar;
      jar.visible = viewC.jar > 0.02;
      mouth.visible = jar.visible;
      wireMat.opacity = viewC.wire;
      wire.visible = viewC.wire > 0.01;
      cloudMat.uniforms.uBoost.value = viewC.boost;

      updateAnnos();
      renderer.render(scene, camera);
      if (scanLoading && !scanLoading.classList.contains("off")) scanLoading.classList.add("off");
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerup", onWinUp);
      canvas.removeEventListener("pointerdown", onCanvasDown);
      canvas.removeEventListener("pointermove", onCanvasMove);
      container.removeEventListener("pointermove", onContainerMove);
      container.removeEventListener("pointerleave", onContainerLeave);
      twinHandlers.forEach(([b, h]) => b.removeEventListener("click", h));
      rescanBtn.removeEventListener("click", resetScan);
      startObs.disconnect();
      annoTimers.forEach(clearTimeout);
      if (startTimer) clearTimeout(startTimer);

      // dispose GPU resources
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        const mat = obj.material;
        if (mat) {
          (Array.isArray(mat) ? mat : [mat]).forEach((mm: any) => {
            if (mm.map) mm.map.dispose();
            if (mm.bumpMap) mm.bumpMap.dispose();
            if (mm.roughnessMap) mm.roughnessMap.dispose();
            mm.dispose();
          });
        }
      });
      wireFrame.dispose?.();
      jarTex.map.dispose();
      jarTex.bump.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        id="jarCanvas"
        ref={canvasRef}
        aria-label="고려청자 매병 3D 스캔 인터랙션 — 드래그하여 회전"
      />
      <div className="scan-tagline">
        <div className="t1">Goryeo Celadon · 청자 매병</div>
        <div className="t2">Sub-millimeter · Non-contact · 0.05mm</div>
      </div>
      <div className="scan-loading" id="scanLoading">
        <div className="in">
          <div className="ring" />
          <div className="lt">Initializing 3D</div>
        </div>
      </div>
      <div className="scan-fallback" id="scanFallback">
        <div>
          <svg viewBox="0 0 120 150" fill="none" aria-hidden="true">
            <path
              d="M48 6 h24 c2 4 2 10 -2 13 c14 5 26 18 30 36 c5 24 -6 52 -22 70 c-5 6 -10 10 -18 10 c-8 0 -13 -4 -18 -10 C26 107 15 79 20 55 C24 37 36 24 50 19 c-4 -3 -4 -9 -2 -13 Z"
              stroke="#C9B68A"
              strokeWidth="1.2"
              opacity=".8"
            />
            <ellipse cx="60" cy="142" rx="44" ry="5" stroke="#C9B68A" strokeWidth=".8" opacity=".35" />
          </svg>
          <div className="ft">
            이 환경에서는 3D 뷰가 지원되지 않습니다.
            <br />
            아래 AXVELA SCAN 기술 패널에서 캡처 파이프라인을 확인하세요.
          </div>
        </div>
      </div>

      <div className="twin-toggle" id="twinToggle">
        <button className="twin-btn on" data-mode="color">
          True Color
        </button>
        <button className="twin-btn" data-mode="points">
          Point Cloud
        </button>
        <button className="twin-btn" data-mode="mesh">
          Mesh
        </button>
      </div>

      <div className="anno" id="anno0">
        <span className="ad" />
        <div className="al">
          <b>유약 두께 변화 감지</b>
          <span>Glaze Thickness · Δ0.4mm</span>
        </div>
      </div>
      <div className="anno flip" id="anno1">
        <span className="ad" />
        <div className="al">
          <b>미세 빙렬 12건 검출</b>
          <span>Micro Craquelure · Mapped</span>
        </div>
      </div>
      <div className="anno" id="anno2">
        <span className="ad" />
        <div className="al">
          <b>표면 하부 불균질 영역</b>
          <span>Sub-surface Irregularity · 2.1cm²</span>
        </div>
      </div>

      <div className="scan-hud">
        <span className="hint">Drag to rotate</span>
        <button className="scan-btn" id="rescanBtn">
          Re-scan
        </button>
      </div>
    </>
  );
}
