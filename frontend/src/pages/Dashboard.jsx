import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import StatCard from "../components/StatCard";

import {
  Users,
  Building2,
  Briefcase,
  CalendarCheck,
  Clock,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  const mockStats = {
    totalEmployees: 4,
    totalDepartments: 4,
    openJobs: 2,
    pendingLeaves: 1,
    attendanceRateToday: 75,

    departmentHeadcounts: [
      { name: "Administration", headcount: 1 },
      { name: "Human Resources", headcount: 1 },
      { name: "Engineering", headcount: 2 },
      { name: "Marketing", headcount: 0 },
    ],

    monthlyPayrollTotals: [
      { month: "Jan", total: 220000 },
      { month: "Feb", total: 245000 },
      { month: "Mar", total: 250000 },
      { month: "Apr", total: 285000 },
      { month: "May", total: 322500 },
    ],

    recentAttendanceLogs: [
      {
        employeeName: "John Manager",
        date: "2026-06-30",
        checkIn: "08:55 AM",
        status: "Present",
      },
      {
        employeeName: "David Employee",
        date: "2026-06-30",
        checkIn: "09:45 AM",
        status: "Late",
      },
      {
        employeeName: "John Manager",
        date: "2026-06-29",
        checkIn: "09:00 AM",
        status: "Present",
      },
      {
        employeeName: "David Employee",
        date: "2026-06-29",
        checkIn: "09:15 AM",
        status: "Present",
      },
    ],
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/reports/dashboard");
        setStats(res.data);
        setDbConnected(true);
      } catch (err) {
        console.warn("Using Demo Dashboard", err);
        setStats(mockStats);
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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

      <div className="rounded-3xl bg-gradient-to-r from-[#0B4F8A] via-[#0A3D6E] to-[#1AA7EC] p-8 text-white shadow-xl">

        <div className="flex flex-col items-center justify-between lg:flex-row">

          <div>

            <h1 className="text-3xl font-bold">
  Welcome, {user?.firstName || user?.name || "User"} 👋
</h1>

            <div className="mt-5 flex flex-wrap gap-3">

              <span className="rounded-xl bg-white/20 px-4 py-2 text-sm">
                Role: {role}
              </span>

              <span className="rounded-xl bg-white/20 px-4 py-2 text-sm">
                {today}
              </span>

            </div>

          </div>

          <div className="mt-8 lg:mt-0">

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

              <div className="flex items-center gap-3">

                <Clock className="h-8 w-8" />

                <div>

                  <p className="text-sm text-blue-100">
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

     {/* KPI Statistics */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Employees"
          value={stats?.totalEmployees ?? 0}
          icon={Users}
          trend="+5%"
          trendType="positive"
          description="Total Employees"
        />

        <StatCard
          title="Departments"
          value={stats?.totalDepartments ?? 0}
          icon={Building2}
          trend="Active"
          trendType="neutral"
          description="Business Units"
        />

        <StatCard
          title="Open Jobs"
          value={stats?.openJobs ?? 0}
          icon={Briefcase}
          trend="Hiring"
          trendType="positive"
          description="Current Vacancies"
        />

        <StatCard
          title="Attendance"
          value={`${stats?.attendanceRateToday ?? 0}%`}
          icon={CalendarCheck}
          trend={
            (stats?.attendanceRateToday ?? 0) >= 70
              ? "Excellent"
              : "Needs Attention"
          }
          trendType={
            (stats?.attendanceRateToday ?? 0) >= 70
              ? "positive"
              : "negative"
          }
          description="Today's Attendance"
        />
      </div>

    </div>
  );
};

export default Dashboard;
