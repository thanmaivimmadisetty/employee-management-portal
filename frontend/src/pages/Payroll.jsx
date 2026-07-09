import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { DollarSign, Printer, PlusCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Payroll = () => {
  const { user } = useAuth();
  const [payroll, setPayroll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbNotice, setDbNotice] = useState(false);

  // Modal forms
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Generate fields
  const [employeeId, setEmployeeId] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [allowances, setAllowances] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [formError, setFormError] = useState('');

  const mockPayroll = [
    { id: 1, employeeId: 1, employeeName: 'System Admin', departmentName: 'Administration', baseSalary: '95000.00', allowances: '5000.00', deductions: '2000.00', netSalary: '98000.00', paymentDate: '2026-05-31', status: 'Paid' },
    { id: 2, employeeId: 2, employeeName: 'Sarah HR', departmentName: 'Human Resources', baseSalary: '75000.00', allowances: '3000.00', deductions: '1500.00', netSalary: '76500.00', paymentDate: '2026-05-31', status: 'Paid' },
    { id: 3, employeeId: 3, employeeName: 'John Manager', departmentName: 'Engineering', baseSalary: '85000.00', allowances: '4000.00', deductions: '1800.00', netSalary: '87200.00', paymentDate: '2026-05-31', status: 'Paid' },
    { id: 4, employeeId: 4, employeeName: 'David Employee', departmentName: 'Engineering', baseSalary: '60000.00', allowances: '2000.00', deductions: '1200.00', netSalary: '60800.00', paymentDate: '2026-05-31', status: 'Paid' }
  ];

  const mockEmployees = [
    { id: 1, firstName: 'System', lastName: 'Admin', salary: 95000 },
    { id: 2, firstName: 'Sarah', lastName: 'HR', salary: 75000 },
    { id: 3, firstName: 'John', lastName: 'Manager', salary: 85000 },
    { id: 4, firstName: 'David', lastName: 'Employee', salary: 60000 }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payrollRes, empRes] = await Promise.all([
        api.get('/payroll'),
        api.get('/employees')
      ]);
      setPayroll(payrollRes.data);
      setEmployees(empRes.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error fetching payroll. Using mock details.', err);
      const filteredMock = user.roleName === 'Employee'
        ? mockPayroll.filter(p => p.employeeId === user.id)
        : mockPayroll;
      setPayroll(filteredMock);
      setEmployees(mockEmployees);
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openGenerateModal = () => {
    setEmployeeId(employees[0]?.id || '');
    // Autopopulate base salary of first employee
    const defaultEmp = employees[0];
    setBaseSalary(defaultEmp ? defaultEmp.salary : '');
    setAllowances('0');
    setDeductions('0');
    setFormError('');
    setIsGenerateOpen(true);
  };

  const handleEmployeeChange = (empId) => {
    setEmployeeId(empId);
    const emp = employees.find(e => e.id === parseInt(empId));
    if (emp) {
      setBaseSalary(emp.salary || '');
    }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      employeeId: parseInt(employeeId),
      baseSalary: parseFloat(baseSalary),
      allowances: parseFloat(allowances || 0),
      deductions: parseFloat(deductions || 0)
    };

    try {
      if (dbNotice) {
        // Simulate local creation
        const emp = employees.find(e => e.id === parseInt(employeeId));
        const newRecord = {
          id: Date.now(),
          employeeId: parseInt(employeeId),
          employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Employee',
          departmentName: 'Engineering',
          baseSalary: baseSalary.toString(),
          allowances: allowances.toString(),
          deductions: deductions.toString(),
          netSalary: (parseFloat(baseSalary) + parseFloat(allowances) - parseFloat(deductions)).toString(),
          paymentDate: null,
          status: 'Unpaid'
        };
        setPayroll([newRecord, ...payroll]);
      } else {
        await api.post('/payroll', payload);
      }
      setIsGenerateOpen(false);
      if (!dbNotice) fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to generate payroll record');
    }
  };

  const handlePayStatus = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this payslip as ${newStatus}?`)) return;
    try {
      if (dbNotice) {
        setPayroll(payroll.map(p => 
          p.id === id 
            ? { ...p, status: newStatus, paymentDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null } 
            : p
        ));
      } else {
        await api.patch(`/payroll/${id}/status`, { status: newStatus });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payroll status');
    }
  };

  const handlePrintSlip = (slip) => {
    setSelectedSlip(slip);
    setIsPayslipOpen(true);
  };

  const handlePrintAction = () => {
    window.print();
  };

  const isHRorAdmin = ['Admin', 'HR'].includes(user?.roleName);

  return (
    <div className="space-y-6">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Payroll generation and payments are simulated in runtime memory.</span>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-200">
            Payroll Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHRorAdmin ? 'Generate payslips, run payroll processing, and audit payouts.' : 'View historical and monthly payslips.'}
          </p>
        </div>
        {isHRorAdmin && (
          <button
            onClick={openGenerateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            Generate Payslip
          </button>
        )}
      </div>

      {/* Payroll Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">ID</th>
              {isHRorAdmin && <th className="py-4 px-6">Employee</th>}
              {isHRorAdmin && <th className="py-4 px-6">Department</th>}
              <th className="py-4 px-6">Base Salary</th>
              <th className="py-4 px-6">Allowances</th>
              <th className="py-4 px-6">Deductions</th>
              <th className="py-4 px-6">Net Salary</th>
              <th className="py-4 px-6">Payment Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {payroll.length === 0 ? (
              <tr>
                <td colSpan={isHRorAdmin ? 10 : 8} className="py-8 px-6 text-center text-slate-500">
                  No payroll records found.
                </td>
              </tr>
            ) : (
              payroll.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 text-slate-400">#PAY-{pay.id}</td>
                  {isHRorAdmin && <td className="py-4 px-6 font-semibold text-slate-200">{pay.employeeName}</td>}
                  {isHRorAdmin && <td className="py-4 px-6 text-slate-400">{pay.departmentName || 'Unassigned'}</td>}
                  <td className="py-4 px-6 text-slate-400">${parseFloat(pay.baseSalary).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 text-emerald-400">+${parseFloat(pay.allowances).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 text-red-400">-${parseFloat(pay.deductions).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 font-bold text-slate-200">${parseFloat(pay.netSalary).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 text-slate-400">{pay.paymentDate || <span className="text-slate-600">Pending</span>}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      pay.status === 'Paid' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handlePrintSlip(pay)}
                      className="inline-flex p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-brand-400 transition-all"
                      title="View & Print Payslip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    {isHRorAdmin && pay.status === 'Unpaid' && (
                      <button
                        onClick={() => handlePayStatus(pay.id, 'Paid')}
                        className="px-2 py-1 text-[10px] font-extrabold border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/25 text-emerald-400 rounded-lg transition-all"
                      >
                        Release Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Generate Payslip Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate Employee Payslip"
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Employee</label>
            <select
              value={employeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            >
              <option value="">-- Choose employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Base Salary ($)</label>
            <input
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allowances ($)</label>
              <input
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deductions ($)</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex justify-between items-center mt-6">
            <span className="font-bold text-slate-400">Calculated Net Payout:</span>
            <span className="text-lg font-black text-brand-400">
              ${((parseFloat(baseSalary || 0) + parseFloat(allowances || 0)) - parseFloat(deductions || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            Generate & Release Draft
          </button>
        </form>
      </Modal>

      {/* Payslip PDF Modal View */}
      <Modal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        title="Payslip Statement"
      >
        {selectedSlip && (
          <div className="space-y-6 font-mono p-2 border border-slate-800/80 rounded-xl bg-slate-950/40 print:bg-white print:text-black">
            {/* Header info */}
            <div className="text-center pb-4 border-b border-dashed border-slate-800">
              <h2 className="text-base font-extrabold tracking-wider text-slate-100 uppercase">
                Employee Payslip Payout
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">
                Ref ID: #PAY-{selectedSlip.id} | Date: {selectedSlip.paymentDate || 'Pending Release'}
              </p>
            </div>

            {/* Profile detail */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Employee Name:</span>
                <span className="font-bold text-slate-100">{selectedSlip.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <span>{selectedSlip.departmentName || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className={`font-bold ${selectedSlip.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedSlip.status}
                </span>
              </div>
            </div>

            {/* Calculations breakdown */}
            <div className="pt-4 border-t border-dashed border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Base Salary Earnings:</span>
                <span>${parseFloat(selectedSlip.baseSalary).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Allowances (+):</span>
                <span>+${parseFloat(selectedSlip.allowances).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Deductions (-):</span>
                <span>-${parseFloat(selectedSlip.deductions).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-dashed border-slate-800 font-extrabold text-sm text-slate-100">
                <span>NET PAYOUT:</span>
                <span className="text-brand-400">${parseFloat(selectedSlip.netSalary).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={handlePrintAction}
              className="w-full flex items-center justify-center gap-2 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold tracking-wide transition-all mt-4 print:hidden"
            >
              <Printer className="w-4 h-4" />
              Print Payslip Statement
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payroll;
