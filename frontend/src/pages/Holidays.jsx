import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Calendar, PlusCircle, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Holidays = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbNotice, setDbNotice] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [formError, setFormError] = useState('');

  const mockHolidays = [
    { id: 1, name: "New Year's Day", date: '2026-01-01' },
    { id: 2, name: 'Good Friday', date: '2026-04-03' },
    { id: 3, name: 'Independence Day', date: '2026-07-04' },
    { id: 4, name: 'Labor Day', date: '2026-09-07' },
    { id: 5, name: 'Thanksgiving Day', date: '2026-11-26' },
    { id: 6, name: 'Christmas Day', date: '2026-12-25' }
  ];

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await api.get('/holidays');
      setHolidays(res.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error fetching holidays. Using mock calendar dates.', err);
      setHolidays(mockHolidays);
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const openAddModal = () => {
    setName('');
    setDate('');
    setFormError('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (dbNotice) {
        const newHoliday = {
          id: Date.now(),
          name,
          date
        };
        // Sort by date ascending after adding
        const updated = [...holidays, newHoliday].sort((a, b) => new Date(a.date) - new Date(b.date));
        setHolidays(updated);
      } else {
        await api.post('/holidays', { name, date });
      }
      setIsAddOpen(false);
      if (!dbNotice) fetchHolidays();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create holiday');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this holiday from the calendar?')) return;
    try {
      if (dbNotice) {
        setHolidays(holidays.filter(h => h.id !== id));
      } else {
        await api.delete(`/holidays/${id}`);
        fetchHolidays();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete holiday');
    }
  };

  const isHRorAdmin = ['Admin', 'HR'].includes(user?.roleName);

  return (
    <div className="space-y-6">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Holiday updates are simulated in memory.</span>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-200">
            Company Holiday Calendar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            View annual corporate shutdowns and paid holidays.
          </p>
        </div>
        {isHRorAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            Add Holiday
          </button>
        )}
      </div>

      {/* Holiday list card layouts */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {holidays.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 italic border border-slate-800 rounded-3xl">
              No calendar holidays scheduled.
            </div>
          ) : (
            holidays.map((hol) => (
              <div key={hol.id} className="glass-card-interactive p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 relative overflow-hidden group">
                <div className="flex items-center gap-3.5 z-10">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-200 text-sm">{hol.name}</h4>
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                      {new Date(hol.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {isHRorAdmin && (
                  <button
                    onClick={() => handleDelete(hol.id)}
                    className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                    title="Remove holiday"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Holiday Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule Calendar Holiday"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Holiday Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Independence Day"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Scheduled Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            Add to Calendar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Holidays;
