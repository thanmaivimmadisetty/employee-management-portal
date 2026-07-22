import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ title }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cyan-50">
        <div className="flex flex-col items-center">

  <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-700 rounded-full animate-spin"></div>

  <h2 className="mt-5 text-2xl font-extrabold text-cyan-800 tracking-wide">
    EMP PORTAL
  </h2>

  <p className="text-gray-500 text-sm mt-1">
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
    <div className="flex h-screen bg-cyan-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-cyan-50">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default Layout;
