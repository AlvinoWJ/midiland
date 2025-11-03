// File: app/auth/error/page.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function AuthErrorPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const serverError = searchParams.get("error");
    if (serverError) {
      setErrorMessage(serverError);
      return;
    }

    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Hapus '#'
      const clientError =
        params.get("error_description") || params.get("error");
      if (clientError) {
        setErrorMessage(clientError);
      }
    }

    if (!serverError && !hash) {
      setErrorMessage("unspecified_error");
    }
  }, [searchParams]);

  const getFriendlyMessage = (error: string | null): string => {
    if (!error) return "Terjadi kesalahan yang tidak diketahui.";

    const decodedError = decodeURIComponent(error.replace(/\+/g, " "));

    switch (decodedError) {
      case "access_denied":
        return "Akses ditolak. Izin diperlukan untuk melanjutkan.";
      case "invalid_credentials":
        return "Email atau password yang Anda masukkan salah.";
      case "unspecified_error":
        return "Terjadi kesalahan yang tidak diketahui.";
      default:
        if (decodedError.length > 1 && decodedError.length < 100) {
          return decodedError;
        }
        return "Terjadi kesalahan. Silakan coba lagi.";
    }
  };

  const friendlyMessage = getFriendlyMessage(errorMessage);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login Gagal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{friendlyMessage}</p>

              {errorMessage && errorMessage !== "unspecified_error" && (
                <p className="text-xs text-red-500">
                  Kode Error:{" "}
                  {decodeURIComponent(errorMessage.replace(/\+/g, " "))}
                </p>
              )}

              <Button asChild className="w-full">
                <Link href="/auth/login">Kembali ke Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
