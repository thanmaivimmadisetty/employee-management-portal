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

          <div className="w-16 h-16 border-4 border-[#1AA7EC]/30 border-t-[#0B4F8A] rounded-full animate-spin"></div>

          <h2 className="mt-6 text-2xl font-bold text-[#0B4F8A]">
           Employee Management System
          </h2>
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
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F5F8FC] p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default Layout;
