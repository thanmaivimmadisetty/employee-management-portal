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
              Welcome, {user?.firstName} 👋
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

    

        {/* Monthly Payroll */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">

          <h3 className="mb-6 text-xl font-bold text-[#0B4F8A]">
            Monthly Payroll
          </h3>

          <ResponsiveContainer width="100%" height={300}>

            <AreaChart data={stats?.monthlyPayrollTotals}>

              <defs>

                <linearGradient
                  id="payrollGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#1AA7EC"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#1AA7EC"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                stroke="#E5E7EB"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#64748B", fontSize: 12 }}
              />

              <YAxis
                tick={{ fill: "#64748B", fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                }}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#0B4F8A"
                strokeWidth={3}
                fill="url(#payrollGradient)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Recent Attendance */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-bold text-[#0B4F8A]">
              Recent Attendance
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Latest employee attendance records
            </p>

          </div>

          <div className="rounded-xl bg-[#1AA7EC] px-4 py-2 font-semibold text-white shadow">
            {stats?.recentAttendanceLogs?.length || 0} Records
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="bg-[#0B4F8A] text-white">

                <th className="rounded-l-xl px-6 py-4 text-left">
                  Employee
                </th>

                <th className="px-6 py-4 text-left">
                  Date
                </th>

                <th className="px-6 py-4 text-left">
                  Check In
                </th>

                <th className="rounded-r-xl px-6 py-4 text-center">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {stats?.recentAttendanceLogs?.length > 0 ? (

                stats.recentAttendanceLogs.map((log, index) => (

                  <tr
                    key={index}
                    className="border-b transition hover:bg-blue-50"
                  >

                    <td className="px-6 py-4 font-semibold text-[#0B4F8A]">
                      {log.employeeName}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {log.date}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {log.checkIn || "--:--"}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          log.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : log.status === "Late"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.status}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={4}
                    className="py-10 text-center text-gray-500"
                  >
                    No attendance records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
