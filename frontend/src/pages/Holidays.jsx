import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import {
  Calendar,
  PlusCircle,
  Trash2,
  ShieldAlert,
  Cake,
  Award,
  Users,
  GraduationCap,
  PartyPopper,
  Sparkles,
  Clock
} from 'lucide-react';
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

  // Upcoming Events
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsDbNotice, setEventsDbNotice] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState('All');

  const mockHolidays = [
    { id: 1, name: "New Year's Day", date: '2026-01-01' },
    { id: 2, name: 'Good Friday', date: '2026-04-03' },
    { id: 3, name: 'Independence Day', date: '2026-07-04' },
    { id: 4, name: 'Labor Day', date: '2026-09-07' },
    { id: 5, name: 'Thanksgiving Day', date: '2026-11-26' },
    { id: 6, name: 'Christmas Day', date: '2026-12-25' }
  ];

  // Mock event data used only when a backend API is unavailable.
  // `recurring: true` means the date's month/day repeats yearly (birthdays, anniversaries)
  // and the next occurrence is calculated dynamically below.
  const mockEvents = [
    { id: 1, name: 'David Employee — Birthday', date: '2026-08-02', type: 'Birthday', recurring: true },
    { id: 2, name: 'Sarah HR — Work Anniversary (5 yrs)', date: '2026-08-10', type: 'Work Anniversary', recurring: true },
    { id: 3, name: 'Q3 All-Hands Meeting', date: '2026-08-05', type: 'Meeting', recurring: false },
    { id: 4, name: 'Workplace Safety Training', date: '2026-08-14', type: 'Training', recurring: false },
    { id: 5, name: 'John Manager — Birthday', date: '2026-07-30', type: 'Birthday', recurring: true },
    { id: 6, name: 'Onam Festival Celebration', date: '2026-08-26', type: 'Festival', recurring: false },
    { id: 7, name: 'System Admin — Work Anniversary (10 yrs)', date: '2026-09-01', type: 'Work Anniversary', recurring: true },
    { id: 8, name: 'New Hire Orientation Training', date: '2026-08-20', type: 'Training', recurring: false },
    { id: 9, name: 'Quarterly Town Hall Celebration', date: '2026-09-10', type: 'Celebration', recurring: false },
    { id: 10, name: 'Diwali Festival Celebration', date: '2026-11-08', type: 'Festival', recurring: false }
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

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data);
      setEventsDbNotice(false);
    } catch (err) {
      console.warn('API error fetching upcoming events. Using mock event data.', err);
      setEvents(mockEvents);
      setEventsDbNotice(true);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
    fetchEvents();
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

  // For recurring events (birthdays, work anniversaries) roll the month/day
  // forward to the next occurrence relative to today; one-off events use their date as-is.
  const getNextOccurrence = (dateStr, recurring) => {
    const original = new Date(dateStr);
    if (!recurring) return original;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next = new Date(original);
    next.setFullYear(today.getFullYear());
    if (next < today) {
      next.setFullYear(today.getFullYear() + 1);
    }
    return next;
  };

  const getDaysRemaining = (occurrence) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(occurrence);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
  };

  const eventTypeMeta = {
    Birthday: { icon: Cake, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    'Work Anniversary': { icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    Meeting: { icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    Training: { icon: GraduationCap, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    Festival: { icon: PartyPopper, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    Celebration: { icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
  };

  const eventTypeOptions = ['All', 'Birthday', 'Work Anniversary', 'Meeting', 'Training', 'Festival', 'Celebration'];

  // Attach computed next-occurrence date and days-remaining, then sort soonest-first.
  const upcomingEvents = useMemo(() => {
    return events
      .map(ev => {
        const occurrence = getNextOccurrence(ev.date, ev.recurring);
        return { ...ev, occurrence, daysRemaining: getDaysRemaining(occurrence) };
      })
      .filter(ev => ev.daysRemaining >= 0)
      .sort((a, b) => a.occurrence - b.occurrence);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === 'All') return upcomingEvents;
    return upcomingEvents.filter(ev => ev.type === eventTypeFilter);
  }, [upcomingEvents, eventTypeFilter]);

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

      {/* Upcoming Events Section */}
      <div className="pt-2 space-y-4">
        {eventsDbNotice && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Local Mock Mode: Upcoming events are simulated sample data.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-200">
              Upcoming Events
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Birthdays, work anniversaries, meetings, trainings, festivals, and company celebrations.
            </p>
          </div>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs font-semibold"
          >
            {eventTypeOptions.map(t => (
              <option key={t} value={t}>{t === 'All' ? 'All Event Types' : t}</option>
            ))}
          </select>
        </div>

        {eventsLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 italic border border-slate-800 rounded-3xl">
                No upcoming events found.
              </div>
            ) : (
              filteredEvents.map((ev) => {
                const meta = eventTypeMeta[ev.type] || eventTypeMeta.Celebration;
                const EventIcon = meta.icon;
                return (
                  <div key={ev.id} className="glass-card-interactive p-5 rounded-2xl border border-slate-800 flex flex-col gap-3 relative overflow-hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 z-10">
                        <div className={`w-10 h-10 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center ${meta.color}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-200 text-sm leading-tight">{ev.name}</h4>
                          <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                            {ev.occurrence.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${meta.bg} ${meta.color}`}>
                        {ev.type}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        {ev.daysRemaining === 0 ? 'Today' : ev.daysRemaining === 1 ? '1 day left' : `${ev.daysRemaining} days left`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

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
