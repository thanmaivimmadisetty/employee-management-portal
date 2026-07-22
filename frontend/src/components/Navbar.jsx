import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Bell, Check } from "lucide-react";

const Navbar = ({ title }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const interval = setInterval(fetchNotifications, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: 1 } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: 1,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <header className="h-16 bg-gradient-to-r from-[#0B4F8A] to-[#082C4C] border-b border-[#1AA7EC]/30 shadow-lg flex items-center justify-between px-8">

      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          {title || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-6">

        {/* Notifications */}
        <div className="relative">

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-11 h-11 rounded-full bg-[#1AA7EC] hover:bg-[#1596D4] flex items-center justify-center transition-all duration-300 shadow-md"
          >
            <Bell className="w-5 h-5 text-white" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">

              <div className="flex items-center justify-between p-4 border-b">

                <h3 className="font-bold text-[#0B4F8A]">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-[#1AA7EC] hover:text-[#0B4F8A]"
                  >
                    Mark all read
                  </button>
                )}

              </div>

              <div className="max-h-72 overflow-y-auto">

                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    No Notifications
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b last:border-none ${
                        notif.isRead ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <p className="text-sm text-gray-700">
                        {notif.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>

                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="mt-2 flex items-center gap-1 text-xs text-[#1AA7EC] hover:text-[#0B4F8A]"
                        >
                          <Check className="w-3 h-3" />
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))
                )}

              </div>

            </div>
          )}

        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-[#1AA7EC] flex items-center justify-center text-white font-bold shadow-md">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </div>

          <div>
            <h4 className="text-white font-semibold">
              {user?.firstName} {user?.lastName}
            </h4>

            <p className="text-xs uppercase tracking-wide text-blue-200">
              {user?.roleName}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;
