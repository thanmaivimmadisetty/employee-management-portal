import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StatCard from '../components/StatCard';

import {
  Users,
  Building2,
  Briefcase,
  CalendarCheck,
  Clock
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  // Demo data shown when backend is unavailable
  const mockStats = {
    totalEmployees: 4,
    totalDepartments: 4,
    openJobs: 2,
    pendingLeaves: 1,
    attendanceRateToday: 75,

    departmentHeadcounts: [
      {
        name: 'Administration',
        headcount: 1,
      },
      {
        name: 'Human Resources',
        headcount: 1,
      },
      {
        name: 'Engineering',
        headcount: 2,
      },
      {
        name: 'Marketing',
        headcount: 0,
      },
    ],

    monthlyPayrollTotals: [
      {
        month: 'Jan',
        total: 220000,
      },
      {
        month: 'Feb',
        total: 245000,
      },
      {
        month: 'Mar',
        total: 250000,
      },
      {
        month: 'Apr',
        total: 285000,
      },
      {
        month: 'May',
        total: 322500,
      },
    ],

    recentAttendanceLogs: [
      {
        employeeName: 'John Manager',
        date: '2026-06-30',
        checkIn: '08:55 AM',
        status: 'Present',
      },
      {
        employeeName: 'David Employee',
        date: '2026-06-30',
        checkIn: '09:45 AM',
        status: 'Late',
      },
      {
        employeeName: 'John Manager',
        date: '2026-06-29',
        checkIn: '09:00 AM',
        status: 'Present',
      },
      {
        employeeName: 'David Employee',
        date: '2026-06-29',
        checkIn: '09:15 AM',
        status: 'Present',
      },
    ],
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/reports/dashboard');

        setStats(res.data);
        setDbConnected(true);
      } catch (error) {
        console.warn(
          'Dashboard API unavailable. Using mock data.',
          error
        );

        setStats(mockStats);
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const role = user?.roleName || 'Employee';
  const today = new Date().toLocaleDateString();
  if (loading) {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="flex flex-col items-center">

        <div className="w-16 h-16 border-4 border-[#0F8B8D]/30 border-t-[#0B2E59] rounded-full animate-spin"></div>

        <h2 className="mt-6 text-2xl font-bold text-[#0B2E59]">
          EMP PORTAL
        </h2>

        <p className="text-gray-500 mt-2">
          Loading Dashboard...
        </p>

      </div>
    </div>
  );
}

return (
  <div className="space-y-8 font-sans">

    {!dbConnected && (
      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl">
        <strong>Demo Mode:</strong> Backend database is unavailable.
        Showing sample dashboard data.
      </div>
    )}

    {/* Welcome Banner */}

    <div className="bg-gradient-to-r from-[#0B2E59] to-[#0F8B8D] rounded-3xl shadow-xl p-8 text-white">

      <div className="flex flex-col lg:flex-row justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Welcome, {user?.firstName} 👋
          </h1>

          <p className="mt-2 text-teal-100 max-w-3xl">
            Welcome to the Employee Management Portal.
            Manage employees, attendance, payroll,
            departments and recruitment from one dashboard.
          </p>

          <div className="mt-5 flex gap-3 flex-wrap">

            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm">
              Role: {role}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm">
              {today}
            </span>

          </div>

        </div>

        <div className="mt-8 lg:mt-0">

          <div className="bg-white/10 rounded-2xl px-6 py-5">

            <div className="flex items-center gap-3">

              <Clock className="w-8 h-8" />

              <div>

                <p className="text-sm text-teal-100">
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

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

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
    description="Vacancies"
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

{/* Charts */}

<div className="grid lg:grid-cols-2 gap-6">

  {/* Department Headcount */}

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">

    <h3 className="text-xl font-bold text-[#0B2E59] mb-6">
      Department Headcount
    </h3>

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={stats?.departmentHeadcounts}>

        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

        <XAxis
          dataKey="name"
          tick={{ fill: "#475569", fontSize: 12 }}
        />

        <YAxis
          tick={{ fill: "#475569", fontSize: 12 }}
        />

        <Tooltip />

        <Bar
          dataKey="headcount"
          fill="#0F8B8D"
          radius={[8, 8, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  {/* Monthly Payroll */}

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">

    <h3 className="text-xl font-bold text-[#0B2E59] mb-6">
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
              stopColor="#0F8B8D"
              stopOpacity={0.8}
            />

            <stop
              offset="95%"
              stopColor="#0F8B8D"
              stopOpacity={0}
            />

          </linearGradient>

        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

        <XAxis
          dataKey="month"
          tick={{ fill: "#475569", fontSize: 12 }}
        />

        <YAxis
          tick={{ fill: "#475569", fontSize: 12 }}
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
          stroke="#0B2E59"
          strokeWidth={3}
          fill="url(#payrollGradient)"
        />

      </AreaChart>

    </ResponsiveContainer>

  </div>

</div>

{/* Recent Attendance */}

<div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">

  <div className="flex items-center justify-between mb-6">

    <div>

      <h3 className="text-2xl font-bold text-[#0B2E59]">
        Recent Attendance
      </h3>

      <p className="text-gray-500 text-sm mt-1">
        Employee attendance records
      </p>

    </div>

    <div className="bg-[#0F8B8D] text-white px-4 py-2 rounded-xl font-semibold">

      {stats?.recentAttendanceLogs?.length || 0} Records

    </div>

  </div>

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead>

        <tr className="bg-[#0B2E59] text-white">

          <th className="px-6 py-4 text-left rounded-l-xl">
            Employee
          </th>

          <th className="px-6 py-4 text-left">
            Date
          </th>

          <th className="px-6 py-4 text-left">
            Check In
          </th>

          <th className="px-6 py-4 text-center rounded-r-xl">
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {stats?.recentAttendanceLogs?.length > 0 ? (

          stats.recentAttendanceLogs.map((log, index) => (

            <tr
              key={index}
              className="border-b hover:bg-teal-50 transition"
            >

              <td className="px-6 py-4 font-semibold text-[#0B2E59]">
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
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
              className="text-center py-10 text-gray-500"
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
  
