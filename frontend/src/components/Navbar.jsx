import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Bell, Check } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, isRead: 1 } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: 1 }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-cyan-200 shadow-sm flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-bold text-cyan-800">
          {title || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative">

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-11 h-11 rounded-full bg-cyan-100 hover:bg-cyan-200 transition flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-cyan-700" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-cyan-200 p-4 z-50">

              <div className="flex justify-between items-center mb-3">

                <h3 className="font-semibold text-cyan-800">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-cyan-700 hover:underline"
                  >
                    Mark all read
                  </button>
                )}

              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">

                {notifications.length === 0 ? (

                  <p className="text-gray-500 text-center py-4">
                    No notifications
                  </p>

                ) : (

                  notifications.map(notif => (

                    <div
                      key={notif.id}
                      className={`rounded-lg p-3 border ${
                        notif.isRead
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-cyan-50 border-cyan-300'
                      }`}
                    >

                      <p className="text-sm text-gray-700">
                        {notif.message}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>

                      {!notif.isRead && (
                        <button
                          onClick={() =>
                            handleMarkRead(notif.id)
                          }
                          className="mt-2 flex items-center gap-1 text-cyan-700 text-xs"
                        >
                          <Check className="w-3 h-3" />
                          Mark as read
                        </button>
                      )}

                    </div>

                  ))

                )}

              </div>

            </div>
          )}

        </div>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </div>

          <div>

            <h4 className="font-semibold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h4>

            <p className="text-xs text-cyan-700 uppercase">
              {user?.roleName}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;
