import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ title }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F8FC]">
        <div className="flex flex-col items-center">

          <div className="w-16 h-16 border-4 border-[#0F8B8D]/30 border-t-[#0B2E59] rounded-full animate-spin"></div>

          <h2 className="mt-6 text-2xl font-bold text-[#0B2E59]">
            EMP PORTAL
          </h2>

          <p className="text-gray-500 mt-2">
            Employee Management System
          </p>

        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F8FC]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F5F8FC]">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default Layout;
