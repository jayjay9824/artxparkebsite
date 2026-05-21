import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    siteName: "ArtXpark",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "ArtXpark — Physical Asset Intelligence Infrastructure",
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
    <html
      lang="ko"
      className={`antialiased ${inter.variable} ${pretendard.variable}`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
