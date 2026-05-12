import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://artxpark.com";
const SITE_TITLE = "ArtXpark — Cultural Intelligence AI";
const SITE_DESCRIPTION =
  "AXVELA AI 기반 문화 자산 데이터 인프라. Cultural Intelligence가 실물 자산을 데이터로, 데이터를 자산화로 연결합니다. Physical Asset → Data → AI → Assetization.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | ArtXpark",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "ArtXpark",
    "AXVELA",
    "AXVELA AI",
    "Cultural Intelligence",
    "Vertical AI",
    "Art Data Infrastructure",
    "Gallery OS",
    "Reality-Trust Infrastructure",
    "Cultural Assets",
    "문화자산 데이터",
    "문화자산 데이터 인프라",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "ArtXpark",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "ArtXpark — Cultural Intelligence AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/logo.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
