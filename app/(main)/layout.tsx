// File: app/(main)/layout.tsx
import NavbarDashboard from "@/components/layout/navbardashboard";
import Footer from "@/components/layout/footer";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 bg-gray-50">
      <NavbarDashboard />
      <div className="relative z-10">{children}</div>
      <Footer />
    </div>
  );
}
