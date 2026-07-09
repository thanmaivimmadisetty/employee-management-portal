import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import { LogIn, LogOut, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [todayStatus, setTodayStatus] = useState({ checkedIn: false, checkedOut: false, log: null });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dbNotice, setDbNotice] = useState(false);

  // Filter parameters
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const mockLogs = [
    { id: 1, employeeId: 3, employeeName: 'John Manager', departmentName: 'Engineering', date: '2026-06-30', checkIn: '08:55:00', checkOut: null, status: 'Present' },
    { id: 2, employeeId: 4, employeeName: 'David Employee', departmentName: 'Engineering', date: '2026-06-30', checkIn: '09:45:00', checkOut: null, status: 'Late' },
    { id: 3, employeeId: 3, employeeName: 'John Manager', departmentName: 'Engineering', date: '2026-06-29', checkIn: '09:00:00', checkOut: '17:00:00', status: 'Present' },
    { id: 4, employeeId: 4, employeeName: 'David Employee', departmentName: 'Engineering', date: '2026-06-29', checkIn: '09:15:00', checkOut: '17:00:00', status: 'Present' }
  ];

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (employeeId) params.employeeId = employeeId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [logsRes, statusRes] = await Promise.all([
        api.get('/attendance', { params }),
        api.get('/attendance/today')
      ]);

      setLogs(logsRes.data);
      setTodayStatus(statusRes.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error in attendance. Falling back to mock data.', err);
      // Simulate own logs filter for non-priviledged employee
      const filteredMock = user.roleName === 'Employee' 
        ? mockLogs.filter(log => log.employeeId === user.id)
        : mockLogs;
      
      setLogs(filteredMock);
      
      // Setup default fake today check in status
      setTodayStatus({
        checkedIn: true,
        checkedOut: false,
        log: {
          checkIn: '09:15:00',
          checkOut: null,
          status: 'Present'
        }
      });
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId, startDate, endDate]);

  const handleCheckIn = async () => {
    setSubmitting(true);
    try {
      if (dbNotice) {
        // Local state simulation
        const currentTimeStr = new Date().toTimeString().split(' ')[0];
        const newStatus = {
          checkedIn: true,
          checkedOut: false,
          log: {
            checkIn: currentTimeStr,
            checkOut: null,
            status: 'Present'
          }
        };
        setTodayStatus(newStatus);
        const newLog = {
          id: Date.now(),
          employeeId: user.id,
          employeeName: `${user.firstName} ${user.lastName}`,
          departmentName: 'Engineering',
          date: new Date().toISOString().split('T')[0],
          checkIn: currentTimeStr,
          checkOut: null,
          status: 'Present'
        };
        setLogs([newLog, ...logs]);
      } else {
        await api.post('/attendance/check-in');
        await fetchAttendance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setSubmitting(true);
    try {
      if (dbNotice) {
        // Local state simulation
        const currentTimeStr = new Date().toTimeString().split(' ')[0];
        setTodayStatus({
          ...todayStatus,
          checkedOut: true,
          log: {
            ...todayStatus.log,
            checkOut: currentTimeStr
          }
        });
        setLogs(logs.map(log => 
          log.employeeId === user.id && log.date === new Date().toISOString().split('T')[0]
            ? { ...log, checkOut: currentTimeStr }
            : log
        ));
      } else {
        await api.post('/attendance/check-out');
        await fetchAttendance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    } finally {
      setSubmitting(false);
    }
  };

  const role = user?.roleName;
  const showFilters = ['Admin', 'HR', 'Manager'].includes(role);

  return (
    <div className="space-y-8">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Operations and logs are simulated locally.</span>
        </div>
      )}

      {/* Attendance Check in / out card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-900/80 to-slate-950">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            todayStatus.checkedOut 
              ? 'bg-slate-800 text-slate-400'
              : todayStatus.checkedIn
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
          }`}>
            {todayStatus.checkedIn ? <CheckCircle2 className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200">
              {todayStatus.checkedOut 
                ? 'Shift Completed' 
                : todayStatus.checkedIn 
                  ? 'Checked In' 
                  : 'Ready for Shift'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {todayStatus.checkedOut
                ? `Today's Shift: Checked in at ${todayStatus.log?.checkIn} - Checked out at ${todayStatus.log?.checkOut}`
                : todayStatus.checkedIn
                  ? `Shift Active. Checked in at ${todayStatus.log?.checkIn} (${todayStatus.log?.status})`
                  : 'Start your shift tracker by checking in.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {!todayStatus.checkedIn && (
            <button
              onClick={handleCheckIn}
              disabled={submitting}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-600/15"
            >
              <LogIn className="w-4 h-4" />
              Check In
            </button>
          )}

          {todayStatus.checkedIn && !todayStatus.checkedOut && (
            <button
              onClick={handleCheckOut}
              disabled={submitting}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/15"
            >
              <LogOut className="w-4 h-4" />
              Check Out
            </button>
          )}

          {todayStatus.checkedOut && (
            <span className="text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
              Completed Today
            </span>
          )}
        </div>
      </div>

      {/* Filters (Privileged Roles only) */}
      {showFilters && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/10">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Employee ID Filter</label>
            <input
              type="number"
              placeholder="Filter by ID..."
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          {showFilters ? 'Employee Shift Logs' : 'My Shift Logs'}
        </h4>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
          </div>
        ) : (
          <Table>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
                {showFilters && <th className="py-4 px-6">Employee</th>}
                {showFilters && <th className="py-4 px-6">Department</th>}
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Check In</th>
                <th className="py-4 px-6">Check Out</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={showFilters ? 6 : 4} className="py-8 px-6 text-center text-slate-500">
                    No shift records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/10">
                    {showFilters && <td className="py-4 px-6 font-semibold text-slate-200">{log.employeeName}</td>}
                    {showFilters && <td className="py-4 px-6 text-slate-400">{log.departmentName || 'Unassigned'}</td>}
                    <td className="py-4 px-6 text-slate-300">{log.date}</td>
                    <td className="py-4 px-6 text-slate-400">{log.checkIn}</td>
                    <td className="py-4 px-6 text-slate-400">{log.checkOut || '--:--:--'}</td>
                    <td className="py-4 px-6 text-right">
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
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
