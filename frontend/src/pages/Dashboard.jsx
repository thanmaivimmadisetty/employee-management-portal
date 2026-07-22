import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import { 
  Users, 
  Building2, 
  Briefcase, 
  CalendarCheck, 
  TrendingUp, 
  Clock, 
  AlertTriangle 
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

  // Fallback mock data in case the backend DB connection is not configured yet
  const mockStats = {
    totalEmployees: 4,
    totalDepartments: 4,
    openJobs: 2,
    pendingLeaves: 1,
    attendanceRateToday: 75,
    departmentHeadcounts: [
      { name: 'Administration', headcount: 1 },
      { name: 'Human Resources', headcount: 1 },
      { name: 'Engineering', headcount: 2 },
      { name: 'Marketing', headcount: 0 }
    ],
    monthlyPayrollTotals: [
      { month: 'Jan 2026', total: 220000 },
      { month: 'Feb 2026', total: 245000 },
      { month: 'Mar 2026', total: 250000 },
      { month: 'Apr 2026', total: 285000 },
      { month: 'May 2026', total: 322500 }
    ],
    recentAttendanceLogs: [
      { date: '2026-06-30', checkIn: '08:55:00', status: 'Present', employeeName: 'John Manager' },
      { date: '2026-06-30', checkIn: '09:45:00', status: 'Late', employeeName: 'David Employee' },
      { date: '2026-06-29', checkIn: '09:00:00', status: 'Present', employeeName: 'John Manager' },
      { date: '2026-06-29', checkIn: '09:15:00', status: 'Present', employeeName: 'David Employee' }
    ]
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        setStats(res.data);
        setDbConnected(true);
      } catch (err) {
        console.warn('Could not connect to MySQL. Falling back to mock data for demonstration.', err);
        setStats(mockStats);
        setDbConnected(false); // Show notice that mock data is used
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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

const role = user?.roleName;
const today = new Date().toLocaleDateString();
  return (
    <div className="space-y-8 font-sans">
    {/* Welcome Banner */}

<div className="bg-gradient-to-r from-[#0B2E59] to-[#0F8B8D] rounded-3xl shadow-xl p-8 text-white">

  <div className="flex flex-col lg:flex-row justify-between items-center">

    <div>

      <h1 className="text-3xl font-bold">
        Welcome, {user?.firstName} 👋
      </h1>

      <p className="mt-2 text-teal-100">
        Welcome to the Employee Management Portal.
        Monitor employees, payroll, attendance, recruitment,
        and organizational performance from one place.
      </p>

    </div>

    <div className="mt-6 lg:mt-0 bg-white/10 rounded-2xl px-6 py-4">

      <div className="flex items-center gap-3">

        <Clock className="w-6 h-6" />

        <div>

          <p className="text-sm">
            Today
          </p>

          <h3 className="font-bold">
            {today}
          </h3>

        </div>

      </div>

    </div>

  </div>

</div>
      )}

   {/* KPI Statistics */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  <StatCard
    title="Employees"
    value={stats?.totalEmployees || 0}
    icon={Users}
    trend="+5%"
    trendType="positive"
    description="Total Employees"
  />

  <StatCard
    title="Departments"
    value={stats?.totalDepartments || 0}
    icon={Building2}
    description="Business Units"
  />

  <StatCard
    title="Open Jobs"
    value={stats?.openJobs || 0}
    icon={Briefcase}
    trend="Hiring"
    trendType="neutral"
    description="Vacancies"
  />

  <StatCard
    title="Attendance"
    value={`${stats?.attendanceRateToday || 0}%`}
    icon={CalendarCheck}
    trend={
      stats?.attendanceRateToday >= 70
        ? "Excellent"
        : "Needs Attention"
    }
    trendType={
      stats?.attendanceRateToday >= 70
        ? "positive"
        : "negative"
    }
    description="Today's Attendance"
  />

</div>

      <div className="grid lg:grid-cols-2 gap-6">

  {/* Department Chart */}

  <div className="bg-white rounded-3xl shadow-lg p-6">

    <h3 className="text-lg font-bold text-[#0B2E59] mb-6">

      Department Headcount

    </h3>

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={stats?.departmentHeadcounts}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="headcount"
          fill="#0F8B8D"
          radius={[8,8,0,0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  {/* Payroll */}

  <div className="bg-white rounded-3xl shadow-lg p-6">

    <h3 className="text-lg font-bold text-[#0B2E59] mb-6">

      Monthly Payroll

    </h3>

    <ResponsiveContainer width="100%" height={300}>

      <AreaChart data={stats?.monthlyPayrollTotals}>

        <defs>

          <linearGradient
            id="payroll"
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

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month"/>

        <YAxis/>

        <Tooltip/>

        <Area
          type="monotone"
          dataKey="total"
          stroke="#0B2E59"
          fill="url(#payroll)"
          strokeWidth={3}
        />

      </AreaChart>

    </ResponsiveContainer>

  </div>

</div>
          {/* Monthly Payroll Line Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">
              Monthly Payroll Expenditures
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyPayrollTotals} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#f1f5f9' }}
                    itemStyle={{ color: '#8b5cf6' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPayroll)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

     {/* Recent Attendance */}

<div className="bg-white rounded-3xl shadow-lg p-6">

  <div className="flex items-center justify-between mb-6">

    <div>

      <h3 className="text-xl font-bold text-[#0B2E59]">
        Recent Attendance
      </h3>

      <p className="text-sm text-gray-500">
        Attendance records for {today}
      </p>

    </div>

    <div className="bg-[#0F8B8D] text-white px-4 py-2 rounded-xl text-sm font-semibold">
      Today's Logs
    </div>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full">

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

        {stats?.recentAttendanceLogs?.map((log,index)=>(

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
                className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
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

        ))}

      </tbody>

    </table>

  </div>

</div>
  );
};

export default Dashboard;
