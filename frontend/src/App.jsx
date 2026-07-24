import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

// Import Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import Performance from './pages/Performance';
import Holidays from './pages/Holidays';
import Reports from './pages/Reports';
import EmployeeOnboarding from './pages/EmployeeOnboarding';
import OnboardingRequests from './pages/OnboardingRequests';
import Tasks from "./pages/Tasks";
import TrackerDashboard from "./pages/TrackerDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<EmployeeOnboarding />} />

          {/* Dashboard */}
          <Route element={<Layout title="ZaynLevi Technologies" />}>
  <Route path="/" element={<Dashboard />} />
</Route>

          {/* Employees */}
          <Route element={<Layout title="Employees" />}>
            <Route path="/employees" element={<Employees />} />
          </Route>

          {/* Departments */}
          <Route element={<Layout title="Departments" />}>
            <Route path="/departments" element={<Departments />} />
          </Route>

          {/* Attendance */}
          <Route element={<Layout title="Attendance Logs" />}>
            <Route path="/attendance" element={<Attendance />} />
          </Route>

          {/* Tracker Dashboard */}
          <Route element={<Layout title="Tracker Dashboard" />}>
            <Route
              path="/tracker-dashboard"
              element={<TrackerDashboard />}
            />
          </Route>

          {/* Leaves */}
          <Route element={<Layout title="Leaves Management" />}>
            <Route path="/leaves" element={<Leaves />} />
          </Route>

          {/* Payroll */}
          <Route element={<Layout title="Payroll Center" />}>
            <Route path="/payroll" element={<Payroll />} />
          </Route>

          {/* Recruitment */}
          <Route element={<Layout title="Recruitment Center" />}>
            <Route path="/recruitment" element={<Recruitment />} />
          </Route>

          {/* Performance */}
          <Route element={<Layout title="Performance Reviews" />}>
            <Route path="/performance" element={<Performance />} />
          </Route>

          {/* Task Management */}
          <Route element={<Layout title="Task Management" />}>
            <Route path="/tasks" element={<Tasks />} />
          </Route>

          {/* Holidays */}
          <Route element={<Layout title="Holiday Calendar" />}>
            <Route path="/holidays" element={<Holidays />} />
          </Route>

          {/* Reports */}
          <Route element={<Layout title="Analytical Reports" />}>
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* HR/Admin Onboarding Requests */}
          <Route element={<Layout title="Employee Onboarding Requests" />}>
            <Route
              path="/onboarding-requests"
              element={<OnboardingRequests />}
            />
          </Route>

          {/* Redirect Unknown Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
