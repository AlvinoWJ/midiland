// File: app/auth/error/page.tsx
// (Ini adalah file BARU Anda)

import { Suspense } from "react";
import AuthErrorClient from "./auth-error-client";

// Komponen ini sekarang menjadi Server Component
export default function AuthErrorPage() {
  return (
    // Bungkus Client Component Anda dengan <Suspense>
    // fallback={null} berarti tidak menampilkan apa-apa selagi menunggu.
    <Suspense fallback={null}>
      <AuthErrorClient />
    </Suspense>
  );
}
