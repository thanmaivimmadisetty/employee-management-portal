import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Briefcase, UserCheck, PlusCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Recruitment = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'candidates'
  const [dbNotice, setDbNotice] = useState(false);

  // Modals
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Add Job Form fields
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobDeptId, setJobDeptId] = useState('');
  const [jobError, setJobError] = useState('');

  // Apply Form fields (simulating candidate application submission)
  const [applyJobId, setApplyJobId] = useState('');
  const [candFirst, setCandFirst] = useState('');
  const [candLast, setCandLast] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candResume, setCandResume] = useState('https://example.com/resumes/demo.pdf');
  const [candError, setCandError] = useState('');

  const mockJobs = [
    { id: 1, title: 'Senior React Developer', description: 'Looking for a Senior Frontend Engineer proficient in React, Tailwind CSS, and state management.', departmentId: 3, departmentName: 'Engineering', status: 'Open', createdAt: '2026-06-25T10:00:00Z' },
    { id: 2, title: 'HR Specialist', description: 'Seeking an experienced recruiter to manage personnel relations and source talent.', departmentId: 2, departmentName: 'Human Resources', status: 'Open', createdAt: '2026-06-26T12:00:00Z' }
  ];

  const mockCandidates = [
    { id: 1, jobId: 1, jobTitle: 'Senior React Developer', firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@gmail.com', resumeUrl: 'https://example.com/resumes/alice.pdf', status: 'Interviewing', createdAt: '2026-06-27T08:00:00Z' },
    { id: 2, jobId: 1, jobTitle: 'Senior React Developer', firstName: 'Bob', lastName: 'Jones', email: 'bob.jones@yahoo.com', resumeUrl: 'https://example.com/resumes/bob.pdf', status: 'Applied', createdAt: '2026-06-28T09:30:00Z' },
    { id: 3, jobId: 2, jobTitle: 'HR Specialist', firstName: 'Emily', lastName: 'Brown', email: 'emily.b@outlook.com', resumeUrl: 'https://example.com/resumes/emily.pdf', status: 'Offered', createdAt: '2026-06-28T14:15:00Z' }
  ];

  const mockDepartments = [
    { id: 1, name: 'Administration' },
    { id: 2, name: 'Human Resources' },
    { id: 3, name: 'Engineering' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, candidatesRes, deptRes] = await Promise.all([
        api.get('/recruitment/jobs'),
        api.get('/recruitment/candidates'),
        api.get('/departments')
      ]);
      setJobs(jobsRes.data);
      setCandidates(candidatesRes.data);
      setDepartments(deptRes.data);
      setDbNotice(false);
    } catch (err) {
      console.warn('API error fetching recruitment logs. Using mock recruitment records.', err);
      setJobs(mockJobs);
      setCandidates(mockCandidates);
      setDepartments(mockDepartments);
      setDbNotice(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddJobModal = () => {
    setJobTitle('');
    setJobDescription('');
    setJobDeptId(departments[0]?.id || '');
    setJobError('');
    setIsAddJobOpen(true);
  };

  const openApplyModal = (job) => {
    setApplyJobId(job.id);
    setCandFirst('');
    setCandLast('');
    setCandEmail('');
    setCandResume('https://example.com/resumes/demo.pdf');
    setCandError('');
    setIsApplyOpen(true);
  };

  const handleAddJobSubmit = async (e) => {
    e.preventDefault();
    setJobError('');

    const payload = {
      title: jobTitle,
      description: jobDescription,
      departmentId: jobDeptId ? parseInt(jobDeptId) : null
    };

    try {
      if (dbNotice) {
        const newJob = {
          id: Date.now(),
          title: jobTitle,
          description: jobDescription,
          departmentId: parseInt(jobDeptId),
          departmentName: departments.find(d => d.id === parseInt(jobDeptId))?.name || 'Unassigned',
          status: 'Open',
          createdAt: new Date().toISOString()
        };
        setJobs([newJob, ...jobs]);
      } else {
        await api.post('/recruitment/jobs', payload);
      }
      setIsAddJobOpen(false);
      if (!dbNotice) fetchData();
    } catch (err) {
      setJobError(err.response?.data?.message || 'Failed to post job');
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setCandError('');

    const payload = {
      jobId: parseInt(applyJobId),
      firstName: candFirst,
      lastName: candLast,
      email: candEmail,
      resumeUrl: candResume
    };

    try {
      if (dbNotice) {
        const selectedJob = jobs.find(j => j.id === parseInt(applyJobId));
        const newCand = {
          id: Date.now(),
          jobId: parseInt(applyJobId),
          jobTitle: selectedJob ? selectedJob.title : 'Position',
          firstName: candFirst,
          lastName: candLast,
          email: candEmail,
          resumeUrl: candResume,
          status: 'Applied',
          createdAt: new Date().toISOString()
        };
        setCandidates([newCand, ...candidates]);
      } else {
        await api.post('/recruitment/candidates', payload);
      }
      setIsApplyOpen(false);
      if (!dbNotice) fetchData();
      alert('Application submitted successfully!');
    } catch (err) {
      setCandError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  const handleJobStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
    try {
      if (dbNotice) {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: nextStatus } : j));
      } else {
        await api.patch(`/recruitment/jobs/${id}/status`, { status: nextStatus });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle job status');
    }
  };

  const handleCandidateStatusChange = async (id, nextStatus) => {
    try {
      if (dbNotice) {
        setCandidates(candidates.map(c => c.id === id ? { ...c, status: nextStatus } : c));
      } else {
        await api.patch(`/recruitment/candidates/${id}/status`, { status: nextStatus });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change candidate pipeline status');
    }
  };

  const isHRorAdmin = ['Admin', 'HR'].includes(user?.roleName);

  return (
    <div className="space-y-6">
      {dbNotice && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Local Mock Mode: Hiring boards and applications are handled in memory.</span>
        </div>
      )}

      {/* Tabs selectors and post job opening action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-2">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-2.5 text-sm font-bold tracking-wide transition-all border-b-2 ${
              activeTab === 'jobs' 
                ? 'border-brand-500 text-brand-400 font-extrabold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Job Openings
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`pb-2.5 text-sm font-bold tracking-wide transition-all border-b-2 ${
              activeTab === 'candidates' 
                ? 'border-brand-500 text-brand-400 font-extrabold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Candidates Pipeline
          </button>
        </div>

        {activeTab === 'jobs' && isHRorAdmin && (
          <button
            onClick={openAddJobModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      ) : activeTab === 'jobs' ? (
        /* Jobs List */
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">Job Title</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-slate-500">
                  No active job postings.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 font-semibold text-slate-200">{job.title}</td>
                  <td className="py-4 px-6 text-slate-400 max-w-sm truncate" title={job.description}>
                    {job.description}
                  </td>
                  <td className="py-4 px-6 text-slate-400">{job.departmentName || 'Unassigned'}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                      job.status === 'Open' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => openApplyModal(job)}
                      className="px-2 py-1 text-[10px] font-extrabold border border-slate-800 bg-slate-800/20 hover:bg-slate-800 hover:text-white text-slate-400 rounded-lg transition-all"
                      disabled={job.status === 'Closed'}
                    >
                      Apply Demo
                    </button>
                    {isHRorAdmin && (
                      <button
                        onClick={() => handleJobStatusToggle(job.id, job.status)}
                        className={`px-2 py-1 text-[10px] font-extrabold border rounded-lg transition-all ${
                          job.status === 'Open'
                            ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                            : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {job.status === 'Open' ? 'Close Post' : 'Reopen'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      ) : (
        /* Candidates Pipeline List */
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
              <th className="py-4 px-6">Candidate Name</th>
              <th className="py-4 px-6">Applying Position</th>
              <th className="py-4 px-6">Resume</th>
              <th className="py-4 px-6">Status Pipeline</th>
              {isHRorAdmin && <th className="py-4 px-6 text-right">Advance Stage</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={isHRorAdmin ? 5 : 4} className="py-8 px-6 text-center text-slate-500">
                  No job candidate applications yet.
                </td>
              </tr>
            ) : (
              candidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-900/10">
                  <td className="py-4 px-6 font-semibold text-slate-200">
                    {cand.firstName} {cand.lastName}
                    <span className="block text-[10px] text-slate-500 font-medium mt-0.5">{cand.email}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{cand.jobTitle}</td>
                  <td className="py-4 px-6 text-slate-400">
                    <a
                      href={cand.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-400 hover:underline hover:text-brand-300"
                    >
                      View Resume
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                      cand.status === 'Applied' 
                        ? 'bg-slate-800 text-slate-400' 
                        : cand.status === 'Interviewing'
                          ? 'bg-amber-500/10 text-amber-400'
                          : cand.status === 'Offered'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                    }`}>
                      {cand.status}
                    </span>
                  </td>
                  {isHRorAdmin && (
                    <td className="py-4 px-6 text-right space-x-1.5">
                      <select
                        value={cand.status}
                        onChange={(e) => handleCandidateStatusChange(cand.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-300 py-1 px-1.5 focus:outline-none focus:border-brand-500"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Post Job Opening Modal */}
      <Modal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        title="Post Hiring Opening"
      >
        <form onSubmit={handleAddJobSubmit} className="space-y-4">
          {jobError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {jobError}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department</label>
            <select
              value={jobDeptId}
              onChange={(e) => setJobDeptId(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Outline role responsibilities, stack requirements, and payroll benefits..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            Publish Posting
          </button>
        </form>
      </Modal>

      {/* Candidate Apply Demo Modal */}
      <Modal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="Simulate Candidate Application"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          {candError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
              {candError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">First Name</label>
              <input
                type="text"
                value={candFirst}
                onChange={(e) => setCandFirst(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Last Name</label>
              <input
                type="text"
                value={candLast}
                onChange={(e) => setCandLast(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={candEmail}
              onChange={(e) => setCandEmail(e.target.value)}
              placeholder="candidate@gmail.com"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Resume Document URL</label>
            <input
              type="text"
              value={candResume}
              onChange={(e) => setCandResume(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs shadow-md transition-all mt-4"
          >
            Submit Application
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Recruitment;
