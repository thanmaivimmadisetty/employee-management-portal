import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Building2, Search, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Departments = () => {
  const { user: currentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedId, setSelectedId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState('');
  const [formError, setFormError] = useState('');
  const [dbNotice, setDbNotice] = useState(false);

  const mockDepartments = [
    { id: 1, name: 'Administration', description: 'Core management and executive actions', managerId: 1, managerName: 'System Admin' },
    { id: 2, name: 'Human Resources', description: 'Recruitment, employee relations, and benefits', managerId: 2, managerName: 'Sarah HR' },
    { id: 3, name: 'Engineering', description: 'Software development and technical operations', managerId: 3, managerName: 'John Manager' },
    { id: 4, name: 'Marketing', description: 'Sales, public relations, and campaigns', managerId: null, managerName: null }
  ];

  const mockEmployees = [
    { id: 1, firstName: 'System', lastName: 'Admin' },
    { id: 2, firstName: 'Sarah', lastName: 'HR' },
    { id: 3, firstName: 'John', lastName: 'Manager' },
    { id: 4, firstName: 'David', lastName: 'Employee' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        api.get('/departments'),
        api.get('/employees')
      ]);
      setDepartments(deptRes.data);
      // Filter out only managers/admin for assignment
      setEmployees(empRes.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error. Displaying mock department values.', err);
      setDepartments(mockDepartments);
      setEmployees(mockEmployees);
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
    setName('');
    setDescription('');
    setManagerId('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setModalType('edit');
    setSelectedId(dept.id);
    setName(dept.name || '');
    setDescription(dept.description || '');
    setManagerId(dept.managerId || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      name,
      description,
      managerId: managerId ? parseInt(managerId) : null
    };

    try {
      if (modalType === 'add') {
        if (dbNotice) {
          const newDept = {
            id: Date.now(),
            name,
            description,
            managerId,
            managerName: managerId ? (() => {
              const emp = employees.find(e => e.id === parseInt(managerId));
              return emp ? `${emp.firstName} ${emp.lastName}` : null;
            })() : null
          };
          setDepartments([...departments, newDept]);
        } else {
          await api.post('/departments', payload);
        }
      } else {
        if (dbNotice) {
          setDepartments(departments.map(dept => dept.id === selectedId ? {
            ...dept,
            name,
            description,
            managerId,
            managerName: managerId ? (() => {
              const emp = employees.find(e => e.id === parseInt(managerId));
              return emp ? `${emp.firstName} ${emp.lastName}` : null;
            })() : null
          } : dept));
        } else {
          await api.put(`/departments/${selectedId}`, payload);
        }
      }
      setIsModalOpen(false);
      if (!dbNotice) fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit form');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? Employees inside this department will be set to Unassigned.')) return;
    try {
      if (dbNotice) {
        setDepartments(departments.filter(d => d.id !== id));
      } else {
        await api.delete(`/departments/${id}`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const filteredDepts = departments.filter(dept => {
    const deptName = dept.name.toLowerCase();
    const desc = (dept.description || '').toLowerCase();
    const manager = (dept.managerName || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return deptName.includes(search) || desc.includes(search) || manager.includes(search);
  });

  const isHRorAdmin = ['Admin', 'HR'].includes(currentUser?.roleName);

  return (
    <div className="space-y-6">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Department modifications are simulated in memory.</span>
        </div>
      )}

      {/* Header filter & create */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by department name or manager..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
          />
        </div>

        {isHRorAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-sm font-bold rounded-xl transition-all shadow-md"
          >
            <Building2 className="w-4 h-4" />
            Add Department
          </button>
        )}
      </div>

      {/* Departments Grid/Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      ) : (
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">Department Name</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Department Manager</th>
              {isHRorAdmin && <th className="py-4 px-6 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {filteredDepts.length === 0 ? (
              <tr>
                <td colSpan={isHRorAdmin ? 4 : 3} className="py-8 px-6 text-center text-slate-500">
                  No department records found.
                </td>
              </tr>
            ) : (
              filteredDepts.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 font-semibold text-slate-200">
                    {dept.name}
                  </td>
                  <td className="py-4 px-6 text-slate-400 max-w-sm truncate" title={dept.description}>
                    {dept.description || 'No description provided.'}
                  </td>
                  <td className="py-4 px-6">
                    {dept.managerName ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <span className="text-slate-300 font-medium">{dept.managerName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No Manager Assigned</span>
                    )}
                  </td>
                  {isHRorAdmin && (
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="inline-flex p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-brand-400 transition-all"
                        title="Edit department"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="inline-flex p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-all"
                        title="Delete department"
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

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'add' ? 'Create Department' : 'Edit Department Details'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Engineering"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide a brief summary of department operations..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department Manager</label>
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
            >
              <option value="">Unassigned</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            {modalType === 'add' ? 'Create Department' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
