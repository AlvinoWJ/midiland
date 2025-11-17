"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function UserCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}

const MobileNav = () => {
  const pathname = usePathname();
  const tabs = [
    { href: "/profile", title: "User Info", icon: UserCircleIcon },
    {
      href: "/profile/notifications",
      title: "Notifikasi",
      icon: BellIcon,
    },
    { href: "/profile/settings", title: "Pengaturan Akun", icon: SettingsIcon },
  ];

  return (
    <nav className="bg-white border-r py-4 px-2 flex flex-col gap-4 md:hidden">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`p-3 rounded-lg transition-colors ${
            pathname === tab.href ||
            (tab.href === "/profile/settings" &&
              pathname.startsWith("/profile/settings"))
              ? "bg-red-500 text-white"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
          title={tab.title}
        >
          <tab.icon className="h-6 w-6" />
        </Link>
      ))}
    </nav>
  );
};

const DesktopNav = () => {
  const pathname = usePathname();
  const tabs = [
    { href: "/profile", title: "User Info", icon: UserCircleIcon },
    {
      href: "/profile/notifications",
      title: "Notifications",
      icon: BellIcon,
    },
    {
      href: "/profile/settings",
      title: "Account Settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <nav className="hidden md:flex md:flex-col gap-2 w-1/4 lg:w-1/5 sticky top-24 self-start">
      {tabs.map((tab) => (
        <Button
          key={tab.href}
          variant="ghost"
          className={`justify-start gap-3 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-500 ${
            pathname === tab.href ||
            (tab.href === "/profile/settings" &&
              pathname.startsWith("/profile/settings"))
              ? "text-red-500 border-r-2 border-red-500 bg-red-50/50"
              : ""
          }`}
          asChild
        >
          <Link href={tab.href}>
            <tab.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{tab.title}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/profile/notifications") return "Notifikasi";
    if (pathname.startsWith("/profile/settings")) return "Pengaturan Akun";
    return "User Info";
  };
  const title = getTitle();

  return (
    <div className="flex h-screen w-full">
      <MobileNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-7 px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-8 hidden md:block">
            {title}
          </h1>
          <h1 className="text-2xl font-bold tracking-tight mb-6 md:hidden">
            {title}
          </h1>

          <div className="flex flex-col md:flex-row gap-10 w-full">
            <DesktopNav />
            <main className="w-full md:flex-1 md:w-3/4 lg:w-4/5 min-h-[500px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}