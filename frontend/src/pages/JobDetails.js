import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function JobDetails({ user }) {
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data);
    } catch (err) {
      console.error('Error fetching job:', err);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/applications', { jobId: id });
      setApplied(true);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (!job) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{marginBottom: '8px', color: '#1f2937', fontSize: '28px'}}>{job.title}</h2>
        <h3 style={{marginBottom: '16px', color: '#6b7280', fontSize: '20px', fontWeight: '500'}}>{job.company}</h3>
        <div style={{display: 'flex', gap: '24px', marginBottom: '24px', fontSize: '14px', color: '#6b7280'}}>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Type:</strong> {job.type}</p>
          {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
        </div>
        <hr style={{margin: '24px 0', border: 'none', borderTop: '1px solid #e5e7eb'}} />
        <h4 style={{marginBottom: '12px', color: '#1f2937', fontSize: '18px', fontWeight: '600'}}>Description</h4>
        <div className="job-description">{job.description}</div>
        {user?.role === 'user' && (
          <button 
            onClick={handleApply} 
            className="btn btn-primary"
            disabled={applied}
            style={{marginTop: '24px'}}
          >
            {applied ? 'Applied' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
}

export default JobDetails;
