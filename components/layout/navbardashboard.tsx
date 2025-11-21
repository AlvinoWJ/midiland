"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ProfileMenu } from "./ProfileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { Bell, Loader2, ChevronRight, Package } from "lucide-react";

type Notification = {
  id: string;
  title: string | null;
  body: string | null;
  link_to: string | null;
  is_read: boolean;
  created_at: string;
  type: string | null;
  ulok_eksternal_id: string | null;
  user_id: string;
};

function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); 
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);
      } else {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notifications_midiland")
        .select("*")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil notifikasi:", error.message);
      } else {
        setNotifications(data || []);
      }
      setIsLoading(false);
    };

    fetchInitialData();
  }, [supabase, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`realtime-notifications-bell-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications_midiland",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload: RealtimePostgresInsertPayload<Notification>) => {
          const newNotification = payload.new;

          setNotifications((prev) => {
            return [
              newNotification,
              ...prev.filter((n) => n.id !== newNotification.id),
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications_midiland",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload: RealtimePostgresUpdatePayload<Notification>) => {
          const updatedNotification = payload.new;

          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updatedNotification.id ? updatedNotification : n
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserId]);

  const hasUnread = notifications.some((n) => !n.is_read);

  const handleNotificationClick = async (
    e: React.MouseEvent,
    notification: Notification,
    linkTo: string
  ) => {
    e.preventDefault();
    
    setIsOpen(false);

    if (!notification.is_read) {
      const originalNotifications = [...notifications];
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );

      try {
        const { error } = await supabase
          .from("notifications_midiland")
          .update({ is_read: true })
          .eq("id", notification.id);
        if (error) throw error;
      } catch (error) {
        console.error("Gagal update notifikasi:", error);
        setNotifications(originalNotifications);
      }
    }

    router.push(linkTo);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return notifDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group">
          <Bell className="h-5 w-5 text-gray-700 group-hover:text-red-600 transition-colors" />

          {!isLoading && hasUnread && (
            <>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-600 rounded-full" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 p-0 border-0 rounded-lg overflow-visible relative"
        sideOffset={8}
      >
        <div className="shadow-lg rounded-lg relative">
          <div
            className="absolute -top-2 right-3 w-4 h-4 transform rotate-45 z-30"
            style={{ backgroundColor: "#DC2626" }}
          ></div>

          <div
            className="px-5 py-4 relative z-20 rounded-t-lg"
            style={{ backgroundColor: "#DC2626" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Notifikasi</h3>
              {hasUnread && (
                <span className="text-xs font-bold text-red-600 bg-white px-3 py-1 rounded-full">
                  {notifications.filter((n) => !n.is_read).length} Baru
                </span>
              )}
            </div>
          </div>

          <div
            className="max-h-[400px] overflow-y-auto bg-white notification-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db transparent",
            }}
          >
            <style jsx>{`
              .notification-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .notification-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .notification-scroll::-webkit-scrollbar-thumb {
                background-color: #d1d5db;
                border-radius: 3px;
              }
              .notification-scroll::-webkit-scrollbar-thumb:hover {
                background-color: #9ca3af;
              }
            `}</style>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-3" />
                <p className="text-sm text-gray-600">Memuat notifikasi...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Belum ada notifikasi
                </p>
                <p className="text-xs text-gray-500">
                  Notifikasi baru akan muncul di sini
                </p>
              </div>
            ) : (
              <>
                {notifications.map((item, index) => {
                  const linkHref = item.ulok_eksternal_id
                    ? `/status?selected=${item.ulok_eksternal_id}`
                    : "/profile/notifications";

                  return (
                    <div key={item.id}>
                      <DropdownMenuItem
                        className="p-0 focus:bg-gray-50"
                        asChild
                      >
                        <Link
                          href={linkHref}
                          onClick={(e) =>
                            handleNotificationClick(e, item, linkHref)
                          }
                          className={`flex items-center gap-3 px-4 py-3.5 transition-all duration-200 hover:bg-gray-50 ${
                            !item.is_read ? "bg-red-50/50" : "bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                                item.is_read ? "bg-gray-100" : "bg-red-600"
                              }`}
                            >
                              <Package
                                className={`h-5 w-5 ${
                                  item.is_read ? "text-gray-600" : "text-white"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p
                                  className={`text-sm leading-snug ${
                                    item.is_read
                                      ? "text-gray-700 font-medium"
                                      : "text-gray-900 font-bold"
                                  }`}
                                >
                                  {item.title}
                                </p>
                                {!item.is_read && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-1.5" />
                                )}
                              </div>
                              <p
                                className={`text-xs line-clamp-2 mb-2 ${
                                  item.is_read
                                    ? "text-gray-500"
                                    : "text-gray-700"
                                }`}
                              >
                                {item.body}
                              </p>
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-gray-500">
                                  {formatTimeAgo(item.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        </Link>
                      </DropdownMenuItem>

                      {index < notifications.length - 1 && (
                        <div className="px-4 bg-white">
                          <div className="h-px bg-gray-200" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator className="mx-4 my-0 bg-gray-200" />
                <DropdownMenuItem asChild className="p-0 focus:bg-white">
                  <div className="p-3 bg-white rounded-b-lg w-full">
                    <Link
                      href="/profile/notifications"
                      onClick={() => setIsOpen(false)} 
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold text-red-600 hover:text-white bg-white hover:bg-red-600 rounded-md transition-all duration-200 border-2 border-red-600"
                    >
                      Lihat Semua Notifikasi
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function NavbarDashboard() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pengajuan Properti", href: "/input" },
    { name: "Status Properti", href: "/status" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          <span className="text-primary">Midi</span>
          <span className="text-secondary">Land</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-all hover:text-red-600 relative pb-1 ${
                isActive(item.href) ? "text-red-600" : "text-gray-700"
              }`}
            >
              {item.name}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}