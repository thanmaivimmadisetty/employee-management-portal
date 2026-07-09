import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import { FileSpreadsheet, Search, ShieldAlert } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('employees'); // 'employees', 'attendance', 'payroll'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dbNotice, setDbNotice] = useState(false);

  // Fallback mock details for analytical audits
  const mockEmployeesReport = [
    { id: 1, employeeName: 'System Admin', email: 'admin@portal.com', roleName: 'Admin', departmentName: 'Administration', joiningDate: '2020-01-01', salary: 95000, status: 'Active' },
    { id: 2, employeeName: 'Sarah HR', email: 'hr@portal.com', roleName: 'HR', departmentName: 'Human Resources', joiningDate: '2021-06-15', salary: 75000, status: 'Active' },
    { id: 3, employeeName: 'John Manager', email: 'manager@portal.com', roleName: 'Manager', departmentName: 'Engineering', joiningDate: '2022-03-10', salary: 85000, status: 'Active' },
    { id: 4, employeeName: 'David Employee', email: 'employee@portal.com', roleName: 'Employee', departmentName: 'Engineering', joiningDate: '2023-08-01', salary: 60000, status: 'Active' }
  ];

  const mockAttendanceReport = [
    { date: '2026-06-30', employeeName: 'John Manager', departmentName: 'Engineering', checkIn: '08:55:00', checkOut: '--', status: 'Present' },
    { date: '2026-06-30', employeeName: 'David Employee', departmentName: 'Engineering', checkIn: '09:45:00', checkOut: '--', status: 'Late' },
    { date: '2026-06-29', employeeName: 'John Manager', departmentName: 'Engineering', checkIn: '09:00:00', checkOut: '17:00:00', status: 'Present' },
    { date: '2026-06-29', employeeName: 'David Employee', departmentName: 'Engineering', checkIn: '09:15:00', checkOut: '17:00:00', status: 'Present' }
  ];

  const mockPayrollReport = [
    { id: 1, employeeName: 'System Admin', departmentName: 'Administration', baseSalary: 95000, allowances: 5000, deductions: 2000, netSalary: 98000, paymentDate: '2026-05-31', status: 'Paid' },
    { id: 2, employeeName: 'Sarah HR', departmentName: 'Human Resources', baseSalary: 75000, allowances: 3000, deductions: 1500, netSalary: 76500, paymentDate: '2026-05-31', status: 'Paid' },
    { id: 3, employeeName: 'John Manager', departmentName: 'Engineering', baseSalary: 85000, allowances: 4000, deductions: 1800, netSalary: 87200, paymentDate: '2026-05-31', status: 'Paid' },
    { id: 4, employeeName: 'David Employee', departmentName: 'Engineering', baseSalary: 60000, allowances: 2000, deductions: 1200, netSalary: 60800, paymentDate: '2026-05-31', status: 'Paid' }
  ];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/export?type=${reportType}`);
      setData(res.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error loading report exports. Fetching local mock records.', err);
      if (reportType === 'attendance') {
        setData(mockAttendanceReport);
      } else if (reportType === 'payroll') {
        setData(mockPayrollReport);
      } else {
        setData(mockEmployeesReport);
      }
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  // Convert array data to CSV file and trigger download
  const handleExportCSV = () => {
    if (data.length === 0) return;

    // Retrieve headers based on first object keys
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Header row
    csvRows.push(headers.join(','));

    // Data rows
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Basic client-side text filtering
  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase();
    const strMatch = Object.values(item).some(val => 
      ('' + val).toLowerCase().includes(search)
    );
    return strMatch;
  });

  return (
    <div className="space-y-6">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Aggregate report summaries are compiled from temporary memory.</span>
        </div>
      )}

      {/* Configuration and controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={reportType}
            onChange={(e) => {
              setSearchTerm('');
              setReportType(e.target.value);
            }}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="employees">Employee Demographics Directory</option>
            <option value="attendance">Attendance Audit Log</option>
            <option value="payroll">Payroll Expense Audit</option>
          </select>

          {/* Search audit logs */}
          <div className="relative w-64 hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search table values..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all font-sans"
            />
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={data.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Report (.CSV)
        </button>
      </div>

      {/* Reports Table view */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      ) : reportType === 'employees' ? (
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Employee</th>
              <th className="py-4 px-6">Email Address</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Joining Date</th>
              <th className="py-4 px-6">Salary ($/yr)</th>
              <th className="py-4 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 px-6 text-center text-slate-500">No records found.</td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 text-slate-500">#{row.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-200">{row.employeeName}</td>
                  <td className="py-4 px-6 text-slate-400">{row.email}</td>
                  <td className="py-4 px-6 text-slate-400">{row.departmentName || 'Unassigned'}</td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{row.roleName}</td>
                  <td className="py-4 px-6 text-slate-400">{row.joiningDate ? row.joiningDate.split('T')[0] : ''}</td>
                  <td className="py-4 px-6 text-slate-400">${parseFloat(row.salary).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      row.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      ) : reportType === 'attendance' ? (
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">Shift Date</th>
              <th className="py-4 px-6">Employee Name</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Checked In</th>
              <th className="py-4 px-6">Checked Out</th>
              <th className="py-4 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-6 text-center text-slate-500">No logs found.</td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 text-slate-300">{row.date}</td>
                  <td className="py-4 px-6 font-semibold text-slate-200">{row.employeeName}</td>
                  <td className="py-4 px-6 text-slate-400">{row.departmentName || 'Unassigned'}</td>
                  <td className="py-4 px-6 text-slate-400">{row.checkIn}</td>
                  <td className="py-4 px-6 text-slate-400">{row.checkOut || '--:--'}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      row.status === 'Present' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : row.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      ) : (
        /* Payroll reports */
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">Payslip ID</th>
              <th className="py-4 px-6">Employee Name</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Base Salary</th>
              <th className="py-4 px-6">Allowances</th>
              <th className="py-4 px-6">Deductions</th>
              <th className="py-4 px-6">Net Salary Payout</th>
              <th className="py-4 px-6">Payment Release</th>
              <th className="py-4 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 px-6 text-center text-slate-500">No payroll records found.</td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 text-slate-500">#PAY-{row.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-200">{row.employeeName}</td>
                  <td className="py-4 px-6 text-slate-400">{row.departmentName || 'Unassigned'}</td>
                  <td className="py-4 px-6 text-slate-400">${parseFloat(row.baseSalary).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 text-emerald-400">+${parseFloat(row.allowances).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 text-red-400">-${parseFloat(row.deductions).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 font-bold text-slate-200">${parseFloat(row.netSalary).toLocaleString('en-US')}</td>
                  <td className="py-4 px-6 text-slate-400">{row.paymentDate || 'Pending'}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      row.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Reports;
