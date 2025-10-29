import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import MainFooter from "@/components/layout/Footer";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar dan Footer dikelola di komponen client */}
          <Navbar />
          <main>{children}</main>
          <MainFooter />

          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: { background: "#333", color: "#fff" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
