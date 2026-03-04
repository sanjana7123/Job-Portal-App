import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function UserDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications/my-applications');
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  return (
    <div className="container">
      <h2 style={{marginBottom: '24px', color: '#1f2937', fontSize: '24px', fontWeight: '600'}}>My Applications</h2>
      {applications.length === 0 ? (
        <p style={{color: '#6b7280'}}>You haven't applied to any jobs yet.</p>
      ) : (
        applications.map(app => (
          <div key={app._id} className="card">
            <h3 style={{marginBottom: '8px', color: '#1f2937', fontSize: '18px'}}>{app.jobId?.title}</h3>
            <p style={{marginBottom: '6px', color: '#6b7280', fontSize: '14px'}}><strong>Company:</strong> {app.jobId?.company}</p>
            <p style={{marginBottom: '6px', color: '#6b7280', fontSize: '14px'}}><strong>Location:</strong> {app.jobId?.location}</p>
            <p style={{marginBottom: '12px', color: '#6b7280', fontSize: '14px'}}><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
            <span className={`badge badge-${app.status}`}>
              {app.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default UserDashboard;
