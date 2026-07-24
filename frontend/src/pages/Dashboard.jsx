import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Clock } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await api.get("/reports/dashboard");
        setDbConnected(true);
      } catch (err) {
        console.warn("Demo Mode");
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const role = user?.roleName || "Employee";
  const today = new Date().toLocaleDateString();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#1AA7EC]/30 border-t-[#0B4F8A]"></div>

          <h2 className="mt-6 text-2xl font-bold text-[#0B4F8A]">
            EMP PORTAL
          </h2>

          <p className="mt-2 text-gray-500">
            Loading Dashboard...
          </p>
        </div>
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

      {/* Welcome Banner */}

      <div className="rounded-3xl bg-gradient-to-r from-[#0B4F8A] via-[#0A3D6E] to-[#1AA7EC] p-8 text-white shadow-xl">

        <div className="flex flex-col justify-between lg:flex-row">

          <div>

            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName || user?.name || "User"} 👋
            </h1>

            <div className="mt-5 flex gap-3 flex-wrap">

              <span className="rounded-xl bg-white/20 px-4 py-2 text-sm">
                Role : {role}
              </span>

              <span className="rounded-xl bg-white/20 px-4 py-2 text-sm">
                {today}
              </span>

            </div>

          </div>

          <div className="mt-6 lg:mt-0">

            <div className="rounded-2xl bg-white/10 p-6">

              <div className="flex items-center gap-3">

                <Clock className="w-8 h-8" />

                <div>

                  <p className="text-sm">
                    Today's Date
                  </p>

                  <h2 className="text-xl font-bold">
                    {today}
                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Dashboard Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Project */}

        <div className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-[#0B4F8A]">

          <h3 className="text-lg font-bold text-[#0B4F8A]">
            Project Details
          </h3>

          <p className="mt-4 font-semibold">
            Invoice Generation System
          </p>

          <p className="text-gray-500 mt-2">
            Status : In Progress
          </p>

          <p className="text-gray-500">
            Deadline : 30 Jul 2026
          </p>

        </div>

        {/* Login */}

        <div className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-green-500">

          <h3 className="text-lg font-bold text-green-700">
            Login Details
          </h3>

          <p className="mt-4">
            Login Time
          </p>

          <h2 className="text-xl font-bold">
            09:00 AM
          </h2>

          <p className="mt-3">
            Logout Time
          </p>

          <h2 className="text-xl font-bold text-red-500">
            --
          </h2>

        </div>

        {/* Tasks */}

        <div className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-red-500">

          <h3 className="text-lg font-bold text-red-600">
            High Priority Tasks
          </h3>

          <ul className="mt-4 space-y-2 text-sm">
            <li>• Complete Invoice Module</li>
            <li>• Review Employee Requests</li>
            <li>• Update Daily Tracker</li>
          </ul>

        </div>

        {/* Leaves */}

        <div className="rounded-2xl bg-white shadow-lg p-6 border-l-4 border-purple-500">

          <h3 className="text-lg font-bold text-purple-700">
            Leave Details
          </h3>

          <p className="mt-4">
            Applied : 2
          </p>

          <p>
            Approved : 1
          </p>

          <p>
            Remaining : 10
          </p>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
