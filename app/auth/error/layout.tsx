// File: app/auth/error/layout.tsx

export default function AuthErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const instantCloseScript = `
    if (window.opener) {
      // Jika ini adalah popup, tutup segera tanpa render apapun.
      window.close();
    }
  `;

  return (
    <html lang="id">
      <head>
        <title>Autentikasi...</title>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <script
          dangerouslySetInnerHTML={{ __html: instantCloseScript }}
        />
        {children}
      </body>
    </html>
  );
}