import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function JobList({ user }) {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get(`/jobs${search ? `?search=${search}` : ''}`);
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  return (
    <div className="container">
      <h2 style={{marginBottom: '24px', color: '#1f2937', fontSize: '24px', fontWeight: '600'}}>Available Jobs</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search jobs by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        {jobs.map(job => (
          <div key={job._id} className="card job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
            <h3 style={{marginBottom: '8px', color: '#1f2937', fontSize: '18px'}}>{job.title}</h3>
            <p style={{marginBottom: '12px', color: '#6b7280', fontSize: '15px'}}><strong>{job.company}</strong> • {job.location}</p>
            <div className="job-description" style={{maxHeight: '80px', overflow: 'hidden', fontSize: '14px'}}>
              {job.description.substring(0, 200)}...
            </div>
            <div style={{marginTop: '12px', display: 'flex', gap: '12px', fontSize: '14px', color: '#6b7280'}}>
              <span><strong>Type:</strong> {job.type}</span>
              {job.salary && <span><strong>Salary:</strong> {job.salary}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;
