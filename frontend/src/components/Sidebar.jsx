import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  CheckSquare,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const role = user.roleName;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["Admin", "HR", "Manager", "Employee"],
    },
    {
      name: "Employees",
      path: "/employees",
      icon: Users,
      roles: ["Admin", "HR", "Manager"],
    },
    {
      name: "Departments",
      path: "/departments",
      icon: Building2,
      roles: ["Admin", "HR"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: CalendarCheck,
      roles: ["Admin", "HR", "Manager", "Employee"],
    },
    {
      name: "Leaves",
      path: "/leaves",
      icon: CalendarOff,
      roles: ["Admin", "HR", "Manager", "Employee"],
    },
    {
      name: "Payroll",
      path: "/payroll",
      icon: DollarSign,
      roles: ["Admin", "HR", "Employee"],
    },
    {
      name: "Recruitment",
      path: "/recruitment",
      icon: Briefcase,
      roles: ["Admin", "HR"],
    },
    {
      name: "Employee Onboarding",
      path: "/onboarding-requests",
      icon: FileText,
      roles: ["Admin", "HR"],
    },
    {
      name: "Performance",
      path: "/performance",
      icon: TrendingUp,
      roles: ["Admin", "HR", "Manager", "Employee"],
    },
    {
      name: "Holidays",
      path: "/holidays",
      icon: Palmtree,
      roles: ["Admin", "HR", "Manager", "Employee"],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
      roles: ["Admin", "HR"],
    },
    {
      name: "Tracker",
      path: "/tracker",
      icon: ClipboardList,
      roles: ["Admin", "HR", "Manager", "Employee"],
    },
    {
      name: "Tracker Dashboard",
      path: "/tracker-dashboard",
      icon: Activity,
      roles: ["Admin", "HR"],
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
      roles: ["Admin", "HR", "Manager", "Employee"],
    },
  ];

  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );
  return (
  <aside className="w-64 bg-[#0B2E59] text-white flex flex-col h-full shadow-2xl">

    {/* Logo */}
    <div className="p-6 border-b border-[#0F8B8D] flex items-center gap-3">

      <div className="w-12 h-12 rounded-xl bg-[#0F8B8D] flex items-center justify-center shadow-lg">
        <Briefcase className="w-6 h-6 text-white" />
      </div>

      <div>
        <h1 className="font-extrabold text-xl tracking-wide text-white">
          EMP PORTAL
        </h1>

        <p className="text-xs text-teal-200 font-medium">
          Employee Management System
        </p>
      </div>

    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-2">

      {allowedMenuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-[#0F8B8D] text-white shadow-lg"
                : "text-gray-200 hover:bg-[#0F8B8D]/80 hover:text-white"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive ? "text-white" : "text-teal-300"
              }`}
            />

            <span className="text-sm font-medium">
              {item.name}
            </span>
          </Link>
        );
      })}

    </nav>

    {/* User Profile */}
    <div className="border-t border-[#0F8B8D] p-4">

      <div className="bg-[#123A6D] rounded-xl p-4 mb-4">

        <p className="font-semibold text-white truncate">
          {user.firstName} {user.lastName}
        </p>

        <p className="text-xs text-teal-300 uppercase tracking-wide mt-1">
          {role}
        </p>

      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

    </div>

  </aside>
);

};

export default Sidebar;
