import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./renewal.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const SITE_URL = "https://artxpark.com";
const SITE_TITLE = "ArtXpark — Physical Asset Intelligence Infrastructure";
const SITE_DESCRIPTION =
  "AI generates. AXVELA verifies. AXVELA는 실물 문화 자산의 상태·이동·문화·거래를 하나의 검증 가능한 기록으로 잇는 데이터 인프라입니다. Physical Asset → Data → AI → Assetization.";

// Korean-targeted Open Graph signals (네이버는 OG 태그를 검색 결과에 적극 활용).
const OG_TITLE_KO = "아트엑스파크 ArtXpark | AXVELA";
const OG_SITE_NAME_KO = "아트엑스파크 ArtXpark";
const OG_DESCRIPTION_KO =
  "아트엑스파크(ArtXpark)는 실물 문화 자산의 상태·이동·문화·거래를 하나의 검증 가능한 기록으로 잇는 AXVELA 데이터 인프라를 만드는 AI 기술 기업입니다. AI generates. AXVELA verifies.";
const OG_IMAGE = "https://artxpark.com/images/logo.jpg";

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
    "AXVELA VIEW",
    "AXVELA SCAN",
    "AXVELA DRONE",
    "AXVELA ROBOT",
    "AXVELA Passport",
    "Physical Asset Intelligence Infrastructure",
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
    siteName: OG_SITE_NAME_KO,
    title: OG_TITLE_KO,
    description: OG_DESCRIPTION_KO,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: OG_TITLE_KO,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/logo.jpg"],
  },
  verification: {
    other: {
      "naver-site-verification": "98c8e627b50fc2b28521c8773f38a3e916b9cfc3",
    },
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
    <html
      lang="ko"
      className={`antialiased ${inter.variable} ${pretendard.variable} ${fraunces.variable}`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
