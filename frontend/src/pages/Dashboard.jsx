import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import CreateTaskModal from "../components/CreateTaskModal";

import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  CalendarDays,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [todayStatus, setTodayStatus] = useState({
    checkedIn: false,
    checkedOut: false,
    log: null,
  });

const [uploading, setUploading] = useState(false);
useEffect(() => {
  const loadDashboard = async () => {
    try {
      const attendance = await api.get("/attendance/today");
      const tasks = await api.get("/tasks/my");

      setTodayStatus(attendance.data);
      setMyTasks(tasks.data);

      setDbConnected(true);
    } catch (error) {
      console.error("Dashboard loading failed:", error);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

  const refreshAttendance = async () => {
    const attendance = await api.get("/attendance/today");
    setTodayStatus(attendance.data);
  };

  const handleCheckIn = async () => {
    try {
      await api.post("/attendance/check-in");
      refreshAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check In Failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post("/attendance/check-out");
      refreshAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check Out Failed");
    }
  };
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("profilePhoto", file);

    const res = await api.post(
      `/employees/${user.id}/profile-photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const updatedUser = {
      ...user,
      profilePhoto: res.data.profilePhoto,
    };

    localStorage.setItem(
      "emp_portal_user",
      JSON.stringify(updatedUser)
    );

    alert("Photo uploaded successfully!");

    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Failed to upload image.");
  } finally {
    setUploading(false);
  }
};

if (loading) return <div className="flex h-screen items-center justify-center"><h2 className="text-2xl font-bold text-[#0B4F8A]">Loading Dashboard...</h2></div>;

  return (
    <div className="space-y-8">
      {!dbConnected && (
        <div className="rounded-xl border border-yellow-300 bg-yellow-100 px-4 py-3 text-yellow-800">
          <strong>Demo Mode:</strong> Backend unavailable.
        </div>
      )}

      <div className="rounded-3xl bg-gradient-to-r from-[#0B4F8A] via-[#0A3D6E] to-[#1AA7EC] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
         <div className="flex items-center gap-5">

  <div className="flex flex-col items-center">

  <img
    src={
      user?.profilePhoto
        ? `https://employee-management-portal-2.onrender.com${user.profilePhoto}`
        : `https://ui-avatars.com/api/?name=${user?.firstName || "User"}`
    }
    alt="Profile"
    className="w-20 h-20 rounded-full border-4 border-white object-cover"
  />

  <input
    type="file"
    id="profilePhoto"
    className="hidden"
    accept="image/*"
    onChange={handlePhotoUpload}
  />

  <label
    htmlFor="profilePhoto"
    className="mt-3 cursor-pointer rounded-lg bg-white px-3 py-1 text-sm font-semibold text-[#0B4F8A]"
  >
    Upload Photo
  </label>

</div>

  <div>
    <h1 className="text-3xl font-bold">
      Welcome, {user?.firstName || user?.name || "User"} 👋
    </h1>

    <p className="mt-2 text-blue-100">
      Employee ID: {user?.id ? `EMP${String(user.id).padStart(3, "0")}` : "N/A"}
    </p>

    <p className="mt-2 text-blue-100">
      Employee Dashboard
    </p>
  </div>

</div>
          <div className="rounded-2xl bg-white/10 p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8" />
              <div>
                <p className="text-sm">Today's Date</p>
                <h2 className="font-bold">{new Date().toLocaleDateString()}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white shadow-lg border-l-4 border-[#0B4F8A] p-6">
          <div className="flex items-center gap-3 mb-4">
            <FolderKanban className="w-8 h-8 text-[#0B4F8A]" />
            <h3 className="text-lg font-bold text-[#0B4F8A]">Project Details</h3>
          </div>
          <p className="font-semibold">Invoice Generation System</p>
          <p>Status: In Progress</p>
          <p>Deadline: 30 Jul 2026</p>
        </div>

        <div className="rounded-2xl bg-white shadow-lg border-l-4 border-green-500 p-6">
          <h3 className="font-bold text-green-700 mb-4">Today's Attendance</h3>
          <p>Login: {todayStatus.log?.checkIn || "--:--"}</p>
          <p>Logout: {todayStatus.log?.checkOut || "--:--"}</p>
          <div className="mt-4">
            {!todayStatus.checkedIn && <button onClick={handleCheckIn} className="w-full bg-green-600 text-white py-2 rounded-xl"><LogIn className="inline w-4 h-4 mr-2"/>Check In</button>}
            {todayStatus.checkedIn && !todayStatus.checkedOut && <button onClick={handleCheckOut} className="w-full bg-red-600 text-white py-2 rounded-xl"><LogOut className="inline w-4 h-4 mr-2"/>Check Out</button>}
            {todayStatus.checkedOut && <div className="text-green-600 font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/>Shift Completed</div>}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-lg border-l-4 border-red-500 p-6">
          <div className="flex items-center gap-3 mb-4">
            <ListTodo className="w-8 h-8 text-red-600"/>
            <h3 className="text-lg font-bold text-red-600">Task Summary</h3>
          </div>
          <div className="space-y-2 mb-4">
  {myTasks.length > 0 ? (
    myTasks.slice(0, 5).map((task) => (
      <div
        key={task.id}
        className="border rounded-lg p-2 bg-gray-50"
      >
        <p className="font-semibold">{task.title}</p>
        <p className="text-xs text-gray-500">
          Status: {task.status}
        </p>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">
      No tasks assigned.
    </p>
  )}
</div>

<button
  onClick={() => setIsTaskModalOpen(true)}
  className="w-full bg-[#1AA7EC] hover:bg-[#0B4F8A] text-white py-2 rounded-xl"
>
  + Create Task
</button>
        </div>
        <div className="rounded-2xl bg-white shadow-lg border-l-4 border-purple-500 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-8 h-8 text-purple-600"/>
            <h3 className="text-lg font-bold text-purple-700">Leave Details</h3>
          </div>
          <p>Applied: 2</p>
          <p>Approved: 1</p>
          <p>Remaining: 10</p>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={() => {}}
      />
    </div>
  );
};

export default Dashboard;
