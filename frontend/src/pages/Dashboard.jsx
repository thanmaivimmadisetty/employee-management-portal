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
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  const role = user?.roleName;
const today = new Date().toLocaleDateString();
  return (
    <div className="space-y-8 font-sans">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/60 to-slate-950 border border-slate-800/80 shadow-lg">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's what is happening with the organization's workforce today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-bold text-slate-300">
          <Clock className="w-4 h-4 text-brand-400" />
          <span>Last Login: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* DB Disconnected Warning Badge */}
      {!dbConnected && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-bold">Demonstration Mode:</span> Database connection failed or MySQL is not running yet. Displaying mock visualization statistics. Follow setup steps in README.md to configure connection.
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Headcount" 
          value={stats?.totalEmployees || 0} 
          icon={Users} 
          trend="+1 this week" 
          trendType="positive"
          description="active staff accounts"
        />
        <StatCard 
          title="Departments" 
          value={stats?.totalDepartments || 0} 
          icon={Building2} 
          description="active organizational business units"
        />
        <StatCard 
          title="Open Positions" 
          value={stats?.openJobs || 0} 
          icon={Briefcase} 
          trend="2 active hiring roles"
          trendType="neutral"
          description="open jobs on job boards"
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${stats?.attendanceRateToday || 0}%`} 
          icon={CalendarCheck} 
          trend={stats?.attendanceRateToday > 70 ? "Above target" : "Below target"}
          trendType={stats?.attendanceRateToday > 70 ? "positive" : "negative"}
          description="checked-in staff members today"
        />
      </div>

      {/* Charts section (Only Admin, HR, Manager can view overall stats charts) */}
      {['Admin', 'HR', 'Manager'].includes(role) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Headcount Bar Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">
              Department Headcounts
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.departmentHeadcounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#f1f5f9' }}
                    itemStyle={{ color: '#8b5cf6' }}
                  />
                  <Bar dataKey="headcount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
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

      {/* Recent Attendance Logs Summary Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Recent Attendance Check-Ins
          </h4>
          <span className="text-xs text-slate-500 font-semibold">
            Today: {today}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Employee</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Check In</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {stats?.recentAttendanceLogs?.map((log, index) => (
                <tr key={index} className="hover:bg-slate-900/10">
                  <td className="py-3 font-semibold text-slate-200">{log.employeeName}</td>
                  <td className="py-3 text-slate-400">{log.date}</td>
                  <td className="py-3 text-slate-400">{log.checkIn || '--:--'}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      log.status === 'Present' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : log.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
