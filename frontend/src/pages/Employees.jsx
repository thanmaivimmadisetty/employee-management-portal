import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { UserPlus, Search, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Employees = () => {
  const { user: currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles] = useState([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'Manager' },
    { id: 4, name: 'Employee' }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal configurations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedId, setSelectedId] = useState(null);
  
  // Form values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(4);
  const [departmentId, setDepartmentId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Active');
  const [formError, setFormError] = useState('');
  const [dbNotice, setDbNotice] = useState(false);

  // Mock data fallback
  const mockEmployees = [
    { id: 1, firstName: 'System', lastName: 'Admin', email: 'admin@portal.com', roleId: 1, roleName: 'Admin', departmentName: 'Administration', joiningDate: '2020-01-01', salary: '95000.00', status: 'Active' },
    { id: 2, firstName: 'Sarah', lastName: 'HR', email: 'hr@portal.com', roleId: 2, roleName: 'HR', departmentName: 'Human Resources', joiningDate: '2021-06-15', salary: '75000.00', status: 'Active' },
    { id: 3, firstName: 'John', lastName: 'Manager', email: 'manager@portal.com', roleId: 3, roleName: 'Manager', departmentName: 'Engineering', joiningDate: '2022-03-10', salary: '85000.00', status: 'Active' },
    { id: 4, firstName: 'David', lastName: 'Employee', email: 'employee@portal.com', roleId: 4, roleName: 'Employee', departmentName: 'Engineering', joiningDate: '2023-08-01', salary: '60000.00', status: 'Active' }
  ];

  const mockDepartments = [
    { id: 1, name: 'Administration' },
    { id: 2, name: 'Human Resources' },
    { id: 3, name: 'Engineering' },
    { id: 4, name: 'Marketing' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments')
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error. Displaying demo values.', err);
      setEmployees(mockEmployees);
      setDepartments(mockDepartments);
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setModalType('add');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('password123'); // Default password for seeding convenience
    setRoleId(4);
    setDepartmentId(departments[0]?.id || '');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setSalary('');
    setStatus('Active');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setModalType('edit');
    setSelectedId(emp.id);
    setFirstName(emp.firstName || '');
    setLastName(emp.lastName || '');
    setEmail(emp.email || '');
    setPassword(''); // Leave blank if not updating password
    setRoleId(emp.roleId || 4);
    setDepartmentId(emp.departmentId || '');
    setJoiningDate(emp.joiningDate ? emp.joiningDate.split('T')[0] : '');
    setSalary(emp.salary || '');
    setStatus(emp.status || 'Active');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      firstName,
      lastName,
      email,
      roleId,
      departmentId: departmentId ? parseInt(departmentId) : null,
      joiningDate,
      salary: parseFloat(salary),
      status
    };

    if (modalType === 'add') {
      payload.password = password || 'password123';
    } else if (password) {
      payload.password = password;
    }

    try {
      if (modalType === 'add') {
        if (dbNotice) {
          // If in Demo/Mock Mode, simulate change locally
          const newEmp = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            roleId,
            roleName: roles.find(r => r.id === parseInt(roleId))?.name || 'Employee',
            departmentName: departments.find(d => d.id === parseInt(departmentId))?.name || 'Unassigned',
            joiningDate,
            salary,
            status
          };
          setEmployees([...employees, newEmp]);
        } else {
          await api.post('/employees', payload);
        }
      } else {
        if (dbNotice) {
          // Simulate update locally
          setEmployees(employees.map(emp => emp.id === selectedId ? {
            ...emp,
            firstName,
            lastName,
            email,
            roleId,
            roleName: roles.find(r => r.id === parseInt(roleId))?.name || 'Employee',
            departmentName: departments.find(d => d.id === parseInt(departmentId))?.name || 'Unassigned',
            joiningDate,
            salary,
            status
          } : emp));
        } else {
          await api.put(`/employees/${selectedId}`, payload);
        }
      }
      setIsModalOpen(false);
      if (!dbNotice) fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit form');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      if (dbNotice) {
        setEmployees(employees.filter(e => e.id !== id));
      } else {
        await api.delete(`/employees/${id}`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const emailStr = emp.email.toLowerCase();
    const deptStr = (emp.departmentName || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || emailStr.includes(search) || deptStr.includes(search);
  });

  const isHRorAdmin = ['Admin', 'HR'].includes(currentUser?.roleName);

  return (
    <div className="space-y-6">
      {/* DB Warning banner */}
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: File edits will reside in runtime memory only.</span>
        </div>
      )}

      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
          />
        </div>

        {/* Action Button */}
        {isHRorAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-brand-600/10"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
        )}
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Salary</th>
              {isHRorAdmin && <th className="py-4 px-6 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={isHRorAdmin ? 7 : 6} className="py-8 px-6 text-center text-slate-500">
                  No employee records found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 font-semibold text-slate-200">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="py-4 px-6 text-slate-400">{emp.email}</td>
                  <td className="py-4 px-6 text-slate-400">{emp.departmentName || 'Unassigned'}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                      emp.roleName === 'Admin' 
                        ? 'bg-purple-500/10 text-purple-400' 
                        : emp.roleName === 'HR'
                          ? 'bg-sky-500/10 text-sky-400'
                          : emp.roleName === 'Manager'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-slate-800 text-slate-400'
                    }`}>
                      {emp.roleName}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      emp.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    ${parseFloat(emp.salary).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {isHRorAdmin && (
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(emp)}
                        className="inline-flex p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-brand-400 transition-all"
                        title="Edit details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="inline-flex p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-all"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'add' ? 'Create Employee Account' : 'Edit Employee Details'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Password {modalType === 'edit' && '(leave blank to keep unchanged)'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={modalType === 'edit' ? '••••••••' : 'password123'}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required={modalType === 'add'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Role</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(parseInt(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              >
                <option value="">Unassigned</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Joining Date</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Salary ($/yr)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="60000"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            {modalType === 'add' ? 'Create Account' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
