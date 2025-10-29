// File: app/(main)/layout.tsx

import Image from "next/image";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 bg-gray-50">
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/indonesia.png"
          alt="Peta Latar Belakang"
          layout="fill"
          objectFit="cover"
          quality={50}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}