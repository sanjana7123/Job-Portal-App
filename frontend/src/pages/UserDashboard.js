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
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px'}}>
              <span><strong>Status:</strong></span>
              <span className={`badge badge-${app.status}`}>
                {app.status.replace('_', ' ')}
              </span>
            </div>
            
            {app.status === 'interview_scheduled' && app.interviewDetails && (
              <div className="profile-item" style={{background: '#eff6ff', borderColor: '#bfdbfe', marginTop: '12px'}}>
                <h4 style={{marginBottom: '12px', color: '#1e40af', fontSize: '16px'}}>Interview Details</h4>
                <p style={{marginBottom: '6px', fontSize: '14px'}}>
                  <strong>Date:</strong> {new Date(app.interviewDetails.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p style={{marginBottom: '6px', fontSize: '14px'}}>
                  <strong>Time:</strong> {app.interviewDetails.time}
                </p>
                {app.interviewDetails.location && (
                  <p style={{marginBottom: '6px', fontSize: '14px'}}>
                    <strong>Location:</strong> {app.interviewDetails.location}
                  </p>
                )}
                {app.interviewDetails.notes && (
                  <div style={{marginTop: '12px', padding: '12px', background: 'white', borderRadius: '4px', border: '1px solid #dbeafe'}}>
                    <strong style={{fontSize: '14px'}}>Additional Notes:</strong>
                    <p style={{marginTop: '6px', fontSize: '14px', color: '#4b5563'}}>{app.interviewDetails.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserDashboard;
