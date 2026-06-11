"use client";

import dynamic from "next/dynamic";

// JarScan pulls in three.js and touches WebGL/DOM only on the client, so it is
// loaded with ssr:false (allowed because this wrapper is a Client Component).
const JarScan = dynamic(() => import("./JarScan"), {
  ssr: false,
  loading: () => null,
});

export default function JarCanvasClient() {
  return <JarScan />;
}
