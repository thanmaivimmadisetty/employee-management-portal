import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Award, PlusCircle, Star, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Performance = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbNotice, setDbNotice] = useState(false);

  // Modal forms
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Review Form Fields
  const [employeeId, setEmployeeId] = useState('');
  const [reviewPeriod, setReviewPeriod] = useState('Q2 2026');
  const [rating, setRating] = useState('5');
  const [feedback, setFeedback] = useState('');
  const [formError, setFormError] = useState('');

  const mockReviews = [
    { id: 1, employeeId: 4, employeeName: 'David Employee', departmentName: 'Engineering', reviewerId: 3, reviewerName: 'John Manager', reviewPeriod: 'Q1 2026', rating: 4, feedback: 'David showed excellent commitment in engineering projects. Needs improvement in communications.', reviewDate: '2026-04-10' }
  ];

  const mockEmployees = [
    { id: 4, firstName: 'David', lastName: 'Employee' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewsRes, empRes] = await Promise.all([
        api.get('/performance'),
        api.get('/employees')
      ]);
      setReviews(reviewsRes.data);
      setEmployees(empRes.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error fetching reviews. Using mock data.', err);
      const filteredMock = user.roleName === 'Employee'
        ? mockReviews.filter(r => r.employeeId === user.id)
        : mockReviews;
      setReviews(filteredMock);
      setEmployees(mockEmployees);
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openSubmitModal = () => {
    setEmployeeId(employees[0]?.id || '');
    setReviewPeriod('Q2 2026');
    setRating('5');
    setFeedback('');
    setFormError('');
    setIsSubmitOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      employeeId: parseInt(employeeId),
      reviewPeriod,
      rating: parseInt(rating),
      feedback
    };

    try {
      if (dbNotice) {
        const emp = employees.find(e => e.id === parseInt(employeeId));
        const newReview = {
          id: Date.now(),
          employeeId: parseInt(employeeId),
          employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Employee Name',
          departmentName: 'Engineering',
          reviewerId: user.id,
          reviewerName: `${user.firstName} ${user.lastName}`,
          reviewPeriod,
          rating: parseInt(rating),
          feedback,
          reviewDate: new Date().toISOString().split('T')[0]
        };
        setReviews([newReview, ...reviews]);
      } else {
        await api.post('/performance', payload);
      }
      setIsSubmitOpen(false);
      if (!dbNotice) fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (count) => {
    return (
      <div className="flex gap-1 justify-end">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= count 
                ? 'fill-amber-400 text-amber-400' 
                : 'text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const isEmployee = user?.roleName === 'Employee';

  return (
    <div className="space-y-6">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Performance reviews are submitted to memory only.</span>
        </div>
      )}

      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-200">
            Performance & Reviews
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEmployee ? 'Review your quarterly feedback and manager ratings.' : 'Publish annual or quarterly evaluations for team reports.'}
          </p>
        </div>
        {!isEmployee && (
          <button
            onClick={openSubmitModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            Submit Review Evaluation
          </button>
        )}
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 italic glass-panel border border-slate-800 rounded-3xl">
              No performance reviews submitted.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="glass-card-interactive p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
                {/* Decorative Ribbon Icon */}
                <div className="absolute top-4 right-4 text-brand-500/25 group-hover:text-brand-500/50 transition-colors">
                  <Award className="w-8 h-8" />
                </div>

                <div className="flex justify-between items-start mb-4 pr-10">
                  <div>
                    <h4 className="font-extrabold text-slate-200 text-sm">
                      {rev.employeeName}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider mt-0.5">
                      Period: {rev.reviewPeriod}
                    </span>
                  </div>
                  <div className="text-right">
                    {renderStars(rev.rating)}
                    <span className="text-[10px] text-slate-500 mt-1 block">Rating: {rev.rating}/5</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800/40 rounded-xl mb-4 text-xs leading-relaxed text-slate-400 italic">
                  "{rev.feedback}"
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800/40 pt-3">
                  <span>Reviewer: <strong className="text-slate-400">{rev.reviewerName}</strong></span>
                  <span>Date: {new Date(rev.reviewDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Review modal */}
      <Modal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        title="Submit Employee Performance Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Review Period</label>
              <input
                type="text"
                value={reviewPeriod}
                onChange={(e) => setReviewPeriod(e.target.value)}
                placeholder="e.g. Q2 2026"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rating Rating (1-5)</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              >
                <option value="5">5 - Excellent (Outstanding)</option>
                <option value="4">4 - Very Good (Exceeds expectations)</option>
                <option value="3">3 - Good (Meets expectations)</option>
                <option value="2">2 - Needs Improvement (Below expectations)</option>
                <option value="1">1 - Poor (Unsatisfactory)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Feedback Comments</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Outline employee accomplishments, performance bottlenecks, and future target milestones..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            Submit Performance Review
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Performance;
