import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme"; // Import defaultTheme

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tambahkan warna kustom dari design system
      colors: {
        midiland: {
          primary: "#D11A22", // Merah
          secondary: "#305D9F", // Biru
          approved: "#2ECC71", // Hijau
          inprogress: "#FFC107", // Kuning
          text: "#2E2E2E", // Warna Teks Utama
          background: "#F8F9FA", // Warna Latar Utama
        },

        border: "hsl(var(--border))", // Biarkan ini jika masih menggunakan variabel CSS
        input: "hsl(var(--input))", // Biarkan ini jika masih menggunakan variabel CSS
        ring: "hsl(var(--ring))", // Biarkan ini jika masih menggunakan variabel CSS
        background: "#F8F9FA", // Langsung dari Design System
        foreground: "#2E2E2E", // Langsung dari Design System

        primary: {
          DEFAULT: "#D11A22", // Merah sebagai primary
          foreground: "hsl(var(--primary-foreground))", // Tetap putih/terang untuk kontras
        },
        secondary: {
          DEFAULT: "#305D9F", // Biru sebagai secondary
          foreground: "hsl(var(--secondary-foreground))", // Sesuaikan jika perlu
        },
        destructive: {
          // Anda bisa gunakan Merah Primary di sini juga jika cocok
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Mungkin sesuaikan dengan shade abu-abu dari #F8F9FA
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#2ECC71", // Hijau sebagai accent (untuk tombol Approved/Primary?)
          foreground: "hsl(var(--accent-foreground))", // Teks putih/gelap tergantung kontras
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Tambahkan Font Family Poppins
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans], // Gunakan variabel CSS
      },
      // Tambahkan Ukuran Font Kustom
      fontSize: {
        "heading-1": ["35px", { fontWeight: "600" }], // H1: 35px SemiBold
        "heading-2": ["24px", { fontWeight: "600" }], // H2: 24px SemiBold
        "heading-3": ["17px", { fontWeight: "400" }], // H3: 17px Regular
        normal: ["15px", { fontWeight: "400" }], // Normal: 15px Regular
        label: ["15px", { fontWeight: "600" }], // Label: 15px SemiBold
        // Anda bisa menambahkan alias lain jika perlu, misal:
        // 'base': ['15px', { fontWeight: '400' }], // Ganti base default jika mau
      },
      // Tambahkan Font Weight jika perlu (600 sudah ada sebagai 'semibold')
      // fontWeight: {
      //   regular: '400',
      //   semibold: '600',
      // }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
