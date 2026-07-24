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
    <aside className="w-64 bg-gradient-to-b from-[#0B4F8A] to-[#082C4C] text-white flex flex-col h-full shadow-2xl">

      {/* Logo */}
      <div className="p-6 border-b border-[#1AA7EC]/40">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#1AA7EC] flex items-center justify-center shadow-lg">

            <Briefcase className="w-6 h-6 text-white" />

          </div>

          <div>

            <h1 className="text-xl font-extrabold tracking-wide">
              Employee Management System
            </h1>

          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-2">

        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-[#1AA7EC] text-white shadow-lg"
                  : "text-gray-200 hover:bg-[#1AA7EC]/20 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-blue-200"
                }`}
              />

              <span className="text-sm font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* User Section */}
      <div className="border-t border-[#1AA7EC]/30 p-4">

        <div className="bg-[#0A3D6E] rounded-xl p-4 mb-4 shadow-md">

          <p className="font-semibold truncate">
            {user.firstName} {user.lastName}
          </p>

          <p className="text-xs uppercase tracking-wider text-blue-200 mt-1">
            {role}
          </p>

        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 py-3 font-semibold transition duration-300"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
