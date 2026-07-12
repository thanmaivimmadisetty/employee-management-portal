import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarOff,
  DollarSign,
  Briefcase,
  TrendingUp,
  Palmtree,
  BarChart3,
  LogOut,
  FileText,
  ClipboardList,
  Activity,
  CheckSquare
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const role = user.roleName;

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['Admin', 'HR', 'Manager', 'Employee']
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: Users,
      roles: ['Admin', 'HR', 'Manager']
    },
    {
      name: 'Departments',
      path: '/departments',
      icon: Building2,
      roles: ['Admin', 'HR']
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: CalendarCheck,
      roles: ['Admin', 'HR', 'Manager', 'Employee']
    },
    {
      name: 'Leaves',
      path: '/leaves',
      icon: CalendarOff,
      roles: ['Admin', 'HR', 'Manager', 'Employee']
    },
    {
      name: 'Payroll',
      path: '/payroll',
      icon: DollarSign,
      roles: ['Admin', 'HR', 'Employee']
    },
    {
      name: 'Recruitment',
      path: '/recruitment',
      icon: Briefcase,
      roles: ['Admin', 'HR']
    },
    {
      name: 'Employee Onboarding',
      path: '/onboarding-requests',
      icon: FileText,
      roles: ['Admin', 'HR']
    },
    {
      name: 'Performance',
      path: '/performance',
      icon: TrendingUp,
      roles: ['Admin', 'HR', 'Manager', 'Employee']
    },
    {
      name: 'Holidays',
      path: '/holidays',
      icon: Palmtree,
      roles: ['Admin', 'HR', 'Manager', 'Employee']
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
      roles: ['Admin', 'HR']
    },
    {
      name: 'Tracker',
      path: '/tracker',
      icon: ClipboardList,
      roles: ['Admin', 'HR', 'Manager', 'Employee']
    },
    {
      name: 'Tracker Dashboard',
      path: '/tracker-dashboard',
      icon: Activity,
      roles: ['Admin', 'HR']
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
      roles: ['Admin', 'HR', 'Manager', 'Employee']
    }
  ];

  const allowedMenuItems = menuItems.filter(item =>
    item.roles.includes(role)
  );

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col h-full z-20">

      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
          <Briefcase className="w-5 h-5 text-white" />
        </div>

        <div>
          <h1 className="font-extrabold text-lg leading-tight tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-violet-300">
            EMP PORTAL
          </h1>

          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Workforce Suite
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {allowedMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-600 text-white font-medium shadow-md shadow-brand-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-brand-400'
                }`}
              />

              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/30">

        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 mb-2">
          <div className="truncate">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">
              {role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500/10 active:bg-red-500/20 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
