import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { CalendarRange, Check, X, UserCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbNotice, setDbNotice] = useState(false);

  // Apply Form state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mockLeaves = [
    { id: 1, employeeId: 4, employeeName: 'David Employee', departmentName: 'Engineering', leaveType: 'Sick Leave', startDate: '2026-06-20', endDate: '2026-06-22', reason: 'Medical checkup and rest', status: 'Approved', approverName: 'Sarah HR' },
    { id: 2, employeeId: 4, employeeName: 'David Employee', departmentName: 'Engineering', leaveType: 'Annual Leave', startDate: '2026-07-10', endDate: '2026-07-15', reason: 'Family vacation', status: 'Pending', approverName: null }
  ];

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error fetching leaves. Using mock leaves.', err);
      const filteredMock = user.roleName === 'Employee' 
        ? mockLeaves.filter(l => l.employeeId === user.id)
        : mockLeaves;
      setLeaves(filteredMock);
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyOpen = () => {
    setLeaveType('Sick Leave');
    setStartDate('');
    setEndDate('');
    setReason('');
    setFormError('');
    setIsApplyOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const payload = { leaveType, startDate, endDate, reason };

    try {
      if (dbNotice) {
        const newLeave = {
          id: Date.now(),
          employeeId: user.id,
          employeeName: `${user.firstName} ${user.lastName}`,
          departmentName: 'Engineering',
          leaveType,
          startDate,
          endDate,
          reason,
          status: 'Pending',
          approverName: null
        };
        setLeaves([newLeave, ...leaves]);
      } else {
        await api.post('/leaves', payload);
      }
      setIsApplyOpen(false);
      if (!dbNotice) fetchLeaves();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this request as ${newStatus}?`)) return;
    try {
      if (dbNotice) {
        setLeaves(leaves.map(l => 
          l.id === id 
            ? { ...l, status: newStatus, approverName: `${user.firstName} ${user.lastName}` } 
            : l
        ));
      } else {
        await api.patch(`/leaves/${id}/status`, { status: newStatus });
        fetchLeaves();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update leave request status');
    }
  };

  const role = user?.roleName;
  const isEmployee = role === 'Employee';

  // Filter requests based on status/ownership
  const myRequests = isEmployee ? leaves : leaves.filter(l => l.employeeId === user.id);
  const pendingApprovals = isEmployee ? [] : leaves.filter(l => l.status === 'Pending');
  const pastApprovals = isEmployee ? [] : leaves.filter(l => l.status !== 'Pending');

  return (
    <div className="space-y-8">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Leave submissions and status toggles are simulated in memory.</span>
        </div>
      )}

      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-200">
            Request Leave Absence
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit sick leaves, vacation leaves, or casual day-offs.
          </p>
        </div>
        <button
          onClick={handleApplyOpen}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all shadow-md"
        >
          <CalendarRange className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Pending approvals section (Managers/HR/Admin only) */}
      {!isEmployee && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-brand-400" />
            Pending Leave Approvals ({pendingApprovals.length})
          </h4>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="w-6 h-6 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
            </div>
          ) : (
            <Table>
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Dates</th>
                  <th className="py-4 px-6">Reason</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm">
                {pendingApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-6 text-center text-slate-500 italic">
                      No pending leave approvals.
                    </td>
                  </tr>
                ) : (
                  pendingApprovals.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/10">
                      <td className="py-4 px-6 font-semibold text-slate-200">
                        {req.employeeName}
                        <span className="block text-[10px] text-slate-500 font-medium mt-0.5">{req.departmentName}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">{req.leaveType}</td>
                      <td className="py-4 px-6 text-slate-300">
                        {req.startDate} to {req.endDate}
                      </td>
                      <td className="py-4 px-6 text-slate-400 max-w-xs truncate" title={req.reason}>
                        {req.reason}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleStatusChange(req.id, 'Approved')}
                          className="inline-flex p-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 transition-all"
                          title="Approve request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(req.id, 'Rejected')}
                          className="inline-flex p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-all"
                          title="Reject request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {/* My Requests / Overall History */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          {isEmployee ? 'My Leave History' : 'All Leave Records'}
        </h4>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="w-6 h-6 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
          </div>
        ) : (
          <Table>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
                {!isEmployee && <th className="py-4 px-6">Employee</th>}
                <th className="py-4 px-6">Leave Type</th>
                <th className="py-4 px-6">Start Date</th>
                <th className="py-4 px-6">End Date</th>
                <th className="py-4 px-6">Reason</th>
                <th className="py-4 px-6">Approver</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {(isEmployee ? myRequests : leaves).length === 0 ? (
                <tr>
                  <td colSpan={isEmployee ? 6 : 7} className="py-8 px-6 text-center text-slate-500">
                    No leave history records found.
                  </td>
                </tr>
              ) : (
                (isEmployee ? myRequests : leaves).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/10">
                    {!isEmployee && <td className="py-4 px-6 font-semibold text-slate-200">{req.employeeName}</td>}
                    <td className="py-4 px-6 text-slate-300">{req.leaveType}</td>
                    <td className="py-4 px-6 text-slate-400">{req.startDate}</td>
                    <td className="py-4 px-6 text-slate-400">{req.endDate}</td>
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {req.approverName || <span className="text-slate-500 italic">Pending approval</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                        req.status === 'Approved' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : req.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>

      {/* Apply Leave Modal Form */}
      <Modal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="Submit Leave Application"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Reason / Explanation</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain the context of your leave request..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Leaves;
