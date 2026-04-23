import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArtXpark — Cultural Intelligence AI",
  description:
    "ArtXpark builds AI infrastructure for the physical cultural asset market. ARTENA AI is the core intelligence engine.",
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
    <html lang="en" className="antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
