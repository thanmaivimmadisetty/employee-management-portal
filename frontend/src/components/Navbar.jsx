import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Bell, Check, Trash } from 'lucide-react';

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
      // Poll notifications every 30 seconds for live updates
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: 1 } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8 z-10">
      {/* Title */}
      <h2 className="text-xl font-bold tracking-tight text-slate-100 font-sans">
        {title || 'Dashboard'}
      </h2>

      {/* Action Area */}
      <div className="flex items-center gap-6">
        {/* Notifications Icon and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 flex items-center justify-center transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white font-extrabold text-[10px] flex items-center justify-center border border-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel border border-slate-800 shadow-2xl p-4 z-50 text-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-600/30 text-brand-400 font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl border text-xs transition-all relative ${
                        notif.isRead
                          ? 'bg-slate-900/20 border-slate-800/40 text-slate-400'
                          : 'bg-brand-950/20 border-brand-500/20 text-slate-200'
                      }`}
                    >
                      <p className="pr-4 leading-relaxed">{notif.message}</p>
                      <span className="text-[9px] text-slate-500 block mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="absolute top-2.5 right-2 text-slate-400 hover:text-brand-400"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-brand-400">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div className="text-left hidden md:block">
            <h4 className="text-sm font-semibold text-slate-200">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
              {user?.roleName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
