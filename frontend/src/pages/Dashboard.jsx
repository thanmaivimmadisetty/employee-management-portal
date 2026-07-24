import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  CalendarDays,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  const [todayStatus, setTodayStatus] = useState({
    checkedIn: false,
    checkedOut: false,
    log: null,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await api.get("/reports/dashboard");

        const attendance = await api.get("/attendance/today");

        setTodayStatus(attendance.data);

        setDbConnected(true);
      } catch (err) {
        console.warn("Demo Dashboard");

        setDbConnected(false);

        setTodayStatus({
          checkedIn: false,
          checkedOut: false,
          log: null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.post("/attendance/check-in");

      const attendance = await api.get("/attendance/today");

      setTodayStatus(attendance.data);
    } catch (err) {
      alert(err.response?.data?.message || "Check In Failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post("/attendance/check-out");

      const attendance = await api.get("/attendance/today");

      setTodayStatus(attendance.data);
    } catch (err) {
      alert(err.response?.data?.message || "Check Out Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-2xl font-bold text-[#0B4F8A]">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {!dbConnected && (
        <div className="rounded-xl border border-yellow-300 bg-yellow-100 px-4 py-3 text-yellow-800">
          <strong>Demo Mode:</strong> Backend unavailable. Showing sample data.
        </div>
      )}

      <div className="rounded-3xl bg-gradient-to-r from-[#0B4F8A] via-[#0A3D6E] to-[#1AA7EC] p-8 text-white shadow-xl">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName || user?.name || "User"} 👋
            </h1>

            <p className="mt-2 text-blue-100">
              Employee Dashboard
            </p>

          </div>

          <div className="rounded-2xl bg-white/10 p-6">

            <div className="flex items-center gap-3">

              <Clock className="w-8 h-8" />

              <div>

                <p className="text-sm">
                  Today's Date
                </p>

                <h2 className="font-bold">
                  {new Date().toLocaleDateString()}
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Project Details */}
      <div className="rounded-2xl bg-white shadow-lg border-l-4 border-[#0B4F8A] p-6">
        <div className="flex items-center gap-3 mb-4">
          <FolderKanban className="w-8 h-8 text-[#0B4F8A]" />
          <h3 className="text-lg font-bold text-[#0B4F8A]">
            Project Details
          </h3>
        </div>

        <p className="font-semibold text-gray-800">
          Invoice Generation System
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Status: In Progress
        </p>

        <p className="text-sm text-gray-500">
          Deadline: 30 Jul 2026
        </p>
      </div>

      {/* Attendance */}
      <div className="rounded-2xl bg-white shadow-lg border-l-4 border-green-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-green-600" />
          <h3 className="text-lg font-bold text-green-700">
            Today's Attendance
          </h3>
        </div>

        <p className="text-sm text-gray-500">
          Login Time
        </p>

        <h2 className="text-xl font-bold">
          {todayStatus.log?.checkIn || "--:--"}
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          Logout Time
        </p>

        <h2 className="text-xl font-bold">
          {todayStatus.log?.checkOut || "--:--"}
        </h2>

        <div className="mt-5">
          {!todayStatus.checkedIn && (
            <button
              onClick={handleCheckIn}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Check In
            </button>
          )}

          {todayStatus.checkedIn && !todayStatus.checkedOut && (
            <button
              onClick={handleCheckOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Check Out
            </button>
          )}

          {todayStatus.checkedOut && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              Shift Completed
            </div>
          )}
        </div>
      </div>
        {/* High Priority Tasks */}
      <div className="rounded-2xl bg-white shadow-lg border-l-4 border-red-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ListTodo className="w-8 h-8 text-red-600" />
          <h3 className="text-lg font-bold text-red-600">
            High Priority Tasks
          </h3>
        </div>

        <ul className="space-y-3 text-sm text-gray-700">
          <li>• Complete Invoice Module</li>
          <li>• Review Employee Requests</li>
          <li>• Update Daily Tracker</li>
        </ul>
      </div>

      {/* Leave Details */}
      <div className="rounded-2xl bg-white shadow-lg border-l-4 border-purple-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="w-8 h-8 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-700">
            Leave Details
          </h3>
        </div>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Applied:</span> 2
          </p>
          <p>
            <span className="font-semibold">Approved:</span> 1
          </p>
          <p>
            <span className="font-semibold">Remaining:</span> 10
          </p>
        </div>
      </div>
        </div>
    </div>
  );
};

export default Dashboard;
