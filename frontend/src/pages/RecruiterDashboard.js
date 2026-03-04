import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getBaseURL } from '../api/axios';

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [viewingApplicant, setViewingApplicant] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    location: '',
    notes: ''
  });
  const [activeTab, setActiveTab] = useState('jobs');
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
    if (activeTab === 'interviews') {
      fetchInterviews();
    }
  }, [activeTab]);

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

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get('/applications/recruiter/interviews');
      setInterviews(data);
    } catch (err) {
      console.error('Error fetching interviews:', err);
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
      if (status === 'interview_scheduled') {
        fetchInterviews();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleScheduleInterview = (app) => {
    setSelectedApplication(app);
    setShowInterviewModal(true);
  };

  const submitInterviewSchedule = async () => {
    if (!interviewDetails.date || !interviewDetails.time) {
      alert('Please provide date and time for the interview');
      return;
    }

    try {
      await api.patch(`/applications/${selectedApplication._id}/status`, {
        status: 'interview_scheduled',
        interviewDetails
      });
      setShowInterviewModal(false);
      setInterviewDetails({ date: '', time: '', location: '', notes: '' });
      fetchApplicants(selectedJob);
      fetchInterviews();
      alert('Interview scheduled successfully!');
    } catch (err) {
      alert('Failed to schedule interview');
    }
  };

  const handleViewResume = async (app) => {
    if (app.status === 'submitted') {
      try {
        await api.patch(`/applications/${app._id}/status`, { status: 'resume_viewed' });
        fetchApplicants(selectedJob);
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    }
    
    if (app.userId?.profile?.resume?.url) {
      window.open(`${getBaseURL()}${app.userId.profile.resume.url}`, '_blank');
    }
  };

  const handleViewProfile = async (userId) => {
    const applicant = applicants.find(app => app.userId._id === userId);
    if (applicant && applicant.status === 'submitted') {
      try {
        await api.patch(`/applications/${applicant._id}/status`, { status: 'resume_viewed' });
        fetchApplicants(selectedJob);
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    }
    setViewingApplicant(applicants.find(app => app.userId._id === userId)?.userId);
  };

  return (
    <div className="container">
      <div style={{marginBottom: '24px', borderBottom: '2px solid #e5e7eb'}}>
        <div style={{display: 'flex', gap: '24px'}}>
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'jobs' ? '2px solid #2563eb' : 'none',
              color: activeTab === 'jobs' ? '#2563eb' : '#6b7280',
              fontWeight: activeTab === 'jobs' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            My Jobs
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'interviews' ? '2px solid #2563eb' : 'none',
              color: activeTab === 'interviews' ? '#2563eb' : '#6b7280',
              fontWeight: activeTab === 'interviews' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Scheduled Interviews
          </button>
        </div>
      </div>

      {activeTab === 'jobs' && (
        <>
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
                <p style={{color: '#6b7280'}}>No applicants yet.</p>
              ) : (
                applicants.map(app => (
                  <div key={app._id} className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px'}}>
                      <div style={{flex: 1, minWidth: '200px'}}>
                        <p style={{marginBottom: '6px', color: '#1f2937'}}><strong>Name:</strong> {app.userId?.name}</p>
                        <p style={{marginBottom: '6px', color: '#6b7280', fontSize: '14px'}}><strong>Email:</strong> {app.userId?.email}</p>
                        <p style={{marginBottom: '10px', color: '#6b7280', fontSize: '14px'}}><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                          <span><strong>Status:</strong></span>
                          <span className={`badge badge-${app.status}`}>{app.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewProfile(app.userId._id)} 
                        className="btn btn-secondary"
                        style={{alignSelf: 'flex-start'}}
                      >
                        View Profile
                      </button>
                    </div>
                    <div className="btn-group">
                      {app.userId?.profile?.resume?.url && (
                        <button 
                          onClick={() => handleViewResume(app)} 
                          className="btn btn-secondary"
                        >
                          View Resume
                        </button>
                      )}
                      <button onClick={() => updateStatus(app._id, 'shortlisted')} className="btn btn-success">
                        Shortlist
                      </button>
                      <button onClick={() => handleScheduleInterview(app)} className="btn btn-primary">
                        Schedule Interview
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
        </>
      )}

      {activeTab === 'interviews' && (
        <>
          <h2 style={{marginBottom: '24px', color: '#1f2937', fontSize: '24px', fontWeight: '600'}}>Scheduled Interviews</h2>
          {interviews.length === 0 ? (
            <p style={{color: '#6b7280'}}>No interviews scheduled yet.</p>
          ) : (
            interviews.map(interview => (
              <div key={interview._id} className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px'}}>
                  <div style={{flex: 1, minWidth: '200px'}}>
                    <h3 style={{marginBottom: '8px', color: '#1f2937'}}>{interview.userId?.name}</h3>
                    <p style={{marginBottom: '6px', color: '#6b7280', fontSize: '14px'}}>
                      <strong>Position:</strong> {interview.jobId?.title} at {interview.jobId?.company}
                    </p>
                    <p style={{marginBottom: '6px', color: '#6b7280', fontSize: '14px'}}>
                      <strong>Email:</strong> {interview.userId?.email}
                    </p>
                    {interview.userId?.profile?.phone && (
                      <p style={{marginBottom: '6px', color: '#6b7280', fontSize: '14px'}}>
                        <strong>Phone:</strong> {interview.userId.profile.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="profile-item" style={{background: '#eff6ff', borderColor: '#bfdbfe'}}>
                  {interview.interviewDetails?.date && (
                    <p style={{marginBottom: '6px'}}><strong>Date:</strong> {new Date(interview.interviewDetails.date).toLocaleDateString()}</p>
                  )}
                  {interview.interviewDetails?.time && (
                    <p style={{marginBottom: '6px'}}><strong>Time:</strong> {interview.interviewDetails.time}</p>
                  )}
                  {interview.interviewDetails?.location && (
                    <p style={{marginBottom: '6px'}}><strong>Location:</strong> {interview.interviewDetails.location}</p>
                  )}
                  {interview.interviewDetails?.notes && (
                    <p style={{marginTop: '12px'}}><strong>Notes:</strong> {interview.interviewDetails.notes}</p>
                  )}
                </div>
                <div className="btn-group">
                  <button 
                    onClick={() => handleViewProfile(interview.userId._id)} 
                    className="btn btn-secondary"
                  >
                    View Profile
                  </button>
                  {interview.userId?.profile?.resume?.url && (
                    <a 
                      href={`${getBaseURL()}${interview.userId.profile.resume.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {showInterviewModal && (
        <div className="modal-overlay" onClick={() => setShowInterviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <h3>Schedule Interview</h3>
            <p style={{marginBottom: '16px', color: '#6b7280'}}>
              Scheduling interview for {selectedApplication?.userId?.name}
            </p>
            <div className="form-group">
              <label>Interview Date</label>
              <input
                type="date"
                value={interviewDetails.date}
                onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Interview Time</label>
              <input
                type="time"
                value={interviewDetails.time}
                onChange={(e) => setInterviewDetails({...interviewDetails, time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Location (Optional)</label>
              <input
                type="text"
                value={interviewDetails.location}
                onChange={(e) => setInterviewDetails({...interviewDetails, location: e.target.value})}
                placeholder="e.g., Office, Zoom link, etc."
              />
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={interviewDetails.notes}
                onChange={(e) => setInterviewDetails({...interviewDetails, notes: e.target.value})}
                placeholder="Any additional information..."
                rows="3"
              />
            </div>
            <div className="btn-group">
              <button onClick={submitInterviewSchedule} className="btn btn-primary">
                Schedule Interview
              </button>
              <button onClick={() => setShowInterviewModal(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingApplicant && (
        <div className="modal-overlay" onClick={() => setViewingApplicant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px'}}>
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

              {viewingApplicant.profile?.resume?.url && (
                <div style={{marginTop: '20px'}}>
                  <strong>Resume:</strong>
                  <div className="profile-item" style={{marginTop: '10px'}}>
                    <p>{viewingApplicant.profile.resume.filename}</p>
                    <a 
                      href={`${getBaseURL()}${viewingApplicant.profile.resume.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{marginTop: '10px'}}
                    >
                      View Resume
                    </a>
                  </div>
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
