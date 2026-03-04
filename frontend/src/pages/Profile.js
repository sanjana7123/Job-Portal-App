import React, { useState, useEffect } from 'react';
import api, { getBaseURL } from '../api/axios';

function Profile() {
  const [profile, setProfile] = useState({
    phone: '',
    location: '',
    bio: '',
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    resume: null
  });
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/profile', { profile });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const { data } = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfile({
        ...profile,
        resume: data
      });
      
      alert('Resume uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { degree: '', institution: '', year: '' }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...profile.education];
    updated[index][field] = value;
    setProfile({ ...profile, education: updated });
  };

  const removeEducation = (index) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { title: '', company: '', duration: '', description: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...profile.experience];
    updated[index][field] = value;
    setProfile({ ...profile, experience: updated });
  };

  const removeExperience = (index) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    setProfile({
      ...profile,
      certifications: [...profile.certifications, { name: '', issuer: '', year: '' }]
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...profile.certifications];
    updated[index][field] = value;
    setProfile({ ...profile, certifications: updated });
  };

  const removeCertification = (index) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2>My Profile</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn btn-primary">
              Edit Profile
            </button>
          ) : (
            <div className="btn-group">
              <button onClick={handleSave} className="btn btn-success">
                Save Changes
              </button>
              <button onClick={() => setEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              disabled={!editing}
              rows="4"
            />
          </div>
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          {profile.education.map((edu, index) => (
            <div key={index} className="profile-item">
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  disabled={!editing}
                />
              </div>
              {editing && (
                <button onClick={() => removeEducation(index)} className="btn btn-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          {editing && (
            <button onClick={addEducation} className="btn btn-secondary">
              + Add Education
            </button>
          )}
        </div>

        <div className="profile-section">
          <h3>Experience</h3>
          {profile.experience.map((exp, index) => (
            <div key={index} className="profile-item">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g., Jan 2020 - Dec 2022"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  disabled={!editing}
                  rows="3"
                />
              </div>
              {editing && (
                <button onClick={() => removeExperience(index)} className="btn btn-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          {editing && (
            <button onClick={addExperience} className="btn btn-secondary">
              + Add Experience
            </button>
          )}
        </div>

        <div className="profile-section">
          <h3>Skills</h3>
          <div>
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                {editing && (
                  <span 
                    onClick={() => removeSkill(index)} 
                    style={{marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                  >
                    ×
                  </span>
                )}
              </span>
            ))}
          </div>
          {editing && (
            <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill"
                style={{flex: 1}}
              />
              <button onClick={addSkill} className="btn btn-secondary">
                Add
              </button>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Certifications</h3>
          {profile.certifications.map((cert, index) => (
            <div key={index} className="profile-item">
              <div className="form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Issuer</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={cert.year}
                  onChange={(e) => updateCertification(index, 'year', e.target.value)}
                  disabled={!editing}
                />
              </div>
              {editing && (
                <button onClick={() => removeCertification(index)} className="btn btn-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          {editing && (
            <button onClick={addCertification} className="btn btn-secondary">
              + Add Certification
            </button>
          )}
        </div>

        <div className="profile-section">
          <h3>Resume</h3>
          {profile.resume?.url ? (
            <div className="profile-item">
              <p><strong>Current Resume:</strong> {profile.resume.filename}</p>
              <p style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>
                Uploaded: {new Date(profile.resume.uploadedAt).toLocaleDateString()}
              </p>
              <div className="btn-group" style={{marginTop: '12px'}}>
                <a 
                  href={`${getBaseURL()}${profile.resume.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View Resume
                </a>
                {editing && (
                  <label className="btn btn-primary" style={{cursor: 'pointer'}}>
                    {uploading ? 'Uploading...' : 'Upload New'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{display: 'none'}}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            </div>
          ) : (
            <div className="profile-item">
              <p style={{color: '#6b7280', marginBottom: '12px'}}>No resume uploaded</p>
              {editing && (
                <label className="btn btn-primary" style={{cursor: 'pointer'}}>
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    style={{display: 'none'}}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          )}
          {editing && (
            <p style={{fontSize: '12px', color: '#6b7280', marginTop: '8px'}}>
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
