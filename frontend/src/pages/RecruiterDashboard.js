import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [viewingApplicant, setViewingApplicant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const { data } = await api.get('/jobs/recruiter/my-jobs');
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplicants(data);
      setSelectedJob(jobId);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchMyJobs();
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      fetchApplicants(selectedJob);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container">
      <h2 style={{marginBottom: '24px', color: '#1f2937', fontSize: '24px', fontWeight: '600'}}>My Job Posts</h2>
      {jobs.map(job => (
        <div key={job._id} className="card">
          <h3 style={{marginBottom: '12px', color: '#1f2937'}}>{job.title}</h3>
          <p style={{marginBottom: '6px', color: '#6b7280'}}><strong>Company:</strong> {job.company}</p>
          <p style={{marginBottom: '12px', color: '#6b7280'}}><strong>Location:</strong> {job.location}</p>
          <div className="job-description" style={{maxHeight: '60px', overflow: 'hidden', fontSize: '14px'}}>
            {job.description.substring(0, 100)}...
          </div>
          <div className="btn-group">
            <button onClick={() => navigate(`/edit-job/${job._id}`)} className="btn btn-primary">
              Edit
            </button>
            <button onClick={() => handleDelete(job._id)} className="btn btn-danger">
              Delete
            </button>
            <button onClick={() => fetchApplicants(job._id)} className="btn btn-secondary">
              View Applicants
            </button>
          </div>
        </div>
      ))}

      {selectedJob && (
        <>
          <h2 style={{marginTop: '48px', marginBottom: '24px', color: '#1f2937', fontSize: '24px', fontWeight: '600'}}>Applicants</h2>
          {applicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            applicants.map(app => (
              <div key={app._id} className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
                  <div style={{flex: 1}}>
                    <p style={{marginBottom: '6px', color: '#1f2937'}}><strong>Name:</strong> {app.userId?.name}</p>
                    <p style={{marginBottom: '6px', color: '#6b7280', fontSize: '14px'}}><strong>Email:</strong> {app.userId?.email}</p>
                    <p style={{marginBottom: '10px', color: '#6b7280', fontSize: '14px'}}><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                    <span className={`badge badge-${app.status}`}>{app.status}</span>
                  </div>
                  <button 
                    onClick={() => setViewingApplicant(app.userId)} 
                    className="btn btn-secondary"
                  >
                    View Profile
                  </button>
                </div>
                <div className="btn-group">
                  <button onClick={() => updateStatus(app._id, 'shortlisted')} className="btn btn-success">
                    Shortlist
                  </button>
                  <button onClick={() => updateStatus(app._id, 'rejected')} className="btn btn-danger">
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {viewingApplicant && (
        <div className="modal-overlay" onClick={() => setViewingApplicant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px', maxHeight: '80vh', overflow: 'auto'}}>
            <h3>Applicant Profile</h3>
            <div style={{marginTop: '20px'}}>
              <p><strong>Name:</strong> {viewingApplicant.name}</p>
              <p><strong>Email:</strong> {viewingApplicant.email}</p>
              
              {viewingApplicant.profile?.phone && (
                <p><strong>Phone:</strong> {viewingApplicant.profile.phone}</p>
              )}
              {viewingApplicant.profile?.location && (
                <p><strong>Location:</strong> {viewingApplicant.profile.location}</p>
              )}
              {viewingApplicant.profile?.bio && (
                <div style={{marginTop: '15px'}}>
                  <strong>Bio:</strong>
                  <p style={{marginTop: '5px'}}>{viewingApplicant.profile.bio}</p>
                </div>
              )}

              {viewingApplicant.profile?.education?.length > 0 && (
                <div style={{marginTop: '20px'}}>
                  <strong>Education:</strong>
                  {viewingApplicant.profile.education.map((edu, i) => (
                    <div key={i} className="profile-item" style={{marginTop: '10px'}}>
                      <p><strong>{edu.degree}</strong></p>
                      <p>{edu.institution} - {edu.year}</p>
                    </div>
                  ))}
                </div>
              )}

              {viewingApplicant.profile?.experience?.length > 0 && (
                <div style={{marginTop: '20px'}}>
                  <strong>Experience:</strong>
                  {viewingApplicant.profile.experience.map((exp, i) => (
                    <div key={i} className="profile-item" style={{marginTop: '10px'}}>
                      <p><strong>{exp.title}</strong> at {exp.company}</p>
                      <p>{exp.duration}</p>
                      <p style={{marginTop: '5px'}}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {viewingApplicant.profile?.skills?.length > 0 && (
                <div style={{marginTop: '20px'}}>
                  <strong>Skills:</strong>
                  <div style={{marginTop: '10px'}}>
                    {viewingApplicant.profile.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {viewingApplicant.profile?.certifications?.length > 0 && (
                <div style={{marginTop: '20px'}}>
                  <strong>Certifications:</strong>
                  {viewingApplicant.profile.certifications.map((cert, i) => (
                    <div key={i} className="profile-item" style={{marginTop: '10px'}}>
                      <p><strong>{cert.name}</strong></p>
                      <p>{cert.issuer} - {cert.year}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setViewingApplicant(null)} 
              className="btn btn-secondary"
              style={{marginTop: '20px'}}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
