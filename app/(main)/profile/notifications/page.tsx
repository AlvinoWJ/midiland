"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Notification = {
  id: string;
  title: string | null;
  body: string | null;
  is_read: boolean;
  created_at: string;
  type: string | null;
  ulok_eksternal_id: string | null;
  user_id: string;
};

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

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("notifications_midiland")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil semua notifikasi:", error.message);
      } else {
        setNotifications(data || []);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [supabase]);

  const handleNotificationClick = async (
    e: React.MouseEvent,
    notification: Notification,
    linkTo: string 
  ) => {
    e.preventDefault();

    if (!notification.is_read) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );

      try {
        const { error } = await supabase
          .from("notifications_midiland")
          .update({ is_read: true })
          .eq("id", notification.id);

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Gagal memperbarui status notifikasi:", error);
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notification.id ? { ...n, is_read: false } : n
          )
        );
      } finally {
        if (linkTo !== "#") router.push(linkTo);
      }
    } else {
      if (linkTo !== "#") router.push(linkTo);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center min-h-[200px] flex flex-col justify-center items-center">
          <BellIcon className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            Tidak Ada Notifikasi
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Saat ada pembaruan, Anda akan melihatnya di sini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {notifications.map((item) => {
            const linkTo = item.ulok_eksternal_id
              ? `/status?selected=${item.ulok_eksternal_id}`
              : "#";

            return (
              <li key={item.id}>
                <Link
                  href={linkTo}
                  onClick={(e) => handleNotificationClick(e, item, linkTo)}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 p-2 rounded-full ${
                        item.is_read ? "bg-gray-100" : "bg-red-100"
                      }`}
                    >
                      <BellIcon
                        className={`h-5 w-5 ${
                          item.is_read ? "text-gray-500" : "text-red-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <picture
                          className={`text-sm font-semibold ${
                            item.is_read ? "text-gray-600" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </picture>
                        {!item.is_read && (
                          <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 ml-2"></span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-0.5 ${
                          item.is_read ? "text-gray-500" : "text-gray-700"
                        }`}
                      >
                        {item.body}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default function NotificationsPage() {
  return <NotificationList />;
}