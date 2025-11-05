import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MidiLand",
  description: "Platform Kemitraan Properti Alfamidi",
};

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "600"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
