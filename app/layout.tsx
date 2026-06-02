import type { Metadata } from "next";
import localFont from "next/font/local";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saltwaves.studio"),
  title: "Saltwaves Studio",
  description: "Professional audio tools for creators.",
  openGraph: {
    title: "Saltwaves Studio",
    description: "Professional audio tools for creators.",
    type: "website",
    url: "https://saltwaves.studio",
    siteName: "Saltwaves Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saltwaves Studio",
    description: "Professional audio tools for creators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivoBlack.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
